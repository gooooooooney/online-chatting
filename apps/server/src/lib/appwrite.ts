import {
	Account,
	Client,
	Databases,
	ID,
	Permission,
	Query,
	Role,
	Users,
} from "node-appwrite";

// Server-side client for admin operations
export const adminClient = new Client()
	.setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
	.setProject(process.env.APPWRITE_PROJECT_ID!)
	.setKey(process.env.APPWRITE_API_KEY!);

export const adminDatabases = new Databases(adminClient);
export const adminUsers = new Users(adminClient);

// Client factory for user sessions
export function createUserClient(sessionId?: string) {
	const client = new Client()
		.setEndpoint(
			process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
		)
		.setProject(process.env.APPWRITE_PROJECT_ID!);

	if (sessionId) {
		client.setSession(sessionId);
	}

	return client;
}

// Database and Collection IDs
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "chat-database";
export const COLLECTIONS = {
	USERS: "users",
	CONVERSATIONS: "conversations",
	MESSAGES: "messages",
} as const;

// Utility functions
export { Query, ID, Permission, Role };

// Types for documents
export interface AppwriteUser {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	name: string;
	email: string;
	emailVerification: boolean;
	image?: string;
	conversationIds: string[];
	seenMessageIds: string[];
}

export interface AppwriteConversation {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	name?: string;
	isGroup: boolean;
	lastMessageAt?: string;
	userIds: string[];
	messageIds: string[];
}

export interface AppwriteMessage {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	body?: string;
	image?: string;
	conversationId: string;
	senderId: string;
	seenIds: string[];
}
