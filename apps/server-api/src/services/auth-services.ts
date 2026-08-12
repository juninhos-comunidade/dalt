import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function createAuthService(prisma: PrismaClient) {
  return {
    async register(
      email: string,
      password: string,
      roleName = "APRENDIZ",
      name?: string,
    ) {
      // do not allow clients to register as MASTER
      const normalizedRole = String(roleName || "APRENDIZ").toUpperCase();
      if (normalizedRole === "MASTER") throw new Error("INVALID_ROLE");
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error("EMAIL_ALREADY_EXISTS");

      const hash = await argon2.hash(password);

      const role = await prisma.role.findUnique({ where: { name: roleName } });
      const roleId = role ? role.id : undefined;

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hash,
          roleId,
          name: name || email,
        },
      });

      return { id: user.id, email: user.email, roleId: user.roleId };
    },

    async login(email: string, password: string) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("INVALID_CREDENTIALS");

      const ok = await argon2.verify(user.passwordHash, password);
      if (!ok) throw new Error("INVALID_CREDENTIALS");

      // load role
      const role = user.roleId
        ? await prisma.role.findUnique({ where: { id: user.roleId } })
        : null;

      const accessToken = jwt.sign(
        { sub: user.id, role: role?.name || null },
        JWT_SECRET,
        { expiresIn: "15m" },
      );

      // create refresh token (opaque) stored in DB as a hashed value
      const refreshTokenValue = crypto.randomBytes(48).toString("hex");
      const hashed = crypto
        .createHash("sha256")
        .update(refreshTokenValue)
        .digest("hex");
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await prisma.refreshToken.create({
        data: {
          token: hashed,
          userId: user.id,
          expiresAt,
        },
      });

      return { accessToken, refreshToken: refreshTokenValue };
    },

    async refresh(oldToken: string) {
      // incoming oldToken is the raw token; compare against stored hash
      const oldHashed = crypto
        .createHash("sha256")
        .update(oldToken)
        .digest("hex");
      const record = await prisma.refreshToken.findUnique({
        where: { token: oldHashed },
      });
      if (!record || record.revoked) throw new Error("INVALID_REFRESH_TOKEN");
      if (record.expiresAt.getTime() < Date.now())
        throw new Error("EXPIRED_REFRESH_TOKEN");

      // rotate: revoke old and create new
      await prisma.refreshToken.update({
        where: { id: record.id },
        data: { revoked: true },
      });

      const user = await prisma.user.findUnique({
        where: { id: record.userId },
      });
      if (!user) throw new Error("INVALID_REFRESH_TOKEN");

      const role = user.roleId
        ? await prisma.role.findUnique({ where: { id: user.roleId } })
        : null;
      const accessToken = jwt.sign(
        { sub: user.id, role: role?.name || null },
        JWT_SECRET,
        { expiresIn: "15m" },
      );

      const newRefreshTokenValue = crypto.randomBytes(48).toString("hex");
      const newHashed = crypto
        .createHash("sha256")
        .update(newRefreshTokenValue)
        .digest("hex");
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await prisma.refreshToken.create({
        data: { token: newHashed, userId: user.id, expiresAt },
      });

      return { accessToken, refreshToken: newRefreshTokenValue };
    },

    async revokeRefresh(token: string) {
      const hashed = crypto.createHash("sha256").update(token).digest("hex");
      await prisma.refreshToken.updateMany({
        where: { token: hashed },
        data: { revoked: true },
      });
    },
  };
}
