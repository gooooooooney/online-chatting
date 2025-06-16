import { Databases, ID, Permission, Query, Role } from "node-appwrite";
import {
	type AppwriteConversation,
	type AppwriteMessage,
	type AppwriteUser,
	COLLECTIONS,
	DATABASE_ID,
	adminDatabases,
	createUserClient,
} from "../lib/appwrite";

export class DatabaseService {
	private databases: Databases;
	private sessionId?: string;

	constructor(sessionId?: string) {
		if (sessionId) {
			const client = createUserClient(sessionId);
			this.databases = new Databases(client);
		} else {
			this.databases = adminDatabases;
		}
		this.sessionId = sessionId;
	}

	// User operations
	async createUser(userData: {
		id: string;
		name: string;
		email: string;
		emailVerification?: boolean;
		image?: string;
	}) {
		return await this.databases.createDocument(
			DATABASE_ID,
			COLLECTIONS.USERS,
			userData.id,
			{
				name: userData.name,
				email: userData.email,
				emailVerification: userData.emailVerification || false,
				image: userData.image || null,
				conversationIds: [],
				seenMessageIds: [],
			},
			[
				Permission.read(Role.user(userData.id)),
				Permission.update(Role.user(userData.id)),
			],
		);
	}

	async getUserById(userId: string) {
		try {
			return (await this.databases.getDocument(
				DATABASE_ID,
				COLLECTIONS.USERS,
				userId,
			)) as AppwriteUser;
		} catch (error) {
			return null;
		}
	}

	async getUserByEmail(email: string) {
		try {
			const result = await this.databases.listDocuments(
				DATABASE_ID,
				COLLECTIONS.USERS,
				[Query.equal("email", email), Query.limit(1)],
			);
			return (result.documents[0] as AppwriteUser) || null;
		} catch (error) {
			return null;
		}
	}

	async updateUser(userId: string, data: Partial<AppwriteUser>) {
		return await this.databases.updateDocument(
			DATABASE_ID,
			COLLECTIONS.USERS,
			userId,
			data,
		);
	}

	// Conversation operations
	async createConversation(data: {
		name?: string;
		isGroup: boolean;
		userIds: string[];
	}) {
		const conversationId = ID.unique();

		return await this.databases.createDocument(
			DATABASE_ID,
			COLLECTIONS.CONVERSATIONS,
			conversationId,
			{
				name: data.name || null,
				isGroup: data.isGroup,
				lastMessageAt: null,
				userIds: data.userIds,
				messageIds: [],
			},
			[
				// Allow all participants to read and update
				...data.userIds.map((userId) => Permission.read(Role.user(userId))),
				...data.userIds.map((userId) => Permission.update(Role.user(userId))),
			],
		);
	}

	async getConversationById(conversationId: string) {
		try {
			return (await this.databases.getDocument(
				DATABASE_ID,
				COLLECTIONS.CONVERSATIONS,
				conversationId,
			)) as AppwriteConversation;
		} catch (error) {
			return null;
		}
	}

	async getUserConversations(userId: string) {
		try {
			const result = await this.databases.listDocuments(
				DATABASE_ID,
				COLLECTIONS.CONVERSATIONS,
				[Query.contains("userIds", userId), Query.orderDesc("lastMessageAt")],
			);
			return result.documents as AppwriteConversation[];
		} catch (error) {
			return [];
		}
	}

	async updateConversation(
		conversationId: string,
		data: Partial<AppwriteConversation>,
	) {
		return await this.databases.updateDocument(
			DATABASE_ID,
			COLLECTIONS.CONVERSATIONS,
			conversationId,
			data,
		);
	}

	async deleteConversation(conversationId: string) {
		return await this.databases.deleteDocument(
			DATABASE_ID,
			COLLECTIONS.CONVERSATIONS,
			conversationId,
		);
	}

	// Check if conversation exists between users
	async findExistingConversation(userIds: string[]) {
		try {
			// For one-on-one conversations
			if (userIds.length === 2) {
				const result = await this.databases.listDocuments(
					DATABASE_ID,
					COLLECTIONS.CONVERSATIONS,
					[
						Query.equal("isGroup", false),
						Query.contains("userIds", userIds[0]),
						Query.contains("userIds", userIds[1]),
						Query.limit(1),
					],
				);

				// Additional check to ensure exact match
				const conversation = result.documents.find(
					(conv: any) =>
						conv.userIds.length === 2 &&
						conv.userIds.includes(userIds[0]) &&
						conv.userIds.includes(userIds[1]),
				);

				return (conversation as AppwriteConversation) || null;
			}
			return null;
		} catch (error) {
			return null;
		}
	}

	// Message operations
	async createMessage(data: {
		body?: string;
		image?: string;
		conversationId: string;
		senderId: string;
	}) {
		const messageId = ID.unique();

		const message = await this.databases.createDocument(
			DATABASE_ID,
			COLLECTIONS.MESSAGES,
			messageId,
			{
				body: data.body || null,
				image: data.image || null,
				conversationId: data.conversationId,
				senderId: data.senderId,
				seenIds: [data.senderId], // Sender has seen the message
			},
			[
				// Allow conversation participants to read
				Permission.read(Role.any()),
				Permission.update(Role.any()),
			],
		);

		// Update conversation's last message timestamp and add message ID
		const conversation = await this.getConversationById(data.conversationId);
		if (conversation) {
			await this.updateConversation(data.conversationId, {
				lastMessageAt: new Date().toISOString(),
				messageIds: [...conversation.messageIds, messageId],
			});
		}

		return message;
	}

	async getMessageById(messageId: string) {
		try {
			return (await this.databases.getDocument(
				DATABASE_ID,
				COLLECTIONS.MESSAGES,
				messageId,
			)) as AppwriteMessage;
		} catch (error) {
			return null;
		}
	}

	async getConversationMessages(conversationId: string) {
		try {
			const result = await this.databases.listDocuments(
				DATABASE_ID,
				COLLECTIONS.MESSAGES,
				[
					Query.equal("conversationId", conversationId),
					Query.orderAsc("$createdAt"),
				],
			);
			return result.documents as AppwriteMessage[];
		} catch (error) {
			return [];
		}
	}

	async updateMessage(messageId: string, data: Partial<AppwriteMessage>) {
		return await this.databases.updateDocument(
			DATABASE_ID,
			COLLECTIONS.MESSAGES,
			messageId,
			data,
		);
	}

	async markMessageAsSeen(messageId: string, userId: string) {
		const message = await this.getMessageById(messageId);
		if (message && !message.seenIds.includes(userId)) {
			return await this.updateMessage(messageId, {
				seenIds: [...message.seenIds, userId],
			});
		}
		return message;
	}

	// Helper to get full conversation data with messages and users
	async getFullConversation(conversationId: string) {
		const conversation = await this.getConversationById(conversationId);
		if (!conversation) return null;

		const [messages, users] = await Promise.all([
			this.getConversationMessages(conversationId),
			Promise.all(
				conversation.userIds.map((userId) => this.getUserById(userId)),
			),
		]);

		return {
			...conversation,
			messages: messages || [],
			users: users.filter(Boolean) || [],
		};
	}
}

export default DatabaseService;
