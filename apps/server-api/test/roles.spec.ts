import { beforeAll, afterAll, test, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import { buildServer } from "../src/server";
import argon2 from "argon2";

let prisma: PrismaClient;
let app: any;

beforeAll(async () => {
  prisma = new PrismaClient();
  app = buildServer({ logger: false }) as any;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: "role-test+" } } }).catch(() => {});
  await prisma.$disconnect();
  if (app.close) await app.close();
});

test("APRENDIZ cannot create content", async () => {
  const role = await prisma.role.findUnique({ where: { name: "APRENDIZ" } });
  const hash = await argon2.hash("password123");
  const user = await prisma.user.create({ data: { name: "aprendiz", email: `role-test+aprendiz+${Date.now()}@example.com`, passwordHash: hash, roleId: role!.id } });

  const tokenResp = await app.inject({ method: "POST", url: "/auth/login", payload: { email: user.email, password: "password123" } });
  expect(tokenResp.statusCode).toBe(200);
  const payload = JSON.parse(tokenResp.payload);
  const access = payload.data.accessToken;

  const createResp = await app.inject({ method: "POST", url: "/role/create", headers: { authorization: `Bearer ${access}` }, payload: { title: "test" } });
  expect(createResp.statusCode).toBe(403);
});

test("MENTOR can create but not approve", async () => {
  const role = await prisma.role.findUnique({ where: { name: "MENTOR" } });
  const hash = await argon2.hash("password123");
  const user = await prisma.user.create({ data: { name: "mentor", email: `role-test+mentor+${Date.now()}@example.com`, passwordHash: hash, roleId: role!.id } });

  const tokenResp = await app.inject({ method: "POST", url: "/auth/login", payload: { email: user.email, password: "password123" } });
  expect(tokenResp.statusCode).toBe(200);
  const payload = JSON.parse(tokenResp.payload);
  const access = payload.data.accessToken;

  const createResp = await app.inject({ method: "POST", url: "/role/create", headers: { authorization: `Bearer ${access}` }, payload: { title: "test" } });
  expect(createResp.statusCode).toBe(200);

  const approveResp = await app.inject({ method: "POST", url: "/role/approve", headers: { authorization: `Bearer ${access}` }, payload: { contentId: 1 } });
  expect(approveResp.statusCode).toBe(403);
});

test("MASTER can approve and create", async () => {
  const role = await prisma.role.findUnique({ where: { name: "MASTER" } });
  const hash = await argon2.hash("password123");
  // create MASTER user directly (register blocks MASTER)
  const user = await prisma.user.create({ data: { name: "master", email: `role-test+master+${Date.now()}@example.com`, passwordHash: hash, roleId: role!.id } });

  const tokenResp = await app.inject({ method: "POST", url: "/auth/login", payload: { email: user.email, password: "password123" } });
  expect(tokenResp.statusCode).toBe(200);
  const payload = JSON.parse(tokenResp.payload);
  const access = payload.data.accessToken;

  const createResp = await app.inject({ method: "POST", url: "/role/create", headers: { authorization: `Bearer ${access}` }, payload: { title: "test" } });
  expect(createResp.statusCode).toBe(200);

  const approveResp = await app.inject({ method: "POST", url: "/role/approve", headers: { authorization: `Bearer ${access}` }, payload: { contentId: 1 } });
  expect(approveResp.statusCode).toBe(200);
});
