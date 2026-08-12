import { beforeAll, afterAll, test, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import { buildServer } from "../src/server";

let prisma: PrismaClient;
let app: any;

beforeAll(async () => {
  prisma = new PrismaClient();
  app = buildServer({ logger: false }) as any;
});

afterAll(async () => {
  await prisma.user
    .deleteMany({ where: { email: { contains: "test+auth@" } } })
    .catch(() => {});
  await prisma.$disconnect();
  if (app.close) await app.close();
});

test("auth register/login/refresh flow", async () => {
  const testEmail = `test+auth+${Date.now()}@example.com`;

  const registerRes = await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: { email: testEmail, password: "password123" },
  });
  expect(registerRes.statusCode).toBe(201);

  const dup = await app.inject({
    method: "POST",
    url: "/auth/register",
    payload: { email: testEmail, password: "password123" },
  });
  expect(dup.statusCode).toBe(409);

  const login = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email: testEmail, password: "password123" },
  });
  expect(login.statusCode).toBe(200);

  const loginJson = JSON.parse(login.payload);
  const accessToken = loginJson.data?.accessToken;
  const refreshToken = loginJson.data?.refreshToken;
  expect(accessToken).toBeTruthy();
  expect(refreshToken).toBeTruthy();

  const noTokenResp = await app.inject({ method: "GET", url: "/protected" });
  expect(noTokenResp.statusCode).toBe(401);

  const withToken = await app.inject({
    method: "GET",
    url: "/protected",
    headers: { authorization: `Bearer ${accessToken}` },
  });
  expect(withToken.statusCode).toBe(200);

  const refreshResp = await app.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: { refreshToken },
  });
  expect(refreshResp.statusCode).toBe(200);

  const refreshJson = JSON.parse(refreshResp.payload);
  const newAccess = refreshJson.data?.accessToken;
  const newRefresh = refreshJson.data?.refreshToken;
  expect(newAccess).toBeTruthy();
  expect(newRefresh).toBeTruthy();

  const protected2 = await app.inject({
    method: "GET",
    url: "/protected",
    headers: { authorization: `Bearer ${newAccess}` },
  });
  expect(protected2.statusCode).toBe(200);
});
