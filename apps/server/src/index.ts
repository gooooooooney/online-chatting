import "dotenv/config";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import ably from "./lib/pusher";
import { appRouter } from "./routers/index";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

const handler = new RPCHandler(appRouter);
app.use("/rpc/*", async (c, next) => {
	const context = await createContext({ context: c });
	const { matched, response } = await handler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});
	if (matched) {
		return c.newResponse(response.body, response);
	}
	await next();
});

app.get("/", (c) => {
	return c.text("OK");
});

app.get("/api/ably/auth", async (c) => {
	const context = await createContext({ context: c });
	if (!context.session?.user?.email) {
		return c.json({ error: "Unauthorized" }, 401);
	}
	const clientId = c.req.query("clientId");
	const tokenRequest = await ably.auth.createTokenRequest({
		clientId: clientId || context.session?.user?.email,
		capability: {
			"*": ["publish", "subscribe", "presence"],
		},
	});
	return c.json(tokenRequest);
});

export default app;
