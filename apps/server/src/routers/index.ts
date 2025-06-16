import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { conversationRouter } from "./conversation";
import { messagesRouter } from "./messages";
import { ablyRouter } from "./puser";
import { userRouter } from "./user";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	user: userRouter,
	conversation: conversationRouter,
	messages: messagesRouter,
	ably: ablyRouter,
};
export type AppRouter = typeof appRouter;
