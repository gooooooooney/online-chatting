import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure } from "../lib/orpc";
import AppwriteRealtime from "../lib/realtime";
import DatabaseService from "../services/database";

export const conversationRouter = {
	createConversation: protectedProcedure
		.input(
			z.object({
				userId: z.string().optional(),
				isGroup: z.boolean().optional(),
				name: z.string().optional(),
				members: z
					.array(
						z.object({
							value: z.string(),
							label: z.string().optional(),
						}),
					)
					.optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const currentUser = context.session?.user;
			if (!currentUser) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "User not authenticated",
				});
			}

			const { userId, isGroup, name, members } = input;
			const db = new DatabaseService(context.appwriteSession?.$id);

			if (isGroup && (!members || members.length < 2 || !name)) {
				throw new ORPCError("BAD_REQUEST", {
					message: "Invalid group conversation data",
				});
			}

			if (isGroup && members) {
				const userIds = [
					...members.map((member) => member.value),
					currentUser.id,
				];

				const newConversation = await db.createConversation({
					name,
					isGroup: true,
					userIds,
				});

				// Trigger real-time updates for all participants
				AppwriteRealtime.triggerConversationUpdate(
					newConversation.$id,
					newConversation,
				);

				return newConversation;
			}

			if (!userId) {
				throw new ORPCError("BAD_REQUEST", {
					message: "User ID is required for one-on-one conversation",
				});
			}

			// Check for existing conversation
			const existingConversation = await db.findExistingConversation([
				currentUser.id,
				userId,
			]);

			if (existingConversation) {
				return existingConversation;
			}

			// Create new conversation
			const newConversation = await db.createConversation({
				isGroup: false,
				userIds: [currentUser.id, userId],
			});

			// Trigger real-time updates
			AppwriteRealtime.triggerConversationUpdate(
				newConversation.$id,
				newConversation,
			);

			return newConversation;
		}),

	getConversationList: protectedProcedure.handler(async ({ context }) => {
		const currentUser = context.session?.user;
		if (!currentUser) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "User not authenticated",
			});
		}

		const db = new DatabaseService(context.appwriteSession?.$id);
		const conversations = await db.getUserConversations(currentUser.id);

		// Get full conversation data with messages and users
		const fullConversations = await Promise.all(
			conversations.map(async (conv) => {
				return await db.getFullConversation(conv.$id);
			}),
		);

		return fullConversations.filter(Boolean);
	}),

	getConversationById: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			const currentUser = context.session?.user;
			if (!currentUser) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "User not authenticated",
				});
			}

			const { conversationId } = input;
			const db = new DatabaseService(context.appwriteSession?.$id);

			const conversation = await db.getFullConversation(conversationId);

			if (!conversation) {
				throw new ORPCError("NOT_FOUND", {
					message: "Conversation not found",
				});
			}

			// Check if user is participant
			if (!conversation.userIds.includes(currentUser.id)) {
				throw new ORPCError("FORBIDDEN", {
					message: "Access denied",
				});
			}

			return conversation;
		}),

	seen: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			const { conversationId } = input;
			const currentUser = context.session?.user;
			if (!currentUser) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "User not authenticated",
				});
			}

			const db = new DatabaseService(context.appwriteSession?.$id);
			const conversation = await db.getFullConversation(conversationId);

			if (!conversation) {
				throw new ORPCError("NOT_FOUND", {
					message: "Conversation not found",
				});
			}

			// Check if user is participant
			if (!conversation.userIds.includes(currentUser.id)) {
				throw new ORPCError("FORBIDDEN", {
					message: "Access denied",
				});
			}

			const lastMessage =
				conversation.messages[conversation.messages.length - 1];
			if (!lastMessage) {
				return conversation;
			}

			// Mark message as seen
			const updatedMessage = await db.markMessageAsSeen(
				lastMessage.$id,
				currentUser.id,
			);

			// Don't trigger events if the user is the sender
			if (lastMessage.senderId !== currentUser.id) {
				AppwriteRealtime.triggerMessageUpdate(updatedMessage);
			}

			return updatedMessage;
		}),

	deleteConversation: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			const { conversationId } = input;
			const currentUser = context.session?.user;
			if (!currentUser) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "User not authenticated",
				});
			}

			const db = new DatabaseService(context.appwriteSession?.$id);
			const existingConversation = await db.getConversationById(conversationId);

			if (!existingConversation) {
				throw new ORPCError("NOT_FOUND", {
					message: "Conversation not found",
				});
			}

			// Check if user is participant
			if (!existingConversation.userIds.includes(currentUser.id)) {
				throw new ORPCError("FORBIDDEN", {
					message: "Access denied",
				});
			}

			const deletedConversation = await db.deleteConversation(conversationId);

			// Trigger real-time updates for all participants
			AppwriteRealtime.triggerConversationUpdate(conversationId, {
				deleted: true,
			});

			return deletedConversation;
		}),
};
