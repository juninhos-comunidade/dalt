import { FastifyPluginAsync } from "fastify";
import authenticate from "../plugins/jwt-middleware";

const plugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get(
    "/",
    { preHandler: authenticate as any },
    async (request, reply) => {
      const user = (request as any).user || null;
      return reply.send({ success: true, user });
    },
  );
};

export default plugin;
