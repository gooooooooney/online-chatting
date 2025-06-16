import type { Context as HonoContext } from "hono";
import { AppwriteAuth } from "./auth";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
	// Get session from headers
	const result = await AppwriteAuth.verifySession(context.req.raw.headers);

	return {
		session: result
			? {
					user: {
						id: result.user.$id,
						email: result.user.email,
						name: result.user.name,
						image: result.user.prefs?.image || null,
						emailVerified: result.user.emailVerification,
					},
					sessionId: result.session.$id,
				}
			: null,
		// Include raw Appwrite user and session for advanced operations
		appwriteUser: result?.user || null,
		appwriteSession: result?.session || null,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
