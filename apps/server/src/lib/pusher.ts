import * as Ably from "ably";

const ably = new Ably.Rest({
	key: process.env.ABLY_API_KEY!,
	environment: process.env.ABLY_ENVIRONMENT, // optional for custom environments
});

export default ably;
