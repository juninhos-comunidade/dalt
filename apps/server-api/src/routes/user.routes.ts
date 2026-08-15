import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import authenticate from "../plugins/jwt-middleware";

const prisma = new PrismaClient();

const plugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get(
    "/",
    { preHandler: authenticate as any },
    async (request, reply) => {
      const currentUser = (request as any).user;
      
      try {
        // Busca todos os usuários, mas omite a senha por segurança
        const users = await prisma.user.findMany({
          where: {
            id: { not: currentUser.id } // Não listar a si mesmo
          },
          select: {
            id: true,
            email: true,
            role: {
              select: {
                name: true
              }
            }
          }
        });
        
        return reply.send({ success: true, data: users });
      } catch (error) {
        return reply.status(500).send({ success: false, error: (error as Error).message });
      }
    }
  );
};

export default plugin;
