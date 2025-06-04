import prisma from "../../prisma";
import { protectedProcedure, publicProcedure } from "../lib/orpc";

export const userRouter = {
	getCurrentUser: publicProcedure.handler(async ({ context }) => {
		return context.session?.user;
	}),
	getUsers: protectedProcedure.handler(async ({ context }) => {
		const { session } = context;
		try {
			const users = await prisma.user.findMany({
				orderBy: {
					createdAt: "desc",
				},
				where: {
					NOT: {
						email: session?.user?.email ?? "",
					},
				},
			});
			return users;
		} catch (error) {
			return [];
		}
	}),
};
