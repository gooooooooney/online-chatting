import { ORPCError } from "@orpc/server";
import type { FullConversation } from "types";
import { z } from "zod";
import prisma from "../../prisma";
import { protectedProcedure } from "../lib/orpc";

export const conversationRouter = {
	getConversations: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				isGroup: z.boolean().optional(),
				name: z.string().optional(),
				members: z
					.array(
						z.object({
							value: z.string(),
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
				return newConversation;
			}

			const existingConversations = await prisma.conversation.findMany({
				where: {
					OR: [
						{
							userIds: {
								equals: [userId, currentUser?.id],
							},
						},
						{
							userIds: {
								equals: [currentUser?.id, userId],
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
};
