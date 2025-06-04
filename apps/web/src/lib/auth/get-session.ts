import "server-only";
import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import type { Context } from "../../../../server/src/lib/context";
import { authClient } from "../auth-client";
import { PathRoute } from "../constants/route";

export const getSession = async () => {
	const headers = await getHeaders();
	const { data: session } = (await authClient.$fetch("/get-session", {
		headers: headers,
	})) as { data: Context["session"] };

	if (!session) {
		redirect(PathRoute.AUTH_SIGN_IN);
	}

	return session;
};
