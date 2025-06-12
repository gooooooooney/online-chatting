import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const socket_id = formData.get("socket_id") as string;
	const channel_name = formData.get("channel_name") as string;
	try {
		const authResponse = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/api/pusher/auth`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Cookie: request.headers.get("cookie") || "",
				},
				body: JSON.stringify({ socket_id, channel_name }),
			},
		);
		const authData = await authResponse.json();
		return Response.json(authData);
	} catch (error) {
		console.log(error);
		return Response.json({ error: "Pusher error" }, { status: 500 });
	}
}
