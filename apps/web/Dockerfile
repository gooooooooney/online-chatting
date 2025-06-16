# 使用官方Node.js运行时作为基础镜像
FROM node:20-alpine AS base

# 安装依赖所需的工具
RUN apk add --no-cache libc6-compat

# 设置工作目录
WORKDIR /app

# 安装Bun
RUN npm install -g bun

# 依赖安装阶段
FROM base AS deps
WORKDIR /app

# 复制根目录的package.json和bun.lock
COPY package.json bun.lock ./
COPY turbo.json ./

# 复制web应用的package.json
COPY apps/web/package.json ./apps/web/

# 安装依赖
RUN bun install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# 复制源代码
COPY . .

# 构建应用
RUN cd apps/web && bun run build

# 生产阶段
FROM base AS runner
WORKDIR /app

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/apps/web/next.config.ts ./
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/apps/web/public ./public

# 复制构建后的文件
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./node_modules

USER nextjs

# 暴露端口
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["bun", "start"]
