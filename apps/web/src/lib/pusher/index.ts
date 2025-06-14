import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(
	process.env.NEXT_PUBLIC_PUSHER_KEY!,
	{
		channelAuthorization: {
			transport: "ajax",
			endpoint: `/api/pusher/auth`,
		},
		cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
		// wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST!,
		// disableStats: true,
		// enabledTransports: ["ws", "wss"],
	},
);
