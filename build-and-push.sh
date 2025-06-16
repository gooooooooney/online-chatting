#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
DOCKER_USERNAME="${DOCKER_USERNAME:-GooneyIsCoding}"
IMAGE_NAME_PREFIX="${IMAGE_NAME_PREFIX:-oral-app}"
VERSION="${VERSION:-latest}"

# 镜像名称
WEB_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME_PREFIX}-web"
API_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME_PREFIX}-api"

echo -e "${BLUE}🚀 开始构建 Oral App Docker 镜像...${NC}"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker 未运行，请先启动 Docker${NC}"
    exit 1
fi

# 登录 Docker Hub
echo -e "${YELLOW}🔐 登录 Docker Hub...${NC}"
if [ -z "$DOCKER_PASSWORD" ]; then
    docker login
else
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
fi

# 构建 Web 镜像
echo -e "${BLUE}📦 构建 Web 应用镜像...${NC}"
docker build -f apps/web/Dockerfile -t ${WEB_IMAGE}:${VERSION} -t ${WEB_IMAGE}:latest .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Web 镜像构建失败${NC}"
    exit 1
fi

# 构建 API 镜像
echo -e "${BLUE}📦 构建 API 应用镜像...${NC}"
docker build -f apps/server/Dockerfile -t ${API_IMAGE}:${VERSION} -t ${API_IMAGE}:latest .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ API 镜像构建失败${NC}"
    exit 1
fi

# 推送镜像
echo -e "${YELLOW}📤 推送镜像到 Docker Hub...${NC}"

echo -e "${BLUE}推送 Web 镜像...${NC}"
docker push ${WEB_IMAGE}:${VERSION}
docker push ${WEB_IMAGE}:latest

echo -e "${BLUE}推送 API 镜像...${NC}"
docker push ${API_IMAGE}:${VERSION}
docker push ${API_IMAGE}:latest

# 清理本地镜像 (可选)
echo -e "${YELLOW}🧹 是否清理本地镜像? [y/N]${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker rmi ${WEB_IMAGE}:${VERSION} ${WEB_IMAGE}:latest
    docker rmi ${API_IMAGE}:${VERSION} ${API_IMAGE}:latest
    echo -e "${GREEN}✅ 本地镜像已清理${NC}"
fi

echo -e "${GREEN}🎉 所有镜像构建和推送完成！${NC}"
echo -e "${BLUE}📋 镜像信息:${NC}"
echo -e "  Web: ${WEB_IMAGE}:${VERSION}"
echo -e "  API: ${API_IMAGE}:${VERSION}"
echo ""
echo -e "${YELLOW}💡 使用以下命令在 Coolify 中部署:${NC}"
echo -e "  docker-compose -f docker-compose.prod.yml up -d" 