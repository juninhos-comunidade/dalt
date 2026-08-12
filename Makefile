DB_COMPOSE=docker-compose -f docker-compose.db.yml
NODE_IMAGE=node:18-bullseye

.PHONY: db-up prisma-setup prisma-seed

db-up:
	$(DB_COMPOSE) up -d

prisma-setup:
	@echo "Running Prisma setup inside a temporary container (will not modify host)"
	docker run --rm --network dalt_default -v "$(PWD)":/workspace -w /workspace $(NODE_IMAGE) /bin/sh -lc "npm i -g pnpm@8 --no-audit --no-fund --force && cd apps/server-api && export DATABASE_URL='postgresql://dalt:daltpass@db:5432/dalt_db?schema=public' && pnpm install && pnpm prisma:generate && pnpm prisma:dbpush && pnpm run prisma:seed"

prisma-seed:
	docker run --rm --network dalt_default -v "$(PWD)":/workspace -w /workspace $(NODE_IMAGE) /bin/sh -lc "npm i -g pnpm@8 --no-audit --no-fund --force >/dev/null 2>&1 && cd apps/server-api && export DATABASE_URL='postgresql://dalt:daltpass@db:5432/dalt_db?schema=public' && pnpm install >/dev/null 2>&1 && pnpm run prisma:seed"
