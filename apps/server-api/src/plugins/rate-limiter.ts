import { FastifyReply, FastifyRequest } from "fastify";

type Options = {
  windowMs?: number;
  max?: number;
  keyFn?: (request: FastifyRequest) => string;
};

const stores = new Map<string, { count: number; first: number }>();

export function rateLimiter(opts: Options = {}) {
  const windowMs = opts.windowMs ?? 60_000; // 1 minute
  const max = opts.max ?? 5;
  const keyFn =
    opts.keyFn ??
    ((req: FastifyRequest) =>
      req.ip || (req.headers["x-forwarded-for"] as string) || "unknown");

  return async function (request: FastifyRequest, reply: FastifyReply) {
    const key = keyFn(request);
    const now = Date.now();
    const existing = stores.get(key);
    if (!existing) {
      stores.set(key, { count: 1, first: now });
      return;
    }
    if (now - existing.first > windowMs) {
      stores.set(key, { count: 1, first: now });
      return;
    }
    existing.count += 1;
    stores.set(key, existing);
    if (existing.count > max) {
      reply.status(429).send({ error: "too many requests" });
      return;
    }
  };
}

export function resetRateLimit() {
  stores.clear();
}

export default rateLimiter;
