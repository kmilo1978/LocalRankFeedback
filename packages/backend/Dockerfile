FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files for workspaces
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci --workspace=packages/backend --workspace=packages/shared

# Copy source code
COPY packages/backend/ ./packages/backend/
COPY packages/shared/ ./packages/shared/
COPY tsconfig.base.json ./

# Generate Prisma client
RUN cd packages/backend && npx prisma generate

# Build
RUN cd packages/backend && npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/packages/backend/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main.js"]
