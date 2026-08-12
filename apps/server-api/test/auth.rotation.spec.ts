import { beforeAll, afterAll, test, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import { buildServer } from "../src/server";

let prisma: PrismaClient;
let app: any;

beforeAll(async () => {
  prisma = new PrismaClient();
  app = buildServer({ logger: false }) as any;
  // ensure roles exist
  await prisma.role.upsert({ where: { name: "MASTER" }, update: {}, create: { name: "MASTER" } });
  await prisma.role.upsert({ where: { name: "MENTOR" }, update: {}, create: { name: "MENTOR" } });
  await prisma.role.upsert({ where: { name: "APRENDIZ" }, update: {}, create: { name: "APRENDIZ" } });
});

afterAll(async () => {
  await prisma.user
    .deleteMany({ where: { email: { contains: "test+auth@" } } })
    .catch(() => {});
  await prisma.$disconnect();
  if (app.close) await app.close();
});

test("refresh rotation: old refresh token rejected after use", async () => {
  const testEmail = `test+auth+${Date.now()}@example.com`;

  const registerRes = await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: { email: testEmail, password: "password123" },
  });
  expect(registerRes.statusCode).toBe(201);

  const login = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email: testEmail, password: "password123" },
  });
  expect(login.statusCode).toBe(200);
  const loginJson = JSON.parse(login.payload);
  const refreshToken = loginJson.data?.refreshToken;
  expect(refreshToken).toBeTruthy();

  // Use refresh once -> should succeed
  const refreshResp = await app.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: { refreshToken },
  });
  expect(refreshResp.statusCode).toBe(200);
  const refreshJson = JSON.parse(refreshResp.payload);
  const newRefresh = refreshJson.data?.refreshToken;
  expect(newRefresh).toBeTruthy();

  // Reusing old refresh token should fail (rotation)
  const reuseResp = await app.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: { refreshToken },
  });
  expect(reuseResp.statusCode).toBe(401);
});

test("logout revokes refresh token and subsequent refresh fails", async () => {
  const testEmail = `test+auth+${Date.now()}@example.com`;

  const registerRes = await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: { email: testEmail, password: "password123" },
  });
  expect(registerRes.statusCode).toBe(201);

  const login = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email: testEmail, password: "password123" },
  });
  expect(login.statusCode).toBe(200);
  const loginJson = JSON.parse(login.payload);
  const refreshToken = loginJson.data?.refreshToken;
  expect(refreshToken).toBeTruthy();

  // Logout (revoke)
  const logoutResp = await app.inject({
    method: "POST",
    url: "/auth/logout",
    payload: { refreshToken },
  });
  // Some implementations return 200 on successful revoke
  expect([200, 204]).toContain(logoutResp.statusCode);

  // Attempt refresh after revoke should fail
  const afterLogout = await app.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: { refreshToken },
  });
  expect(afterLogout.statusCode).toBe(401);
});

// TODO: implement rate-limiting in server; keep test placeholder
test.skip("rate-limit protection on auth endpoints (TODO)", async () => {
  // This test is a placeholder until rate-limiting is implemented on the server.
});
