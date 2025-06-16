import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { conversationRouter } from "./conversation";
import { messagesRouter } from "./messages";
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
	getCurrentUser: publicProcedure.handler(async ({ context }) => {
		return context.session?.user || null;
	}),
	user: userRouter,
	conversation: conversationRouter,
	messages: messagesRouter,
};

export type AppRouter = typeof appRouter;
