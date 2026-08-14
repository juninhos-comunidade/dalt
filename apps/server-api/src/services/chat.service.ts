import { PrismaClient } from "@prisma/client";
import { ChatRepository } from "../repositories/chat.repository";

export function createChatService(prisma: PrismaClient) {
  const repo = new ChatRepository(prisma);

  return {
    async getOrCreateDirectChat(currentUserId: number, targetUserId: number) {
      if (currentUserId === targetUserId) {
        throw new Error("CANNOT_CHAT_WITH_SELF");
      }

      // Check if target user exists
      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser) throw new Error("USER_NOT_FOUND");

      let chat = await repo.findDirectChatByParticipants(currentUserId, targetUserId);
      if (!chat) {
        chat = await repo.createDirectChat(currentUserId, targetUserId);
      }

      return chat;
    },

    async sendMessage(chatId: number, senderId: number, content: string) {
      if (!content || content.trim().length === 0) {
        throw new Error("INVALID_MESSAGE");
      }

      const chat = await repo.getChatById(chatId);
      if (!chat) throw new Error("CHAT_NOT_FOUND");

      const isParticipant = chat.participants.some(p => p.userId === senderId);
      if (!isParticipant) throw new Error("NOT_A_PARTICIPANT");

      return repo.createMessage(chatId, senderId, content);
    },

    async getMessages(chatId: number, userId: number) {
      const chat = await repo.getChatById(chatId);
      if (!chat) throw new Error("CHAT_NOT_FOUND");

      const isParticipant = chat.participants.some(p => p.userId === userId);
      if (!isParticipant) throw new Error("NOT_A_PARTICIPANT");

      return repo.getMessages(chatId);
    },

    async markMessageAsRead(messageId: number, userId: number) {
      const message = await repo.getMessageById(messageId);
      if (!message) throw new Error("MESSAGE_NOT_FOUND");

      const chat = await repo.getChatById(message.chatId);
      if (!chat) throw new Error("CHAT_NOT_FOUND");

      const isParticipant = chat.participants.some(p => p.userId === userId);
      if (!isParticipant) throw new Error("NOT_A_PARTICIPANT");

      if (message.senderId === userId) {
        throw new Error("CANNOT_MARK_OWN_MESSAGE");
      }

      return repo.markAsRead(messageId);
    }
  };
}
