import { Client, Databases, Query } from "node-appwrite";
import { COLLECTIONS, DATABASE_ID, createUserClient } from "./appwrite";

export class AppwriteRealtime {
	private client: Client;
	private databases: Databases;

	constructor(sessionId?: string) {
		this.client = createUserClient(sessionId);
		this.databases = new Databases(this.client);
	}

	// Subscribe to conversation updates
	subscribeToConversation(
		conversationId: string,
		callback: (payload: any) => void,
	) {
		return this.client.subscribe(
			`databases.${DATABASE_ID}.collections.${COLLECTIONS.CONVERSATIONS}.documents.${conversationId}`,
			callback,
		);
	}

	// Subscribe to messages in a conversation
	subscribeToMessages(
		conversationId: string,
		callback: (payload: any) => void,
	) {
		return this.client.subscribe(
			[
				`databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`,
			],
			(response) => {
				// Filter messages for this conversation
				if (
					response.payload &&
					response.payload.conversationId === conversationId
				) {
					callback(response);
				}
			},
		);
	}

	// Subscribe to user's conversations
	subscribeToUserConversations(
		userId: string,
		callback: (payload: any) => void,
	) {
		return this.client.subscribe(
			`databases.${DATABASE_ID}.collections.${COLLECTIONS.CONVERSATIONS}.documents`,
			(response) => {
				// Filter conversations where user is a participant
				if (response.payload && response.payload.userIds?.includes(userId)) {
					callback(response);
				}
			},
		);
	}

	// Subscribe to all user events (for notifications)
	subscribeToUser(userId: string, callback: (payload: any) => void) {
		return this.client.subscribe(
			[
				`databases.${DATABASE_ID}.collections.${COLLECTIONS.CONVERSATIONS}.documents`,
				`databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`,
			],
			(response) => {
				// Process based on collection
				callback(response);
			},
		);
	}

	// Trigger events (for server-side use)
	static async triggerConversationUpdate(conversationId: string, data: any) {
		// In Appwrite, document updates automatically trigger realtime events
		// This is a placeholder for any additional server-side logic
		console.log("Conversation updated:", conversationId, data);
	}

	static async triggerMessageNew(messageData: any) {
		// In Appwrite, document creation automatically triggers realtime events
		console.log("New message:", messageData);
	}

	static async triggerMessageUpdate(messageData: any) {
		// In Appwrite, document updates automatically trigger realtime events
		console.log("Message updated:", messageData);
	}
}

// Export default realtime instance
export default AppwriteRealtime;
