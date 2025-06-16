# 使用官方Bun运行时作为基础镜像
FROM oven/bun:1.2.14-alpine AS base

# 设置工作目录
WORKDIR /app

# 依赖安装阶段
FROM base AS deps

# 复制根目录的package.json和bun.lock
COPY package.json bun.lock ./
COPY turbo.json ./

# 复制server应用的package.json
COPY apps/server/package.json ./apps/server/

# 安装依赖
RUN bun install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules

# 复制源代码
COPY . .

# 生成Prisma客户端
RUN cd apps/server && bun run db:generate

# 构建应用
RUN cd apps/server && bun run build

# 生产阶段
FROM base AS runner
WORKDIR /app

# 创建非root用户
RUN addgroup --system --gid 1001 bunuser
RUN adduser --system --uid 1001 bunuser

# 复制构建后的文件和依赖
COPY --from=builder --chown=bunuser:bunuser /app/apps/server/dist ./dist
COPY --from=builder --chown=bunuser:bunuser /app/apps/server/package.json ./package.json
COPY --from=builder --chown=bunuser:bunuser /app/apps/server/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/node_modules ./node_modules

USER bunuser

# 暴露端口
EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

# 启动应用
CMD ["bun", "start"]
