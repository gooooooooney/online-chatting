import { type Auth, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import prisma from "../../prisma";

export const auth = betterAuth({
	advanced: {
		database: {
			generateId: false,
		},
	},
	database: prismaAdapter(prisma, {
		provider: "mongodb",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		},
	},
	plugins: [
		customSession(async ({ user, session }) => {
			return {
				user,
				session,
			};
		}),
	],
});
