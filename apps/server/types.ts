import type { Conversation, Message, User } from "./prisma/generated/client";

export type FullMessageType = Message & {
	sender: User;
	seen: User[];
	// seenByIds: string[];
};

export type FullConversation = Conversation & {
	users: User[];
	messages: FullMessageType[];
};
