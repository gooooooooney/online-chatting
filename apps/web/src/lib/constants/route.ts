export const PathRoute = {
	AUTH_SIGN_IN: "/auth/sign-in",
	AUTH_SIGN_UP: "/auth/sign-up",
	SETTINGS: "/settings",
	AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
	AUTH_RESET_PASSWORD: "/auth/reset-password",
	AUTH_VERIFY_EMAIL: "/auth/verify-email",
	AUTH_VERIFY_EMAIL_TOKEN: "/auth/verify-email-token",
	AUTH_VERIFY_EMAIL_TOKEN_EXPIRED: "/auth/verify-email-token-expired",
	AUTH_VERIFY_EMAIL_TOKEN_INVALID: "/auth/verify-email-token-invalid",
	USERS: "/users",
	getConversationPath: (conversationId: string) =>
		`/conversations/${conversationId}`,
	CONVERSATIONS: "/conversations",
};
