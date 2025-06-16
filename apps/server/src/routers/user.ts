import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../lib/orpc";
import DatabaseService from "../services/database";

export const userRouter = {
	getUsers: protectedProcedure.handler(async ({ context }) => {
		const currentUser = context.session?.user;
		if (!currentUser) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "User not authenticated",
			});
		}

		const db = new DatabaseService(context.appwriteSession?.$id);

		// In a real application, you might want to implement pagination
		// and filtering. For now, we'll return a basic implementation
		// that doesn't expose all users for privacy reasons.

		// You could implement user search or friend suggestions here
		// For now, return empty array since the original router was minimal
		return [];
	}),

	getUserById: protectedProcedure
		.input(z.object({ userId: z.string() }))
		.handler(async ({ context, input }) => {
			const currentUser = context.session?.user;
			if (!currentUser) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "User not authenticated",
				});
			}

			const { userId } = input;
			const db = new DatabaseService(context.appwriteSession?.$id);

			const user = await db.getUserById(userId);
			if (!user) {
				throw new ORPCError("NOT_FOUND", {
					message: "User not found",
				});
			}

			// Return public user information
			return {
				$id: user.$id,
				name: user.name,
				email: user.email,
				image: user.image,
				$createdAt: user.$createdAt,
			};
		}),

	updateProfile: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				image: z.string().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const currentUser = context.session?.user;
			if (!currentUser) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "User not authenticated",
				});
			}

			const db = new DatabaseService(context.appwriteSession?.$id);

			const updatedUser = await db.updateUser(currentUser.id, {
				...(input.name && { name: input.name }),
				...(input.image && { image: input.image }),
			});

			return updatedUser;
		}),
};
