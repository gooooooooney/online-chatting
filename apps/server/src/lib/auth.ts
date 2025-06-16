import { Account, Client, Users } from "node-appwrite";
import { adminUsers, createUserClient } from "./appwrite";

export interface AuthSession {
	$id: string;
	userId: string;
	expire: string;
	userAgent: string;
	ip: string;
	osCode: string;
	osName: string;
	osVersion: string;
	clientType: string;
	clientCode: string;
	clientName: string;
	clientVersion: string;
	clientEngine: string;
	clientEngineVersion: string;
	deviceName: string;
	deviceBrand: string;
	deviceModel: string;
	countryCode: string;
	countryName: string;
	current: boolean;
	factors: string[];
	secret: string;
}

export interface AuthUser {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	name: string;
	registration: string;
	status: boolean;
	labels: string[];
	passwordUpdate: string;
	email: string;
	phone: string;
	emailVerification: boolean;
	phoneVerification: boolean;
	mfa: boolean;
	prefs: Record<string, any>;
	targets: any[];
	accessedAt: string;
}

export class AppwriteAuth {
	private client: Client;
	private account: Account;

	constructor(sessionId?: string) {
		this.client = createUserClient(sessionId);
		this.account = new Account(this.client);
	}

	// Create email/password session
	async createEmailSession(email: string, password: string) {
		return await this.account.createEmailPasswordSession(email, password);
	}

	// Create account
	async createAccount(email: string, password: string, name: string) {
		const userId = "unique()"; // Let Appwrite generate unique ID
		return await this.account.create(userId, email, password, name);
	}

	// Get current session
	async getSession() {
		try {
			return await this.account.getSession("current");
		} catch (error) {
			return null;
		}
	}

	// Get current user
	async getUser() {
		try {
			return await this.account.get();
		} catch (error) {
			return null;
		}
	}

	// Logout
	async logout() {
		return await this.account.deleteSession("current");
	}

	// Create OAuth2 session (for GitHub)
	createOAuth2Session(
		provider: string,
		successUrl?: string,
		failureUrl?: string,
	) {
		return this.account.createOAuth2Session(
			provider as any,
			successUrl || `${process.env.CORS_ORIGIN}/auth/callback`,
			failureUrl || `${process.env.CORS_ORIGIN}/auth/error`,
		);
	}

	// Verify session from headers
	static async verifySession(
		headers: Headers,
	): Promise<{ user: AuthUser; session: AuthSession } | null> {
		const sessionId = headers.get("x-appwrite-session");
		if (!sessionId) return null;

		try {
			const auth = new AppwriteAuth(sessionId);
			const [user, session] = await Promise.all([
				auth.getUser(),
				auth.getSession(),
			]);

			if (!user || !session) return null;

			return {
				user: user as AuthUser,
				session: session as AuthSession,
			};
		} catch (error) {
			return null;
		}
	}
}

// Export auth handler for API routes
export const authHandler = {
	async handler(request: Request) {
		const url = new URL(request.url);
		const method = request.method;
		const path = url.pathname;

		// Handle different auth endpoints
		if (path.includes("/auth/login") && method === "POST") {
			const { email, password } = await request.json();
			const auth = new AppwriteAuth();
			const session = await auth.createEmailSession(email, password);

			return new Response(JSON.stringify(session), {
				headers: { "Content-Type": "application/json" },
			});
		}

		if (path.includes("/auth/register") && method === "POST") {
			const { email, password, name } = await request.json();
			const auth = new AppwriteAuth();
			const user = await auth.createAccount(email, password, name);

			return new Response(JSON.stringify(user), {
				headers: { "Content-Type": "application/json" },
			});
		}

		if (path.includes("/auth/logout") && method === "POST") {
			const sessionId = request.headers.get("x-appwrite-session");
			if (sessionId) {
				const auth = new AppwriteAuth(sessionId);
				await auth.logout();
			}

			return new Response(JSON.stringify({ success: true }), {
				headers: { "Content-Type": "application/json" },
			});
		}

		if (path.includes("/auth/me") && method === "GET") {
			const result = await AppwriteAuth.verifySession(request.headers);
			if (!result) {
				return new Response(JSON.stringify({ error: "Unauthorized" }), {
					status: 401,
					headers: { "Content-Type": "application/json" },
				});
			}

			return new Response(JSON.stringify(result), {
				headers: { "Content-Type": "application/json" },
			});
		}

		// OAuth2 callback handling would go here
		// For now, return method not allowed
		return new Response(JSON.stringify({ error: "Method not allowed" }), {
			status: 405,
			headers: { "Content-Type": "application/json" },
		});
	},
};

export { AppwriteAuth as auth };
