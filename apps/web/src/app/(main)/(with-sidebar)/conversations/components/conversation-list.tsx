"use client";

import { useConversation } from "@/app/hooks/use-conversation";
import { cn } from "@/lib/utils";
import type { FullConversation } from "@/types";
import { UserPlus2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConversationBox } from "./conversation-box";

interface ConversationListProps {
	initialItems: FullConversation[];
}

export const ConversationList = ({ initialItems }: ConversationListProps) => {
	const [items, setItems] = useState<FullConversation[]>(initialItems);

	const router = useRouter();

	const { conversationId, isOpen } = useConversation();
	return (
		<aside
			className={cn(
				"fixed inset-y-0 overflow-y-auto border-gray-200 border-r pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0",
				isOpen ? "hidden" : "left-0 block w-full",
			)}
		>
			<div className="px-5">
				<div className="mb-4 flex justify-between pt-4">
					<div className="font-bold text-2xl text-neutral-800">Messages</div>
					<div className="cursor-pointer rounded-full bg-gray-100 p-2 transition hover:opacity-75">
						<UserPlus2Icon size={20} />
					</div>
				</div>
				{items.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center">
						<p className="text-gray-500">No conversations found</p>
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
