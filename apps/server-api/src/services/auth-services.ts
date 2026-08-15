import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// MOCKS EM MEMÓRIA PARA TESTES INICIAIS
const mockUsers: any[] = [];
const mockRoles: any[] = [
  { id: 1, name: "MASTER" },
  { id: 2, name: "MENTOR" },
  { id: 3, name: "APRENDIZ" }
];
const mockRefreshTokens: any[] = [];
let userIdCounter = 1;
let tokenIdCounter = 1;

export function createAuthService(prisma: PrismaClient) {
  return {
    async register(
      email: string,
      password: string,
      roleName = "APRENDIZ",
      name?: string,
    ) {
      if (!password || password.length < 6) throw new Error("WEAK_PASSWORD");

      const normalizedRole = String(roleName || "APRENDIZ").toUpperCase();
      if (normalizedRole === "MASTER") throw new Error("INVALID_ROLE");
      
      const existing = mockUsers.find(u => u.email === email);
      if (existing) throw new Error("EMAIL_ALREADY_EXISTS");

      const hash = await argon2.hash(password);
      const role = mockRoles.find(r => r.name === normalizedRole);
      const roleId = role ? role.id : undefined;

      const user = {
        id: userIdCounter++,
        email,
        passwordHash: hash,
        roleId,
        name: name || email,
      };
      mockUsers.push(user);

      return { id: user.id, email: user.email, roleId: user.roleId };
    },

    async login(email: string, password: string) {
      const user = mockUsers.find(u => u.email === email);
      if (!user) throw new Error("INVALID_CREDENTIALS");

      const ok = await argon2.verify(user.passwordHash, password);
      if (!ok) throw new Error("INVALID_CREDENTIALS");

      const role = user.roleId ? mockRoles.find(r => r.id === user.roleId) : null;

      const accessToken = jwt.sign(
        { sub: user.id, role: role?.name || null, name: user.name },
        JWT_SECRET,
        { expiresIn: "15m" },
      );

      const refreshTokenValue = crypto.randomBytes(48).toString("hex");
      const hashed = crypto
        .createHash("sha256")
        .update(refreshTokenValue)
        .digest("hex");
      
      mockRefreshTokens.push({
        id: tokenIdCounter++,
        token: hashed,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        revoked: false
      });

      return { 
        accessToken, 
        refreshToken: refreshTokenValue,
        user: { id: user.id, name: user.name, email: user.email, role: role?.name || null }
      };
    },

    async refresh(oldToken: string) {
      const oldHashed = crypto
        .createHash("sha256")
        .update(oldToken)
        .digest("hex");
      
      const record = mockRefreshTokens.find(rt => rt.token === oldHashed);
      if (!record || record.revoked) throw new Error("INVALID_REFRESH_TOKEN");
      if (record.expiresAt.getTime() < Date.now())
        throw new Error("EXPIRED_REFRESH_TOKEN");

      record.revoked = true;

      const user = mockUsers.find(u => u.id === record.userId);
      if (!user) throw new Error("INVALID_REFRESH_TOKEN");

      const role = user.roleId ? mockRoles.find(r => r.id === user.roleId) : null;
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
      
      mockRefreshTokens.push({
        id: tokenIdCounter++,
        token: newHashed,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        revoked: false
      });

      return { accessToken, refreshToken: newRefreshTokenValue };
    },

    async revokeRefresh(token: string) {
      const hashed = crypto.createHash("sha256").update(token).digest("hex");
      mockRefreshTokens.forEach(rt => {
        if (rt.token === hashed) rt.revoked = true;
      });
    },
  };
}
