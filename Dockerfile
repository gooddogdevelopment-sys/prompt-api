# ---- Build Stage ----
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies needed to build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build the NestJS app
RUN pnpm run build

# ---- Production Stage ----
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 3000

CMD ["node", "dist/main"]
