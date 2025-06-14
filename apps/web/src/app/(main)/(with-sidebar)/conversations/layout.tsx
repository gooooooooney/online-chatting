import { serverClient } from "@/utils/server-client";
import { ConversationList } from "./components/conversation-list";

export default async function ConversationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const initialItems = await serverClient.conversation.getConversationList();
	const users = await serverClient.user.getUsers();
	return (
		<div className="h-full">
			<ConversationList initialItems={initialItems || []} users={users} />
			{children}
		</div>
	);
}
