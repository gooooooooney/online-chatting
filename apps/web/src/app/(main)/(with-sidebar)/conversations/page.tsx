"use client";

import { EmptyState } from "@/components/empty-state";
import { useConversation } from "@/hooks/use-conversation";
import { cn } from "@/lib/utils";
export default function ConversationsPage() {
	const { isOpen } = useConversation();
	return (
		<div
			className={cn("h-full lg:block lg:pl-80", isOpen ? "block" : "hidden")}
		>
			<div className="flex h-full flex-col">
				<EmptyState />
			</div>
		</div>
	);
}
