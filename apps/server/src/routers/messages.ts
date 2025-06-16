import { ORPCError } from "@orpc/server";
import z from "zod";
import { protectedProcedure } from "../lib/orpc";
import AppwriteRealtime from "../lib/realtime";
import DatabaseService from "../services/database";

export const messagesRouter = {
	getMessages: protectedProcedure
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

			// First, verify user has access to this conversation
			const conversation = await db.getConversationById(conversationId);
			if (!conversation) {
				throw new ORPCError("NOT_FOUND", {
					message: "Conversation not found",
				});
			}

			if (!conversation.userIds.includes(currentUser.id)) {
				throw new ORPCError("FORBIDDEN", {
					message: "Access denied",
				});
			}

			const messages = await db.getConversationMessages(conversationId);

			// Get sender information for each message
			const messagesWithSenders = await Promise.all(
				messages.map(async (message) => {
					const sender = await db.getUserById(message.senderId);
					const seenUsers = await Promise.all(
						message.seenIds.map((userId) => db.getUserById(userId)),
					);

					return {
						...message,
						sender: sender
							? {
									$id: sender.$id,
									name: sender.name,
									email: sender.email,
									image: sender.image,
								}
							: null,
						seen: seenUsers.filter(Boolean).map((user) => ({
							$id: user!.$id,
							name: user!.name,
							email: user!.email,
							image: user!.image,
						})),
					};
				}),
			);

			return messagesWithSenders;
		}),

	message: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
				image: z.string().optional(),
				message: z.string().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const currentUser = context.session?.user;
			if (!currentUser) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "User not authenticated",
				});
			}

			const { conversationId, message, image } = input;

			if (!message && !image) {
				throw new ORPCError("BAD_REQUEST", {
					message: "Message body or image is required",
				});
			}

			const db = new DatabaseService(context.appwriteSession?.$id);

			// Verify user has access to this conversation
			const conversation = await db.getConversationById(conversationId);
			if (!conversation) {
				throw new ORPCError("NOT_FOUND", {
					message: "Conversation not found",
				});
			}

			if (!conversation.userIds.includes(currentUser.id)) {
				throw new ORPCError("FORBIDDEN", {
					message: "Access denied",
				});
			}

			try {
				// Create the message
				const newMessage = await db.createMessage({
					body: message,
					image,
					conversationId,
					senderId: currentUser.id,
				});

				// Get the updated conversation with the new message
				const updatedConversation =
					await db.getFullConversation(conversationId);

				if (!updatedConversation) {
					throw new ORPCError("INTERNAL_SERVER_ERROR", {
						message: "Failed to retrieve updated conversation",
					});
				}

				// Get sender information for the new message
				const sender = await db.getUserById(currentUser.id);
				const messageWithSender = {
					...newMessage,
					sender: sender
						? {
								$id: sender.$id,
								name: sender.name,
								email: sender.email,
								image: sender.image,
							}
						: null,
				};

				// Trigger real-time events
				AppwriteRealtime.triggerMessageNew(messageWithSender);

				// Get the last message for conversation update
				const lastMessage =
					updatedConversation.messages[updatedConversation.messages.length - 1];
				if (lastMessage) {
					// Trigger conversation update with last message
					AppwriteRealtime.triggerConversationUpdate(conversationId, {
						id: conversationId,
						lastMessage: lastMessage,
					});
				}

				return messageWithSender;
			} catch (error) {
				console.error("Error creating message:", error);
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Failed to create message",
				});
			}
		}),
};
