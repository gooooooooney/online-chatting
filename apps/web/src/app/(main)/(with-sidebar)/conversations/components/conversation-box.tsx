import { useOtherUser } from "@/app/hooks/use-other-user";
import { Avatar } from "@/components/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { FullConversation } from "@/types";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface ConversationBoxProps {
	data: FullConversation;
	selected: boolean;
}

export const ConversationBox = ({ data, selected }: ConversationBoxProps) => {
	const otherUser = useOtherUser(data);

	const session = authClient.useSession();

	const router = useRouter();

	const handleClick = useCallback(() => {
		router.push(`/conversations/${data.id}`);
	}, [data.id, router]);

	const lastMessage = useMemo(() => {
		const messages = data.messages || [];
		return messages[messages.length - 1];
	}, [data.messages]);

	const userEmail = useMemo(() => {
		return session.data?.user?.email;
	}, [session.data?.user?.email]);

	const hasSeen = useMemo(() => {
		if (!lastMessage) {
			return false;
		}
		const seenArray = lastMessage.seen || [];

		if (!userEmail) {
			return false;
		}

		return seenArray.some((user) => user.email === userEmail);
	}, [userEmail, lastMessage]);

	const lastMessageText = useMemo(() => {
		if (lastMessage?.image) {
			return "Sent an image";
		}
		if (lastMessage?.body) {
			return lastMessage.body;
		}
		return "Started a conversation";
	}, [lastMessage]);

	return (
		<div
			onClick={handleClick}
			className={cn(
				"relative flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-neutral-100",
				selected ? "bg-neutral-100" : "bg-white",
			)}
		>
			<Avatar user={otherUser} />

			<div className="min-w-0 flex-1">
				<div className="focus:outline-none">
					<div className="mb-1 flex items-center justify-between">
						<p className="font-medium text-gray-900 text-sm">
							{data.name || otherUser?.name}
						</p>
						{lastMessage?.createdAt && (
							<p className="font-light text-gray-500 text-xs">
								{format(new Date(lastMessage.createdAt), "p")}
							</p>
						)}
					</div>
					<span
						className={cn(
							"truncate text-sm",
							hasSeen ? "text-gray-500" : "font-medium text-black",
						)}
					>
						{lastMessageText}
					</span>
				</div>
			</div>
		</div>
	);
};
