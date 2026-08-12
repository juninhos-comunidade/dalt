# Database & Prisma

This document explains how to run the Postgres DB for local development and apply Prisma migrations and seeds.

1. Start Postgres (uses `docker-compose.db.yml` in repo root):

```bash
docker-compose -f ../../docker-compose.db.yml up -d
```

2. Install deps and generate Prisma client (run inside `apps/server-api`):

```bash
pnpm install
pnpm prisma:generate
```

3. Apply migrations (interactive dev flow) or push schema:

```bash
pnpm prisma:migrate   # creates a migration and applies it
pnpm prisma:dbpush    # push schema without generating migration
```

4. Run seed to create initial roles:

```bash
pnpm run prisma:seed
```

Notes:

- Ensure `DATABASE_URL` in `.env` points to the DB from `docker-compose.db.yml` (see `.env.example`).
- The project uses Prisma; keep `schema.prisma` in sync with the models in the sprint plan.

Run inside Docker (recommended, avoids touching host pnpm/corepack)

```bash
# start Postgres (from repo root)
docker compose -f docker-compose.db.yml up -d

# run a temporary Node container on the same Docker network and execute the Prisma setup
docker run --rm -it \
	--network dalt_default \
	-v "$PWD":/workspace -w /workspace \
	node:18-bullseye /bin/sh -lc "npm i -g pnpm@8 --no-audit --no-fund --force && cd apps/server-api && export DATABASE_URL='postgresql://dalt:daltpass@db:5432/dalt_db?schema=public' && pnpm install && pnpm prisma:generate && pnpm prisma:dbpush && pnpm run prisma:seed"
```

Adjust `DATABASE_URL` if your `.env` uses other credentials or if you're using a different Docker network name.
