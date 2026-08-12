import { FastifyRequest, FastifyReply } from "fastify";

export function requireRole(allowed: string | string[]) {
  const allowedArr = Array.isArray(allowed) ? allowed : [allowed];

  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    if (!user || !user.role) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    if (!allowedArr.includes(user.role)) {
      return reply.status(403).send({ error: "Forbidden" });
    }

    // authorized
    return;
  };
}
