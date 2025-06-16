#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
DOCKER_USERNAME="${DOCKER_USERNAME:-GooneyIsCoding}"
VERSION="${VERSION:-latest}"

echo -e "${BLUE}🚀 Oral App 快速部署脚本${NC}"
echo -e "${YELLOW}════════════════════════════════════${NC}"

# 检查环境变量文件
if [ ! -f .env.prod ]; then
    echo -e "${YELLOW}⚠️  未找到 .env.prod 文件，创建模板...${NC}"
    cat > .env.prod << EOL
# Docker Hub配置
DOCKER_USERNAME=GooneyIsCoding
VERSION=${VERSION}

# 域名配置 (请修改为你的域名)
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
EOL
    echo -e "${RED}❌ 请先编辑 .env.prod 文件，设置正确的域名和配置！${NC}"
    exit 1
fi

# 加载环境变量
source .env.prod

echo -e "${BLUE}📋 部署配置:${NC}"
echo -e "  Docker用户: ${DOCKER_USERNAME}"
echo -e "  镜像版本: ${VERSION}"
echo -e "  域名: ${DOMAIN}"
echo ""

# 选择操作
echo -e "${YELLOW}请选择操作:${NC}"
echo "1. 构建并推送镜像"
echo "2. 仅部署 (使用现有镜像)"
echo "3. 构建、推送并部署"
echo "4. 停止服务"
echo "5. 查看日志"
read -p "请输入选择 [1-5]: " choice

case $choice in
    1)
        echo -e "${BLUE}🏗️  构建并推送镜像...${NC}"
        ./build-and-push.sh
        ;;
    2)
        echo -e "${BLUE}🚀 部署服务...${NC}"
        docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
        ;;
    3)
        echo -e "${BLUE}🏗️  构建并推送镜像...${NC}"
        ./build-and-push.sh
        if [ $? -eq 0 ]; then
            echo -e "${BLUE}🚀 部署服务...${NC}"
            docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
        fi
        ;;
    4)
        echo -e "${BLUE}🛑 停止服务...${NC}"
        docker-compose -f docker-compose.prod.yml down
        ;;
    5)
        echo -e "${BLUE}📋 显示日志...${NC}"
        docker-compose -f docker-compose.prod.yml logs -f
        ;;
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

if [ $choice -eq 2 ] || [ $choice -eq 3 ]; then
    echo -e "${GREEN}✅ 部署完成！${NC}"
    echo -e "${BLUE}🌐 访问地址:${NC}"
    echo -e "  Web: https://${DOMAIN}"
    echo -e "  API: https://api.${DOMAIN}"
    echo -e "${YELLOW}💡 使用 'docker-compose -f docker-compose.prod.yml logs -f' 查看日志${NC}"
fi 