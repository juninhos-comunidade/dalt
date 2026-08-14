import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { createChatService } from "../src/services/chat.service";

const prisma = new PrismaClient();
const chatService = createChatService(prisma);

describe("Chat Service", () => {
  let user1Id: number;
  let user2Id: number;
  let user3Id: number;

  beforeAll(async () => {
    // create 3 users for testing
    const u1 = await prisma.user.create({ data: { email: `test-chat1-${Date.now()}@test.com`, passwordHash: "hash", roleId: 1, name: "User1" } });
    const u2 = await prisma.user.create({ data: { email: `test-chat2-${Date.now()}@test.com`, passwordHash: "hash", roleId: 1, name: "User2" } });
    const u3 = await prisma.user.create({ data: { email: `test-chat3-${Date.now()}@test.com`, passwordHash: "hash", roleId: 1, name: "User3" } });
    user1Id = u1.id;
    user2Id = u2.id;
    user3Id = u3.id;
  });

  afterAll(async () => {
    // cleanup
    await prisma.message.deleteMany({ where: { senderId: { in: [user1Id, user2Id, user3Id] } } });
    await prisma.chatParticipant.deleteMany({ where: { userId: { in: [user1Id, user2Id, user3Id] } } });
    // chats cannot be safely deleted by participants unless we get their IDs. We'll leave them or delete if necessary.
    await prisma.user.deleteMany({ where: { id: { in: [user1Id, user2Id, user3Id] } } });
    await prisma.$disconnect();
  });

  let chatId: number;

  it("should create a chat room with valid participants", async () => {
    const chat = await chatService.getOrCreateDirectChat(user1Id, user2Id);
    expect(chat).toBeDefined();
    expect(chat.type).toBe("DIRECT");
    expect(chat.participants.length).toBe(2);
    chatId = chat.id;
  });

  it("should return the same chat room if called again", async () => {
    const chat = await chatService.getOrCreateDirectChat(user2Id, user1Id);
    expect(chat.id).toBe(chatId);
  });

  it("user not in participants should not see the room messages", async () => {
    await expect(chatService.getMessages(chatId, user3Id)).rejects.toThrow("NOT_A_PARTICIPANT");
  });

  let messageId: number;

  it("should save message with sentAt and initial isRead as false", async () => {
    const msg = await chatService.sendMessage(chatId, user1Id, "Hello User 2");
    expect(msg).toBeDefined();
    expect(msg.content).toBe("Hello User 2");
    expect(msg.isRead).toBe(false);
    expect(msg.sentAt).toBeDefined();
    messageId = msg.id;
  });

  it("should reject invalid messages (empty string)", async () => {
    await expect(chatService.sendMessage(chatId, user1Id, "   ")).rejects.toThrow("INVALID_MESSAGE");
  });

  it("messages should appear in chronological order", async () => {
    await new Promise(r => setTimeout(r, 100)); // wait a bit
    await chatService.sendMessage(chatId, user2Id, "Hi User 1");
    
    const messages = await chatService.getMessages(chatId, user1Id);
    expect(messages.length).toBe(2);
    expect(messages[0].content).toBe("Hello User 2");
    expect(messages[1].content).toBe("Hi User 1");
    expect(messages[0].sentAt.getTime()).toBeLessThanOrEqual(messages[1].sentAt.getTime());
  });

  it("marking as read should update isRead", async () => {
    // user2 reads user1's message
    const updated = await chatService.markMessageAsRead(messageId, user2Id);
    expect(updated.isRead).toBe(true);
  });

  it("cannot mark own message as read", async () => {
    await expect(chatService.markMessageAsRead(messageId, user1Id)).rejects.toThrow("CANNOT_MARK_OWN_MESSAGE");
  });
});
