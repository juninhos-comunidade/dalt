import { PrismaClient, Chat, Message, ChatParticipant, ChatType } from "@prisma/client";

export class ChatRepository {
  constructor(private prisma: PrismaClient) {}

  async findDirectChatByParticipants(userId1: number, userId2: number): Promise<Chat | null> {
    const chats = await this.prisma.chat.findMany({
      where: {
        type: "DIRECT",
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } }
        ]
      },
      include: { participants: true }
    });

    const exactMatch = chats.find(chat => chat.participants.length === 2);
    return exactMatch || null;
  }

  async createDirectChat(userId1: number, userId2: number): Promise<Chat> {
    return this.prisma.chat.create({
      data: {
        type: "DIRECT",
        participants: {
          create: [
            { userId: userId1 },
            { userId: userId2 }
          ]
        }
      },
      include: { participants: true }
    });
  }

  async getChatById(chatId: number) {
    return this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true }
    });
  }

  async createMessage(chatId: number, senderId: number, content: string): Promise<Message> {
    return this.prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
        type: "TEXT"
      }
    });
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { sentAt: "asc" }
    });
  }

  async markAsRead(messageId: number): Promise<Message> {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true }
    });
  }

  async getMessageById(messageId: number): Promise<Message | null> {
    return this.prisma.message.findUnique({ where: { id: messageId } });
  }
}
