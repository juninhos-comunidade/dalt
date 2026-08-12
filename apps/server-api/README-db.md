# Database & Prisma

This document explains how to run the Postgres DB for local development and apply Prisma migrations and seeds.

1) Start Postgres (uses `docker-compose.db.yml` in repo root):

```bash
docker-compose -f ../../docker-compose.db.yml up -d
```

2) Install deps and generate Prisma client (run inside `apps/server-api`):

```bash
pnpm install
pnpm prisma:generate
```

3) Apply migrations (interactive dev flow) or push schema:

```bash
pnpm prisma:migrate   # creates a migration and applies it
pnpm prisma:dbpush    # push schema without generating migration
```

4) Run seed to create initial roles:

```bash
pnpm run prisma:seed
```

Notes:
- Ensure `DATABASE_URL` in `.env` points to the DB from `docker-compose.db.yml` (see `.env.example`).
- The project uses Prisma; keep `schema.prisma` in sync with the models in the sprint plan.
