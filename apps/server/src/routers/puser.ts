import z from "zod";
import { protectedProcedure } from "../lib/orpc";
import ably from "../lib/pusher";

export const ablyRouter = {
	auth: protectedProcedure
		.input(
			z.object({
				clientId: z.string().optional(),
			}),
		)
		.handler(async ({ context, input }) => {
			const { clientId } = input;
			const user = context.session?.user;
			const userEmail = user?.email;

			const tokenRequest = await ably.auth.createTokenRequest({
				clientId: clientId || userEmail,
				capability: {
					"*": ["publish", "subscribe", "presence"],
				},
			});

			return tokenRequest;
		}),
};
