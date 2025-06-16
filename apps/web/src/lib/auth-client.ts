import { AppwriteAuth, account } from "./appwrite";

// Export Appwrite auth as the auth client
export const authClient = {
	// User management
	getCurrentUser: AppwriteAuth.getCurrentUser,
	getCurrentSession: AppwriteAuth.getCurrentSession,

	// Authentication
	signIn: AppwriteAuth.login,
	signUp: AppwriteAuth.register,
	signOut: AppwriteAuth.logout,

	// OAuth
	signInWithOAuth: AppwriteAuth.createOAuth2Session,

	// Account service for advanced operations
	account,
};

export { AppwriteAuth };
