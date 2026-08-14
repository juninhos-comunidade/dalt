import { FastifyReply, FastifyRequest } from "fastify";

export function authorize(allowed: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    if (!user || !user.role)
      return reply.status(401).send({ error: "missing role" });
    if (!allowed.includes(String(user.role).toUpperCase()))
      return reply.status(403).send({ error: "forbidden" });
  };
}

export const isMaster = (role?: string) =>
  String(role || "").toUpperCase() === "MASTER";
export const isMentor = (role?: string) =>
  String(role || "").toUpperCase() === "MENTOR";
export const isAprendiz = (role?: string) =>
  String(role || "").toUpperCase() === "APRENDIZ";
