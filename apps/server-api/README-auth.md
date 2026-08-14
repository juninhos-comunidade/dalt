Auth endpoints and local test instructions

Endpoints:

- POST /auth/register
  - body: { email, password, role? }
  - responses: 201 created, 409 conflict if email exists

- POST /auth/login
  - body: { email, password }
  - responses: 200 with { token } or 401

Examples (curl)

- Register:

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"strongpass","role":"APRENDIZ"}'
```

- Login:

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"strongpass"}'
```

- Refresh:

```bash
curl -X POST http://localhost:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<REFRESH_TOKEN_HERE>"}'
```

Notes:

- The server runs on port `3001` in our local docker-compose setup for the API; change host/port as appropriate.
- Responses contain `data.accessToken` and `data.refreshToken` on successful login/refresh. Never log these tokens in CI logs.

Automated setup

You can run the convenience `setup` script to install dependencies, generate Prisma client, push the schema and run seeds:

```bash
# from repo root
cd apps/server-api
pnpm run setup
```

This will ensure the `MASTER`, `MENTOR` and `APRENDIZ` roles are present via `prisma/seed.js`.

Run integration tests (containerized)

```bash
# make sure Postgres container is up
docker compose -f ../../docker-compose.db.yml up -d

# run tests inside node container (will install pnpm inside container)
docker run --rm --network dalt_default -v "$PWD":/workspace -w /workspace node:18-bullseye /bin/sh -lc "npm i -g pnpm@8 --no-audit --no-fund --force >/dev/null 2>&1 && cd apps/server-api && export DATABASE_URL='postgresql://dalt:daltpass@db:5432/dalt_db?schema=public' && pnpm install && pnpm run test:auth"
```

Env vars:

- `DATABASE_URL` — Prisma DB URL
- `JWT_SECRET` — secret used to sign tokens (set in `.env`)
