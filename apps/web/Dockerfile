FROM node:20-alpine
RUN npm i -g pnpm
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web ./apps/web
COPY packages ./packages
RUN pnpm install
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm --filter @dalt/web run build
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# In a pnpm monorepo, standalone output contains the full workspace structure
CMD ["node", "apps/web/.next/standalone/apps/web/server.js"]
