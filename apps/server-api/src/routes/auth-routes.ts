import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import { createAuthService } from "../services/auth-services";

const plugin: FastifyPluginAsync = async (fastify, opts) => {
  const prisma = new PrismaClient();
  const authService = createAuthService(prisma);

  fastify.post("/register", async (request, reply) => {
    const { email, password, role } = request.body as any;
    if (!email || !password)
      return reply.status(400).send({ error: "email and password required" });
    try {
      const user = await authService.register(email, password, role);
      return reply.status(201).send({ success: true, data: user });
    } catch (err: any) {
      if (err.message === "EMAIL_ALREADY_EXISTS")
        return reply.status(409).send({ error: "email already exists" });
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as any;
    if (!email || !password)
      return reply.status(400).send({ error: "email and password required" });
    try {
      const tokens = await authService.login(email, password);
      return reply.send({ success: true, data: tokens });
    } catch (err: any) {
      return reply.status(401).send({ error: "invalid credentials" });
    }
  });

  fastify.post("/refresh", async (request, reply) => {
    const { refreshToken } = request.body as any;
    if (!refreshToken)
      return reply.status(400).send({ error: "refreshToken required" });
    try {
      const tokens = await authService.refresh(refreshToken);
      return reply.send({ success: true, data: tokens });
    } catch (err: any) {
      return reply.status(401).send({ error: "invalid refresh token" });
    }
  });

  fastify.post("/logout", async (request, reply) => {
    const { refreshToken } = request.body as any;
    if (!refreshToken)
      return reply.status(400).send({ error: "refreshToken required" });
    try {
      await authService.revokeRefresh(refreshToken);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.status(400).send({ error: "could not revoke" });
    }
  });
};

export default plugin;
