import z from "zod";
import { protectedProcedure } from "../lib/orpc";
import pusher from "../lib/pusher";

export const pusherRouter = {
	auth: protectedProcedure
		.input(
			z.object({
				socket_id: z.string(),
				channel_name: z.string(),
			}),
		)
		.handler(async ({ context, input }) => {
			const { socket_id, channel_name } = input;
			const user = context.session?.user;
			const userEmail = user?.email;
			const authResponse = pusher.authorizeChannel(socket_id, channel_name, {
				user_id: userEmail,
			});
			return authResponse;
		}),
};
