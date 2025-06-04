import { protectedProcedure, publicProcedure } from "../lib/orpc";

export const userRouter = {
	getCurrentUser: publicProcedure.handler(async ({ context }) => {
		return context.session?.user;
	}),
};
