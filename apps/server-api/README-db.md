Environment (.env)

- Copy `.env.example` to `.env` and edit values for your environment. Do NOT commit
  `.env` to source control — it may contain secrets.

```bash
cp .env.example .env
# edit .env as needed
```

CI: running migrations in CI

Below is an example GitHub Actions job that shows how to run Prisma migrations (or
`db push`) in CI against a temporary Postgres service. Adapt to your pipeline as
needed.

```yaml
name: Prisma Migrations

on:
	workflow_dispatch:

jobs:
	migrate:
		runs-on: ubuntu-latest
		services:
			db:
				image: postgres:15
				env:
					POSTGRES_USER: dalt
					POSTGRES_PASSWORD: daltpass
					POSTGRES_DB: dalt_db
				ports:
					- 5432:5432
				options: >-
					--health-cmd "pg_isready -U dalt" --health-interval 10s --health-timeout 5s --health-retries 5

		steps:
			- uses: actions/checkout@v4
			- name: Setup Node
				uses: actions/setup-node@v4
				with:
					node-version: 18
			- name: Setup pnpm
				uses: pnpm/action-setup@v2
				with:
					version: 8
			- name: Install deps
				run: |
					cd apps/server-api
					pnpm install
			- name: Run Prisma DB push
				env:
					DATABASE_URL: postgresql://dalt:daltpass@localhost:5432/dalt_db?schema=public
				run: |
					cd apps/server-api
					pnpm prisma:dbpush
```

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
