import { AppwriteRealtime, client } from "../appwrite";

// Export the Appwrite client as the real-time client
export const realtimeClient = client;

// Export realtime helpers
export { AppwriteRealtime as realtimeService } from "../appwrite";
