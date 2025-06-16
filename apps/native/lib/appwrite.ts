import { Client, Account, Databases, ID, Query } from 'react-native-appwrite';

// Appwrite configuration
export const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = 'YOUR_PROJECT_ID'; // Replace with your project ID
export const DATABASE_ID = 'chat-database';

export const COLLECTIONS = {
  USERS: 'users',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
} as const;

// Create Appwrite client
export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform('com.yourcompany.oralapp'); // Replace with your app bundle ID

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

// Real-time subscriptions helper
export class AppwriteRealtime {
  static subscribeToConversation(conversationId: string, callback: (payload: any) => void) {
    return client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.CONVERSATIONS}.documents.${conversationId}`,
      callback
    );
  }

  static subscribeToMessages(conversationId: string, callback: (payload: any) => void) {
    return client.subscribe([
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`,
    ], (response) => {
      // Filter messages for this conversation
      if (response.payload && response.payload.conversationId === conversationId) {
        callback(response);
      }
    });
  }

  static subscribeToUserConversations(userId: string, callback: (payload: any) => void) {
    return client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.CONVERSATIONS}.documents`,
      (response) => {
        // Filter conversations where user is a participant
        if (response.payload && response.payload.userIds?.includes(userId)) {
          callback(response);
        }
      }
    );
  }
}

// Authentication helpers
export class AppwriteAuth {
  static async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  }

  static async getCurrentSession() {
    try {
      return await account.getSession('current');
    } catch {
      return null;
    }
  }

  static async login(email: string, password: string) {
    return await account.createEmailPasswordSession(email, password);
  }

  static async register(email: string, password: string, name: string) {
    return await account.create(ID.unique(), email, password, name);
  }

  static async logout() {
    return await account.deleteSession('current');
  }
}

// Export utilities
export { ID, Query }; 