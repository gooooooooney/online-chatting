"use client";

import { useConversation } from "@/hooks/use-conversation";
import { authClient } from "@/lib/auth-client";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import type { FullConversation, User } from "@/types";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ConversationBox } from "./conversation-box";
import GroupChatModal from "./group-chat-modal";

interface ConversationListProps {
	initialItems: FullConversation[];
	users: User[];
}

export const ConversationList = ({
	initialItems = [],
	users,
}: ConversationListProps) => {
	const session = authClient.useSession();

	const [items, setItems] = useState<FullConversation[]>(initialItems);

	const router = useRouter();

	const { conversationId, isOpen } = useConversation();

	const pusherKey = useMemo(() => {
		return session.data?.user?.email;
	}, [session.data?.user?.email]);

	useEffect(() => {
		if (!pusherKey) {
			return;
		}
		pusherClient.subscribe(pusherKey);

		const newConversationHandler = (conversation: FullConversation) => {
			setItems((current) => {
				if (find(current, { id: conversation.id })) {
					return current;
				}
				return [conversation, ...current];
			});
		};
		const updateConversationHandler = (conversation: FullConversation) => {
			setItems((current) => {
				return current.map((currentConversation) => {
					if (currentConversation.id === conversation.id) {
						return {
							...currentConversation,
							messages: conversation.messages,
						};
					}
					return currentConversation;
				});
			});
		};
		const removeConversationHandler = (conversation: FullConversation) => {
			setItems((current) => {
				return current.filter(
					(currentConversation) => currentConversation.id !== conversation.id,
				);
			});
			if (conversationId === conversation.id) {
				router.push("/conversations");
			}
		};
		pusherClient.bind("conversation:new", newConversationHandler);
		pusherClient.bind("conversation:update", updateConversationHandler);
		pusherClient.bind("conversation:remove", removeConversationHandler);
		return () => {
			pusherClient.unsubscribe(pusherKey);
			pusherClient.unbind("conversation:new", newConversationHandler);
			pusherClient.unbind("conversation:update", updateConversationHandler);
			pusherClient.unbind("conversation:remove", removeConversationHandler);
		};
	}, [pusherKey, conversationId, router]);

	return (
		<aside
			className={cn(
				"fixed inset-y-0 overflow-y-auto dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-200 border-r pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0",
				isOpen ? "hidden" : "left-0 block w-full",
			)}
		>
			<div className="px-5">
				<div className="mb-4 flex justify-between pt-4">
					<div className="font-bold text-2xl text-primary/80">Messages</div>
					<GroupChatModal users={users} />
				</div>
				{items.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center">
						<p className="text-gray-500 dark:text-gray-400">
							No conversations found
						</p>
					</div>
				) : (
					items.map((item) => (
						<ConversationBox
							key={item.id}
							data={item}
							selected={conversationId === item.id}
						/>
					))
				)}
			</div>
		</aside>
	);
};
