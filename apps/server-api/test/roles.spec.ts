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
  await prisma.user
    .deleteMany({ where: { email: { contains: "test+role@" } } })
    .catch(() => {});
  await prisma.$disconnect();
  if (app.close) await app.close();
});

test("roles: aprendiz cannot create, mentor can create, mentor cannot approve, master can approve", async () => {
  const base = Date.now();

  // ensure roles exist
  await prisma.role.upsert({
    where: { name: "MASTER" },
    update: {},
    create: { name: "MASTER" },
  });
  await prisma.role.upsert({
    where: { name: "MENTOR" },
    update: {},
    create: { name: "MENTOR" },
  });
  await prisma.role.upsert({
    where: { name: "APRENDIZ" },
    update: {},
    create: { name: "APRENDIZ" },
  });

  // create aprendiz via register
  const emailApr = `test+role+apr+${base}@example.com`;
  await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: { email: emailApr, password: "password123", role: "APRENDIZ" },
  });
  const loginApr = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email: emailApr, password: "password123" },
  });
  const aprJson = JSON.parse(loginApr.payload);
  const aprToken = aprJson.data.accessToken;

  // create mentor via register
  const emailMent = `test+role+ment+${base}@example.com`;
  await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: { email: emailMent, password: "password123", role: "MENTOR" },
  });
  const loginMent = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email: emailMent, password: "password123" },
  });
  const mentJson = JSON.parse(loginMent.payload);
  const mentToken = mentJson.data.accessToken;

  // create master directly in db (register blocks MASTER)
  const masterRole = await prisma.role.findUnique({
    where: { name: "MASTER" },
  });
  const emailMaster = `test+role+master+${base}@example.com`;
  const passHash = await argon2.hash("password123");
  await prisma.user.create({
    data: {
      email: emailMaster,
      name: emailMaster,
      passwordHash: passHash,
      roleId: masterRole!.id,
    },
  });
  const loginMaster = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email: emailMaster, password: "password123" },
  });
  const masterJson = JSON.parse(loginMaster.payload);
  const masterToken = masterJson.data.accessToken;

  // aprendiz tries to create -> forbidden (403)
  const aprCreate = await app.inject({
    method: "POST",
    url: "/content/create",
    headers: { authorization: `Bearer ${aprToken}` },
  });
  expect(aprCreate.statusCode).toBe(403);

  // mentor can create -> 201
  const mentCreate = await app.inject({
    method: "POST",
    url: "/content/create",
    headers: { authorization: `Bearer ${mentToken}` },
  });
  expect(mentCreate.statusCode).toBe(201);

  // mentor cannot approve -> 403
  const mentApprove = await app.inject({
    method: "POST",
    url: "/content/approve",
    headers: { authorization: `Bearer ${mentToken}` },
  });
  expect(mentApprove.statusCode).toBe(403);

  // master can approve -> 200
  const masterApprove = await app.inject({
    method: "POST",
    url: "/content/approve",
    headers: { authorization: `Bearer ${masterToken}` },
  });
  expect(masterApprove.statusCode).toBe(200);
});
