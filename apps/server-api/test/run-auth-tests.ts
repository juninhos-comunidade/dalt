import assert from "assert";
import { buildServer } from "../src/server";
import { PrismaClient } from "@prisma/client";

(async () => {
  const prisma = new PrismaClient();
  const app = buildServer({ logger: false }) as any;

  try {
    const testEmail = `test+auth+${Date.now()}@example.com`;
    await prisma.user
      .deleteMany({ where: { email: { contains: "test+auth@" } } })
      .catch(() => {});

    const registerRes = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { email: testEmail, password: "password123" },
    });
    assert.strictEqual(registerRes.statusCode, 201, "register failed");

    const dup = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { email: testEmail, password: "password123" },
    });
    assert.strictEqual(dup.statusCode, 409, "duplicate check failed");

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: testEmail, password: "password123" },
    });
    assert.strictEqual(login.statusCode, 200, "login failed");

    // parse token
    const loginJson = JSON.parse(login.payload);
    const accessToken = loginJson.data?.accessToken;
    const refreshToken = loginJson.data?.refreshToken;
    assert.ok(accessToken && refreshToken, "no tokens returned");

    // protected route without token -> should be unauthorized
    const noTokenResp = await app.inject({ method: "GET", url: "/protected" });
    assert.strictEqual(
      noTokenResp.statusCode,
      401,
      "protected allowed without token",
    );

    // protected route with token -> should succeed
    const withToken = await app.inject({
      method: "GET",
      url: "/protected",
      headers: { authorization: `Bearer ${accessToken}` },
    });
    assert.strictEqual(
      withToken.statusCode,
      200,
      "protected route failed with token",
    );

    // try refresh
    const refreshResp = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: { refreshToken },
    });
    assert.strictEqual(refreshResp.statusCode, 200, "refresh failed");

    const refreshJson = JSON.parse(refreshResp.payload);
    const newAccess = refreshJson.data?.accessToken;
    const newRefresh = refreshJson.data?.refreshToken;
    assert.ok(newAccess && newRefresh, "refresh did not return tokens");

    // use refreshed access token
    const protected2 = await app.inject({
      method: "GET",
      url: "/protected",
      headers: { authorization: `Bearer ${newAccess}` },
    });
    assert.strictEqual(
      protected2.statusCode,
      200,
      "protected failed with refreshed token",
    );
  } catch (err) {
    process.exitCode = 1;
  } finally {
    await prisma.user
      .deleteMany({ where: { email: { contains: "test+auth@example.com" } } })
      .catch(() => {});
    await prisma.$disconnect();
    if (app.close) await app.close();
  }
})();
