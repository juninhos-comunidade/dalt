import { FastifyPluginAsync } from "fastify";
import authenticate from "../plugins/jwt-middleware";
import { authorize } from "../plugins/role-guard";

const plugin: FastifyPluginAsync = async (fastify, opts) => {
  // content creation: MENTOR or MASTER
  fastify.post(
    "/create",
    { preHandler: [authenticate as any, authorize(["MENTOR", "MASTER"]) as any] },
    async (request, reply) => {
      // minimal create simulation
      return reply.status(201).send({ success: true });
    },
  );

  // approval: only MASTER
  fastify.post(
    "/approve",
    { preHandler: [authenticate as any, authorize(["MASTER"]) as any] },
    async (request, reply) => {
      return reply.status(200).send({ success: true });
    },
  );
};

export default plugin;
