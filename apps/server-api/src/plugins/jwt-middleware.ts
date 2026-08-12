import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function authenticate(request: any, reply: any) {
  const auth =
    (request.headers && request.headers.authorization) ||
    request.headers?.Authorization;
  if (!auth) return reply.status(401).send({ error: "missing token" });
  const parts = String(auth).split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return reply.status(401).send({ error: "invalid token" });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET) as any;
    request.user = payload;
  } catch (err) {
    return reply.status(401).send({ error: "invalid token" });
  }
}

export default authenticate;
