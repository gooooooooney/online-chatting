# Pusher 到 Ably 迁移指南

## 概述

本项目已成功从 Pusher 迁移到 Ably 实时消息服务。以下是所做的主要更改和配置步骤。

## 环境变量配置

### 服务器端 (.env)

移除以下 Pusher 环境变量：
```
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```

添加以下 Ably 环境变量：
```
ABLY_API_KEY=your_ably_api_key_here
ABLY_ENVIRONMENT=production  # 可选，默认为 production
```

### 客户端环境变量

不再需要以下变量：
```
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
```

**重要**: Ably 使用服务器端认证，客户端通过 `/api/ably/auth` 端点获取认证 token。不需要在客户端配置 API Key。

## 主要更改

### 1. 服务器端更改

#### 依赖包
- 移除：`pusher`
- 添加：`ably`

#### 文件更改
- `apps/server/src/lib/pusher.ts` - 替换为 Ably REST 客户端
- `apps/server/src/routers/puser.ts` - 更新为 Ably token 认证
- `apps/server/src/routers/index.ts` - 更新路由名称
- `apps/server/src/index.ts` - 更新认证端点 (GET 方法)
- `apps/server/src/routers/conversation.ts` - 替换触发方法
- `apps/server/src/routers/messages.ts` - 替换触发方法

### 2. Web 端更改

#### 依赖包
- 移除：`pusher-js`
- 添加：`ably`

#### 文件更改
- `apps/web/src/lib/pusher/index.ts` - 替换为 Ably 实时客户端
- `apps/web/src/app/api/ably/auth/route.ts` - 新的认证端点 (GET 方法)
- `apps/web/src/hooks/use-active-channel.ts` - 更新为 Ably presence API，修复无限循环
- `apps/web/src/app/(main)/(with-sidebar)/conversations/components/conversation-list.tsx` - 更新事件监听
- `apps/web/src/app/(main)/(with-sidebar)/conversations/[conversationId]/components/body.tsx` - 更新消息监听

## API 更改对比

### 认证端点
**重要变更**: 认证端点从 POST 改为 GET 方法

**服务器端:**
```javascript
// 新的 GET 端点
app.get("/api/ably/auth", async (c) => {
  const { clientId } = c.req.query();
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: clientId || context.session?.user?.email,
    capability: { "*": ["publish", "subscribe", "presence"] }
  });
  return c.json(tokenRequest);
});
```

**Web 端:**
```javascript
// 新的 GET 方法调用
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId') || session.user.email;
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/ably/auth?clientId=${encodeURIComponent(clientId)}`,
    { method: "GET" }
  );
}
```

### 认证
**Pusher:**
```javascript
pusher.authorizeChannel(socket_id, channel_name, { user_id: userEmail });
```

**Ably:**
```javascript
ably.auth.createTokenRequest({
  clientId: userEmail,
  capability: { "*": ["publish", "subscribe", "presence"] }
});
```

### 发布消息
**Pusher:**
```javascript
pusher.trigger(channelName, eventName, data);
```

**Ably:**
```javascript
const channel = ably.channels.get(channelName);
await channel.publish(eventName, data);
```

### 订阅消息
**Pusher:**
```javascript
pusherClient.subscribe(channelName);
pusherClient.bind(eventName, handler);
```

**Ably:**
```javascript
const channel = ablyClient.channels.get(channelName);
channel.subscribe(eventName, handler);
```

### Presence 功能
**Pusher:**
```javascript
channel.bind("pusher:subscription_succeeded", (members) => {});
channel.bind("pusher:member_added", (member) => {});
channel.bind("pusher:member_removed", (member) => {});
```

**Ably:**
```javascript
await channel.presence.enter();
channel.presence.subscribe("enter", (member) => {});
channel.presence.subscribe("leave", (member) => {});
const presenceSet = await channel.presence.get();
```

## 配置获取 Ably API Key

1. 注册 [Ably 账户](https://ably.com/)
2. 创建新的应用
3. 在应用控制台中找到 API Key
4. 复制完整的 API Key（包含 key name 和 secret）
5. 将其设置为 `ABLY_API_KEY` 环境变量

## 功能验证

迁移完成后，请验证以下功能：

1. **实时消息** - 发送和接收消息是否正常
2. **会话更新** - 新会话、更新、删除是否同步
3. **在线状态** - 用户在线/离线状态是否正确显示
4. **认证** - 用户认证和权限是否正常工作

## 常见问题解决

### 1. "405 Method Not Allowed" 错误
确保服务器端和客户端都使用 GET 方法进行认证：
- 服务器端: `app.get("/api/ably/auth", ...)`
- 客户端: `method: "GET"`

### 2. "Maximum update depth exceeded" 错误
这通常是由于 useEffect 依赖项导致的无限循环。确保：
- 不要在 useEffect 依赖项中包含会在 useEffect 内部改变的状态
- 使用 useRef 来存储稳定的引用

### 3. 客户端配置错误
使用 `authUrl` 时，不要同时配置 `key`：
```javascript
// 正确配置
export const ablyClient = new Ably.Realtime({
  authUrl: `/api/ably/auth`,
  autoConnect: typeof window !== 'undefined',
});

// 错误配置 - 不要同时使用 key
// key: process.env.NEXT_PUBLIC_ABLY_KEY, // ❌ 移除这行
```

## 注意事项

- Ably 的 presence 功能使用不同的 API，但提供了相同的功能
- Ably 支持更强大的功能，如消息历史、自动重连等
- 迁移保持了现有的业务逻辑不变，只替换了底层的实时消息服务
- 认证端点使用 GET 方法更符合 RESTful 设计

## 故障排除

如果遇到问题，请检查：

1. 环境变量是否正确配置
2. Ably API Key 是否有效
3. 网络连接是否正常
4. 浏览器控制台是否有错误信息
5. API 端点方法是否正确 (GET vs POST)

## 回滚方案

如需回滚到 Pusher，请：

1. 恢复旧的环境变量
2. 重新安装 Pusher 依赖包
3. 使用 git 恢复代码更改 