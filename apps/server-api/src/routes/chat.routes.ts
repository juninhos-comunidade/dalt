import { FastifyPluginAsync } from "fastify";
import authenticate from "../plugins/jwt-middleware";
import { PrismaClient } from "@prisma/client";
import { createChatService } from "../services/chat.service";

const prisma = new PrismaClient();
const chatService = createChatService(prisma);

const plugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify.post(
    "/direct",
    { preHandler: authenticate as any },
    async (request, reply) => {
      const user = (request as any).user;
      const { targetUserId } = request.body as any;

      if (!targetUserId) {
        return reply.status(400).send({ success: false, error: "Missing targetUserId" });
      }

      try {
        const chat = await chatService.getOrCreateDirectChat(user.id, targetUserId);
        return reply.send({ success: true, data: chat });
      } catch (error) {
        return reply.status(400).send({ success: false, error: (error as Error).message });
      }
    },
  );

  fastify.post(
    "/:chatId/messages",
    { preHandler: authenticate as any },
    async (request, reply) => {
      const user = (request as any).user;
      const { chatId } = request.params as any;
      const { content } = request.body as any;

      try {
        const message = await chatService.sendMessage(Number(chatId), user.id, content);
        return reply.send({ success: true, data: message });
      } catch (error) {
        return reply.status(400).send({ success: false, error: (error as Error).message });
      }
    },
  );

  fastify.get(
    "/:chatId/messages",
    { preHandler: authenticate as any },
    async (request, reply) => {
      const user = (request as any).user;
      const { chatId } = request.params as any;

      try {
        const messages = await chatService.getMessages(Number(chatId), user.id);
        return reply.send({ success: true, data: messages });
      } catch (error) {
        return reply.status(400).send({ success: false, error: (error as Error).message });
      }
    },
  );

  fastify.patch(
    "/:chatId/messages/:messageId/read",
    { preHandler: authenticate as any },
    async (request, reply) => {
      const user = (request as any).user;
      const { messageId } = request.params as any;

      try {
        const message = await chatService.markMessageAsRead(Number(messageId), user.id);
        return reply.send({ success: true, data: message });
      } catch (error) {
        return reply.status(400).send({ success: false, error: (error as Error).message });
      }
    },
  );
};

export default plugin;
