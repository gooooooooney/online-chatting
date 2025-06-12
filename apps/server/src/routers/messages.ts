import z from "zod";
import prisma from "../../prisma";
import { protectedProcedure } from "../lib/orpc";
import pusher from "../lib/pusher";

export const messagesRouter = {
	getMessages: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			const { conversationId } = input;

			const messages = await prisma.message.findMany({
				where: {
					conversationId,
				},
				include: {
					sender: true,
					seen: true,
				},
				orderBy: {
					createdAt: "asc",
				},
			});

			return messages;
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
			const { user } = context.session;
			const { conversationId, message, image } = input;

			try {
				const newMessage = await prisma.message.create({
					data: {
						body: message,
						image,
						conversation: {
							connect: {
								id: conversationId,
							},
						},
						sender: {
							connect: {
								id: user.id,
							},
						},
						seen: {
							connect: {
								id: user.id,
							},
						},
					},
					include: {
						sender: true,
					},
				});
				const updatedConversation = await prisma.conversation.update({
					where: {
						id: conversationId,
					},
					data: {
						lastMessageAt: new Date(),
						messages: {
							connect: {
								id: newMessage.id,
							},
						},
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
				await pusher.trigger(conversationId, "message:new", newMessage);

				const lastMessage =
					updatedConversation.messages[updatedConversation.messages.length - 1];

				updatedConversation.users.forEach((user) => {
					if (user.email) {
						pusher.trigger(user.email, "conversation:update", {
							id: conversationId,
							messages: [lastMessage],
						});
					}
				});
				return newMessage;
			} catch (error) {
				console.error(error);
			}
		}),
};
