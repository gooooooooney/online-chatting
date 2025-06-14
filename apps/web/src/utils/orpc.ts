import { createORPCReactQueryUtils } from "@orpc/react-query";
import type { RouterUtils } from "@orpc/react-query";
import type { RouterClient } from "@orpc/server";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createContext, use } from "react";
import { toast } from "sonner";
import type { appRouter } from "../../../server/src/routers/index";
import { client } from "./client";

type ORPCReactUtils = RouterUtils<RouterClient<typeof appRouter>>;

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(`Error: ${error.message}`, {
				action: {
					label: "retry",
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

export const orpc = createORPCReactQueryUtils(client);

export const ORPCContext = createContext<ORPCReactUtils | undefined>(undefined);

export function useORPC(): ORPCReactUtils {
	const orpc = use(ORPCContext);
	if (!orpc) {
		throw new Error("ORPCContext is not set up properly");
	}
	return orpc;
}
