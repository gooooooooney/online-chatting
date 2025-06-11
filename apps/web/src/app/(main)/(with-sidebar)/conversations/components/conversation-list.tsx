"use client";

import { useConversation } from "@/app/hooks/use-conversation";
import { cn } from "@/lib/utils";
import type { FullConversation, User } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
	const [items, setItems] = useState<FullConversation[]>(initialItems);

	const router = useRouter();

	const { conversationId, isOpen } = useConversation();
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
