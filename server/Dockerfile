FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Build application
FROM base AS builder
WORKDIR /app
COPY package.json yarn.lock* ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production dependencies only
FROM base AS prod-dependencies
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy package.json to ensure Node treats output as ES modules ("type": "module")
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./
COPY --from=prod-dependencies /app/node_modules ./node_modules

# Use the non-root user to run our application
USER expressjs

# Expose the port the app runs on
EXPOSE 7050

# Set default runtime environment variables
ENV NODE_ENV=production
ENV PORT=7050
ENV PACKAGE_NAME=service-name

# Start the application
CMD ["node", "server.js"]