# Appwrite 迁移指南

本项目已成功从 Prisma + MongoDB + Ably + Better-auth 迁移到 Appwrite 全栈解决方案。

## 🎯 迁移摘要

### 替换的技术栈
- ✅ **数据库**: Prisma + MongoDB → Appwrite Database
- ✅ **认证**: Better-auth → Appwrite Auth  
- ✅ **实时通信**: Ably → Appwrite Realtime
- ✅ **文件存储**: 新增 Appwrite Storage 支持

### 保持的功能
- ✅ 用户注册和登录（邮箱/密码 + GitHub OAuth）
- ✅ 实时聊天消息
- ✅ 会话管理（一对一和群聊）
- ✅ 消息已读状态
- ✅ 文件上传支持
- ✅ 跨平台支持（Web + Native）

## 🚀 快速开始

### 1. 设置 Appwrite 项目

1. 访问 [Appwrite Cloud](https://cloud.appwrite.io) 或安装自托管版本
2. 创建新项目
3. 在项目设置中获取以下信息：
   - Project ID
   - API Key
   - Endpoint URL

### 2. 配置环境变量

**服务器 (`apps/server/.dev.vars`)**
```bash
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
APPWRITE_DATABASE_ID=chat-database

# CORS Configuration  
CORS_ORIGIN=http://localhost:3001
```

**Web 应用 (`apps/web/.env.local`)**
```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=chat-database

# API Configuration
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

**Native 应用**
更新 `apps/native/lib/appwrite.ts` 中的配置：
```typescript
export const APPWRITE_PROJECT_ID = 'your_project_id_here';
```

### 3. 安装依赖

```bash
# 安装根目录依赖
bun install

# 或者分别安装各应用依赖
cd apps/server && bun install
cd apps/web && bun install  
cd apps/native && bun install
```

### 4. 设置 Appwrite 数据库

```bash
cd apps/server
bun run setup-appwrite
```

这将创建：
- 数据库: `chat-database`
- 集合: `users`, `conversations`, `messages`
- 必要的属性和索引

### 5. 配置 Appwrite 认证

在 Appwrite 控制台中：

1. **启用认证提供商**：
   - 转到 Auth → Settings
   - 启用 Email/Password
   - 配置 GitHub OAuth（可选）

2. **设置域名**：
   - 添加 `http://localhost:3001` (Web)
   - 添加您的生产域名

### 6. 启动应用

```bash
# 启动服务器 (端口 3000)
cd apps/server
bun run dev

# 启动Web应用 (端口 3001) 
cd apps/web
bun run dev

# 启动Native应用
cd apps/native
bun run dev
```

## 📊 数据库结构

### Users 集合
```typescript
{
  $id: string;              // 用户ID (Appwrite自动生成)
  name: string;             // 用户姓名
  email: string;            // 邮箱地址
  emailVerification: boolean; // 邮箱验证状态
  image?: string;           // 头像URL
  conversationIds: string[]; // 参与的会话ID列表
  seenMessageIds: string[];  // 已读消息ID列表
}
```

### Conversations 集合
```typescript
{
  $id: string;              // 会话ID
  name?: string;            // 会话名称（群聊用）
  isGroup: boolean;         // 是否为群聊
  lastMessageAt?: string;   // 最后消息时间
  userIds: string[];        // 参与用户ID列表
  messageIds: string[];     // 消息ID列表
}
```

### Messages 集合  
```typescript
{
  $id: string;              // 消息ID
  body?: string;            // 消息内容
  image?: string;           // 图片URL
  conversationId: string;   // 所属会话ID
  senderId: string;         // 发送者ID
  seenIds: string[];        // 已读用户ID列表
}
```

## 🔧 主要变更

### 认证系统
- **之前**: Better-auth with Prisma adapter
- **现在**: Appwrite Auth
- **变更**: 会话通过 `x-appwrite-session` header 传递

### 数据库查询
- **之前**: Prisma ORM with MongoDB
- **现在**: Appwrite Database with REST API
- **变更**: 使用 Appwrite SDK 的查询方法

### 实时通信
- **之前**: Ably channels
- **现在**: Appwrite Realtime
- **变更**: 自动基于数据库文档变更触发事件

### API 端点
- **认证**: `/api/auth/**` → Appwrite Auth API
- **RPC**: `/rpc/**` → 保持不变
- **实时**: Ably channels → Appwrite Realtime subscriptions

## 🛠️ 开发指南

### 添加新的数据集合

1. 在 `apps/server/src/lib/appwrite.ts` 中添加集合常量
2. 更新 `apps/server/scripts/setup-appwrite.ts` 
3. 在 `DatabaseService` 中添加相应的 CRUD 方法

### 实时事件处理

使用 Appwrite Realtime 订阅：

```typescript
import { AppwriteRealtime } from './lib/appwrite';

// 订阅会话更新
const unsubscribe = AppwriteRealtime.subscribeToConversation(
  conversationId,
  (payload) => {
    console.log('Conversation updated:', payload);
  }
);

// 取消订阅
unsubscribe();
```

### 权限管理

Appwrite 使用细粒度权限控制：

```typescript
// 创建文档时设置权限
await databases.createDocument(
  databaseId,
  collectionId, 
  documentId,
  data,
  [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
  ]
);
```

## 🔍 故障排除

### 常见问题

1. **认证失败**
   - 检查项目ID和API密钥是否正确
   - 确认域名已添加到 Appwrite 项目中

2. **实时连接问题**  
   - 验证 WebSocket 连接未被防火墙阻止
   - 检查浏览器控制台的连接错误

3. **数据库查询失败**
   - 确认集合和属性已正确创建
   - 检查文档权限设置

4. **跨域问题**
   - 在 Appwrite 控制台添加正确的域名
   - 检查 CORS 设置

### 调试技巧

```bash
# 检查服务器日志
cd apps/server && bun run dev

# 查看Appwrite控制台日志
# 访问 Appwrite 控制台 → 项目 → 日志

# 监控实时连接
# 浏览器开发者工具 → Network → WS
```

## 📱 移动应用注意事项

1. **平台配置**: 在 `apps/native/lib/appwrite.ts` 中设置正确的平台ID
2. **权限**: 确保应用有网络访问权限
3. **深度链接**: 配置 OAuth 回调的深度链接

## 🚀 部署建议

### 生产环境配置

1. **Appwrite 生产实例**
   - 使用专用的 Appwrite Cloud 项目
   - 或部署自托管 Appwrite 实例

2. **环境变量**
   - 为每个环境（dev/staging/prod）创建独立的 Appwrite 项目
   - 使用安全的密钥管理

3. **域名配置**
   - 在 Appwrite 控制台添加生产域名
   - 配置 SSL 证书

## 📞 获取帮助

- [Appwrite 官方文档](https://appwrite.io/docs)
- [Appwrite 社区 Discord](https://discord.gg/appwrite)
- [GitHub Issues](https://github.com/appwrite/appwrite/issues)

---

迁移完成！🎉 您的聊天应用现在完全基于 Appwrite 运行，享受更简单的架构和更强大的功能。 