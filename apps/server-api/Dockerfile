FROM node:20-alpine
RUN npm i -g pnpm
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/server-api ./apps/server-api
COPY packages ./packages
RUN pnpm install
RUN pnpm --filter @dalt/api run build
EXPOSE 3001
ENV PORT=3001
CMD ["pnpm", "--filter", "@dalt/api", "start"]
