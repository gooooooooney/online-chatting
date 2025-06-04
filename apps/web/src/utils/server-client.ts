import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { headers as getHeaders } from "next/headers";
import type { appRouter } from "../../../server/src/routers/index";

// 服务端专用的orpc客户端，用于服务端组件中调用API

const link = new RPCLink({
	url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
	fetch: async (url, options) => {
		const headersList = await getHeaders();
		return fetch(url, {
			...options,
			headers: Object.fromEntries(headersList),
		});
	},
});

export const serverClient = createORPCClient(link) as RouterClient<
	typeof appRouter
>;
