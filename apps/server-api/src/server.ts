import fastify from "fastify";
import { createMentorshipService } from "./services/mentorship-services";
import { inMemoryMentorshipRepository } from "./repositories/in-memory-mentorship-repository";
import { createProfileService } from "./services/profile-services";
import { inMemoryProfileRepository } from "./repositories/in-memory-profile-repository";
import authRoutes from "./routes/auth-routes";
import protectedRoutes from "./routes/protected-routes";
import roleRoutes from "./routes/role-routes";
import authenticate from "./plugins/jwt-middleware";
import { authorize } from "./plugins/role-guard";

export function buildServer(opts = { logger: true }) {
  const app = fastify(opts as any);

  const mentorshipService = createMentorshipService(
    inMemoryMentorshipRepository,
  );
  const createProfile = createProfileService(inMemoryProfileRepository);

  app.post(
    "/mentorship/request",
    { preHandler: [authenticate as any] },
    async (request, reply) => {
      const { novatoId, padrinhoId, objetivo } = request.body as any;
      try {
        const result = await mentorshipService.requestMentorship(
          novatoId,
          padrinhoId,
          objetivo,
        );
        return reply.send({ success: true, data: result });
      } catch (error) {
        return reply
          .status(400)
          .send({ success: false, error: (error as Error).message });
      }
    },
  );
  app.post(
    "/mentorship/respond",
    {
      preHandler: [authenticate as any, authorize(["MENTOR", "MASTER"]) as any],
    },
    async (request, reply) => {
      const { requestId, decision } = request.body as any;
      try {
        const result = await mentorshipService.respondToRequest(
          requestId,
          decision,
        );
        return reply.send({ success: true, data: result });
      } catch (error) {
        return reply
          .status(400)
          .send({ success: false, error: (error as Error).message });
      }
    },
  );

  app.post(
    "/profile",
    { preHandler: [authenticate as any, authorize(["MASTER"]) as any] },
    async (request, reply) => {
      const { fullName, role } = request.body as any;
      try {
        const result = await createProfile(fullName, role);
        return reply.send({ success: true, data: result });
      } catch (error) {
        return reply
          .status(400)
          .send({ success: false, error: (error as Error).message });
      }
    },
  );

  // auth routes (register/login)
  app.register(authRoutes, { prefix: "/auth" });

  // protected test route
  app.register(protectedRoutes, { prefix: "/protected" });

  // role test routes
  app.register(roleRoutes, { prefix: "/content" });

  return app;
}

if (require.main === module) {
  const start = async () => {
    try {
      const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
      const app = buildServer({ logger: true });
      await app.listen({ port, host: "0.0.0.0" });
      console.log(`Server listening on port ${port}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };

  start();
}
