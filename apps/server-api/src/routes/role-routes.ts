import { FastifyPluginAsync } from "fastify";
import { requireRole } from "../plugins/role-guard";

const roleRoutes: FastifyPluginAsync = async (app) => {
  // Endpoint to create content - only MENTOR or MASTER
  app.post(
    "/create",
    { preHandler: requireRole(["MENTOR", "MASTER"]) },
    async (request, reply) => {
      const { title } = request.body as any;
      return reply.send({ success: true, data: { title, createdBy: (request as any).user.id } });
    },
  );

  // Endpoint to approve content - only MASTER
  app.post(
    "/approve",
    { preHandler: requireRole("MASTER") },
    async (request, reply) => {
      const { contentId } = request.body as any;
      return reply.send({ success: true, data: { contentId, approvedBy: (request as any).user.id } });
    },
  );
};

export default roleRoutes;
