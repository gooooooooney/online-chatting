import { authClient } from "@/lib/auth-client";
import type { FullConversation } from "@/types";
import { useMemo } from "react";

export const useOtherUser = (conversation: FullConversation) => {
	const session = authClient.useSession();

	const otherUser = useMemo(() => {
		const currentUserEmail = session.data?.user?.email;

		const otherUser = conversation.users.find(
			(user) => user.email !== currentUserEmail,
		);

		return otherUser;
	}, [session.data?.user?.email, conversation.users]);

	return otherUser;
};
