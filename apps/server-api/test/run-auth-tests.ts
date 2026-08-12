import { buildServer } from "../src/server";
import { PrismaClient } from "@prisma/client";

(async () => {
  const prisma = new PrismaClient();
  const app = buildServer({ logger: false }) as any;

  try {
    const testEmail = `test+auth+${Date.now()}@example.com`;
    await prisma.user.deleteMany({ where: { email: { contains: "test+auth@" } } }).catch(() => {});

    const registerRes = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { email: testEmail, password: "password123" },
    });
    console.log("register status", registerRes.statusCode, registerRes.payload);
    if (registerRes.statusCode !== 201) throw new Error("register failed");

    const dup = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { email: testEmail, password: "password123" },
    });
    console.log("dup register status", dup.statusCode);
    if (dup.statusCode !== 409) throw new Error("duplicate check failed");

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: testEmail, password: "password123" },
    });
    console.log("login status", login.statusCode, login.payload);
    if (login.statusCode !== 200) throw new Error("login failed");

    // parse token
    const loginJson = JSON.parse(login.payload);
    const accessToken = loginJson.data?.accessToken;
    const refreshToken = loginJson.data?.refreshToken;
    if (!accessToken || !refreshToken) throw new Error("no tokens returned");

    // protected route without token -> should be unauthorized
    const noTokenResp = await app.inject({ method: "GET", url: "/protected" });
    console.log("no token status", noTokenResp.statusCode);
    if (noTokenResp.statusCode !== 401)
      throw new Error("protected allowed without token");

    // protected route with token -> should succeed
    const withToken = await app.inject({
      method: "GET",
      url: "/protected",
      headers: { authorization: `Bearer ${accessToken}` },
    });
    console.log(
      "protected with token status",
      withToken.statusCode,
      withToken.payload,
    );
    if (withToken.statusCode !== 200)
      throw new Error("protected route failed with token");

    // try refresh
    const refreshResp = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: { refreshToken },
    });
    console.log("refresh status", refreshResp.statusCode, refreshResp.payload);
    if (refreshResp.statusCode !== 200) throw new Error("refresh failed");

    const refreshJson = JSON.parse(refreshResp.payload);
    const newAccess = refreshJson.data?.accessToken;
    const newRefresh = refreshJson.data?.refreshToken;
    if (!newAccess || !newRefresh)
      throw new Error("refresh did not return tokens");

    // use refreshed access token
    const protected2 = await app.inject({
      method: "GET",
      url: "/protected",
      headers: { authorization: `Bearer ${newAccess}` },
    });
    if (protected2.statusCode !== 200)
      throw new Error("protected failed with refreshed token");

    console.log("AUTH tests passed");
  } catch (err) {
    console.error("AUTH tests failed", err);
    process.exitCode = 1;
  } finally {
    await prisma.user
      .deleteMany({ where: { email: { contains: "test+auth@example.com" } } })
      .catch(() => {});
    await prisma.$disconnect();
    if (app.close) await app.close();
  }
})();
