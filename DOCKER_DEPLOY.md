# 🐳 Oral App Docker 部署指南

本指南帮助你将Oral App构建成Docker镜像并部署到Coolify。

## 📋 文件说明

- `build-and-push.sh` - 构建并推送镜像到Docker Hub
- `docker-compose.prod.yml` - 生产环境部署配置
- `deploy.sh` - 一键部署脚本
- `.env.prod` - 生产环境变量 (需要手动创建)

## 🚀 快速开始

### 1. 构建并推送镜像

```bash
# 设置你的Docker Hub用户名
export DOCKER_USERNAME="GooneyIsCoding"

# 设置版本号 (可选，默认为latest)
export VERSION="v1.0.0"

# 给脚本执行权限
chmod +x build-and-push.sh deploy.sh

# 构建并推送镜像
./build-and-push.sh
```

### 2. 一键部署

```bash
# 运行部署脚本
./deploy.sh

# 选择操作:
# 1. 构建并推送镜像
# 2. 仅部署 (使用现有镜像)
# 3. 构建、推送并部署 ⭐ 推荐
# 4. 停止服务
# 5. 查看日志
```

## 🔧 手动部署步骤

### 1. 创建环境变量文件

创建 `.env.prod` 文件：

```bash
# Docker Hub配置
DOCKER_USERNAME=GooneyIsCoding
VERSION=latest

# 域名配置
DOMAIN=your-app.your-domain.com

# 数据库配置
DATABASE_URL=mongodb+srv://gooney:gooney@cluster0.gv7qjo2.mongodb.net/oral-chatting

# Better Auth配置
BETTER_AUTH_SECRET=KDL1uuiius92l4mTpEaHWeu7SK9niAQU
BETTER_AUTH_URL=https://your-app.your-domain.com

# API配置
NEXT_PUBLIC_API_URL=https://api.your-app.your-domain.com
CORS_ORIGIN=https://your-app.your-domain.com

# Pusher配置
PUSHER_APP_ID=2006392
PUSHER_KEY=d8d777d2117d369bee7e
PUSHER_SECRET=f2facc7374a2e305537e
PUSHER_CLUSTER=ap3
PUSHER_FORCE_TLS=true
PUSHER_HOST=pusher.gooney.app

# Ably配置
ABLY_API_KEY=k9OsKg.Gt-Aww:BR6l48yD8aDkDYHBhOmLnE2RFI9Xo7xNaohT8A--Ca0
ABLY_ENVIRONMENT=production
```

### 2. 构建镜像

```bash
# Web应用镜像
docker build -f apps/web/Dockerfile -t GooneyIsCoding/oral-app-web:latest .

# API应用镜像
docker build -f apps/server/Dockerfile -t GooneyIsCoding/oral-app-api:latest .
```

### 3. 推送镜像

```bash
# 登录Docker Hub
docker login

# 推送镜像
docker push GooneyIsCoding/oral-app-web:latest
docker push GooneyIsCoding/oral-app-api:latest
```

### 4. 部署应用

```bash
# 使用预构建镜像部署
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## 🏗️ 在Coolify中部署

### 方法1: 使用Docker Compose (推荐)

1. **上传配置文件到Coolify服务器**：
   ```bash
   # 只需要上传这些文件到Coolify
   scp docker-compose.prod.yml user@coolify-server:/path/to/deploy/
   scp .env.prod user@coolify-server:/path/to/deploy/
   ```

2. **在Coolify中创建项目**：
   - 项目类型：Docker Compose
   - 上传 `docker-compose.prod.yml`
   - 配置环境变量或上传 `.env.prod`

3. **部署**：
   - 点击Deploy按钮
   - 镜像会自动从Docker Hub拉取

### 方法2: 使用单个服务

在Coolify中分别创建两个服务：

**Web服务**：
- 镜像：`GooneyIsCoding/oral-app-web:latest`
- 端口：3000
- 域名：`your-app.your-domain.com`

**API服务**：
- 镜像：`GooneyIsCoding/oral-app-api:latest`
- 端口：3001
- 域名：`api.your-app.your-domain.com`

## 📊 监控和管理

### 查看日志
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### 更新应用
```bash
# 1. 构建新版本
export VERSION="v1.1.0"
./build-and-push.sh

# 2. 更新部署
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### 停止服务
```bash
docker-compose -f docker-compose.prod.yml down
```

## 🔍 故障排除

### 镜像构建失败
- 检查Dockerfile语法
- 确保所有依赖文件存在
- 检查Docker磁盘空间

### 部署失败
- 检查环境变量配置
- 确认镜像已成功推送到Docker Hub
- 检查网络连接

### 服务无法访问
- 检查端口映射
- 确认防火墙配置
- 检查域名DNS设置

## 🌟 优势

- **快速部署**：预构建镜像，无需在服务器上编译
- **版本控制**：支持镜像版本管理
- **资源优化**：镜像大小优化，启动速度快
- **安全性**：运行时使用非root用户
- **健康检查**：自动监控服务状态
- **扩展性**：支持水平扩展

## 📝 注意事项

1. **敏感信息**：确保 `.env.prod` 文件不要提交到Git
2. **域名配置**：记得修改所有域名相关的环境变量
3. **数据库连接**：确保数据库允许外部连接
4. **镜像大小**：定期清理不用的镜像节省空间
5. **安全更新**：定期更新基础镜像和依赖 