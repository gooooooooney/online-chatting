import { EmptyState } from "@/components/empty-state";
import { serverClient } from "@/utils/server-client";
import { Body } from "./components/body";
import { Form } from "./components/form";
import { Header } from "./components/header";

export default async function ConversationPage({
	params,
}: {
	params: Promise<{ conversationId: string }>;
}) {
	const { conversationId } = await params;

	const conversation = await serverClient.conversation.getConversationById({
		conversationId,
	});

	const messages = await serverClient.messages.getMessages({ conversationId });

	if (!conversation) {
		return (
			<div className="h-full lg:pl-80">
				<div className="flex h-full flex-col">
					<EmptyState />
				</div>
			</div>
		);
	}

	return (
		<div className="h-full lg:pl-80">
			<div className="flex h-full flex-col">
				<Header conversation={conversation} />
				<Body />
				<Form />
			</div>
		</div>
	);
}
