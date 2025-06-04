import { protectedProcedure, publicProcedure } from "../lib/orpc";
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
};
export type AppRouter = typeof appRouter;
