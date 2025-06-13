import { getSession } from "@/lib/auth/get-session";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const session = await getSession();
	if (!session?.user?.email) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const clientId = searchParams.get("clientId") || session.user.email;

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/api/ably/auth?clientId=${encodeURIComponent(clientId)}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: request.headers.get("cookie") || "",
			},
		},
	);

	if (!response.ok) {
		console.error(response.statusText);
		return Response.json({ error: "Ably error" }, { status: 500 });
	}

	const tokenRequest = await response.json();
	return Response.json(tokenRequest);
}
