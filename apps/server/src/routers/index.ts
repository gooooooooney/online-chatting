import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { conversationRouter } from "./conversation";
import { messagesRouter } from "./messages";
import { todoRouter } from "./todo";
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
	todo: todoRouter,
	user: userRouter,
	conversation: conversationRouter,
	messages: messagesRouter,
};
export type AppRouter = typeof appRouter;
