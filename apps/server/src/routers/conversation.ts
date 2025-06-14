import { ORPCError } from "@orpc/server";
import type { FullConversation } from "types";
import { z } from "zod";
import prisma from "../../prisma";
import { protectedProcedure } from "../lib/orpc";
import pusher from "../lib/pusher";

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
			const { userId, isGroup, name, members } = input;
			if (isGroup && (!members || members.length < 2 || !name)) {
				throw new ORPCError("BAD_REQUEST", {
					message: "Invalid group conversation data",
				});
			}
			if (isGroup && members) {
				const newConversation = await prisma.conversation.create({
					data: {
						name,
						isGroup,
						users: {
							connect: [
								...members.map((member) => ({ id: member.value })),
								{ id: currentUser?.id },
							],
						},
					},
					include: {
						users: true,
					},
				});
				newConversation.users.forEach((user) => {
					if (user.email) {
						pusher.trigger(user.email, "conversation:new", newConversation);
					}
				});
				return newConversation;
			}

			const existingConversations = await prisma.conversation.findMany({
				where: {
					OR: [
						{
							userIds: {
								equals: [userId!, currentUser?.id],
							},
						},
						{
							userIds: {
								equals: [currentUser?.id!, userId!],
							},
						},
					],
				},
			});
			const singleConversation = existingConversations[0];
			if (singleConversation) {
				return singleConversation;
			}

			const newConversation = await prisma.conversation.create({
				data: {
					users: {
						connect: [{ id: currentUser?.id }, { id: userId }],
					},
				},
				include: {
					users: true,
				},
			});
			newConversation.users.forEach((user) => {
				if (user.email) {
					pusher.trigger(user.email, "conversation:new", newConversation);
				}
			});
			return newConversation;
		}),
	getConversationList: protectedProcedure.handler(async ({ context }) => {
		const currentUser = context.session?.user;
		const conversations = await prisma.conversation.findMany({
			where: {
				userIds: {
					has: currentUser?.id,
				},
			},
			orderBy: {
				lastMessageAt: "desc",
			},
			include: {
				users: true,
				messages: {
					include: {
						sender: true,
						seen: true,
					},
				},
			},
		});

		return conversations;
	}),
	getConversationById: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			const { conversationId } = input;

			const conversation: FullConversation | null =
				await prisma.conversation.findUnique({
					where: {
						id: conversationId,
					},
					include: {
						users: true,
						messages: {
							include: {
								sender: true,
								seen: true,
							},
						},
					},
				});

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
			const conversation = await prisma.conversation.findUnique({
				where: {
					id: conversationId,
				},
				include: {
					messages: {
						include: {
							seen: true,
						},
					},
					users: true,
				},
			});
			if (!conversation) {
				throw new ORPCError("NOT_FOUND", {
					message: "Conversation not found",
				});
			}
			const lastMessage =
				conversation.messages[conversation.messages.length - 1];
			if (!lastMessage) {
				return conversation;
			}
			const updatedMessage = await prisma.message.update({
				where: {
					id: lastMessage.id,
				},
				include: {
					seen: true,
					sender: true,
				},
				data: {
					seen: {
						connect: {
							id: currentUser?.id,
						},
					},
				},
			});
			await pusher.trigger(currentUser?.email!, "conversation:update", {
				id: conversationId,
				messages: [updatedMessage],
			});

			if (lastMessage.senderId.indexOf(currentUser?.id!) !== -1) {
				return conversation;
			}
			await pusher.trigger(conversationId, "message:update", updatedMessage);

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
			const existingConversation = await prisma.conversation.findUnique({
				where: {
					id: conversationId,
				},
				include: {
					users: true,
				},
			});
			if (!existingConversation) {
				throw new ORPCError("NOT_FOUND", {
					message: "Conversation not found",
				});
			}
			const deletedConversation = await prisma.conversation.delete({
				where: {
					id: conversationId,
					userIds: {
						hasSome: [currentUser?.id],
					},
				},
			});
			existingConversation.users.forEach((user) => {
				if (user.email) {
					pusher.trigger(
						user.email,
						"conversation:remove",
						existingConversation,
					);
				}
			});
			return deletedConversation;
		}),
};
