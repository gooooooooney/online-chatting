import type { Conversation, Message, User } from "./prisma/generated/client";

export type FullMessageType = Message & {
	sender: User;
	seen: User[];
};

export type FullConversation = Conversation & {
	users: User[];
	messages: FullMessageType[];
};

export type { Conversation, Message };
