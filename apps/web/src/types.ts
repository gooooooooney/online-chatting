import type { Context } from "../../server/src/lib/context";
export type {
	FullConversation,
	FullMessageType,
	Conversation,
	Message,
} from "../../server/types";
export type User = NonNullable<Context["session"]>["user"];
export type Session = NonNullable<Context["session"]>;
