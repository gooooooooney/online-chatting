import type { Context } from "../../server/src/lib/context";
export type {
	FullConversation,
	Conversation,
	Message,
} from "../../server/types";
export type User = NonNullable<Context["session"]>["user"];
export type Session = NonNullable<Context["session"]>;
