FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM deps AS builder
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
## Ensure Next.js runtime can write to the image cache directories.
# Create the cache dir and set ownership to the non-root `nextjs` user
# before switching to that user so `next start` won't fail with EACCES.
RUN mkdir -p /app/.next/cache/images \
	&& chown -R nextjs:nodejs /app/.next /app/node_modules /app/public || true
USER nextjs
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]