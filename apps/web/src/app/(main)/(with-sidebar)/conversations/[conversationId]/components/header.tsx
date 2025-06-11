"use client";

import { useOtherUser } from "@/app/hooks/use-other-user";
import { Avatar } from "@/components/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import type { FullConversation } from "@/types";
import { ChevronLeft, EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { AvatarGroup } from "../../components/avatar-group";
import { ProfileDrawer } from "./profile-drawer";

interface HeaderProps {
	conversation: FullConversation;
}

export const Header = ({ conversation }: HeaderProps) => {
	const otherUser = useOtherUser(conversation);

	const statusText = useMemo(() => {
		if (conversation.isGroup) {
			return `${conversation.users.length} members`;
		}
		return "Active";
	}, [conversation]);

	return (
		<>
			<div className="flex w-full items-center justify-between border-b-[1px]  px-4 py-3 shadow-sm sm:px-4 lg:px-6">
				<div className="flex items-center gap-3">
					<Link
						className="block cursor-pointer text-sky-500 transition hover:text-sky-600 lg:hidden"
						href="/conversations"
					>
						<ChevronLeft size={32} />
					</Link>
					{conversation.isGroup ? (
						<AvatarGroup users={conversation.users} />
					) : (
						<Avatar user={otherUser} />
					)}
					<div className="flex flex-col">
						<div>{conversation.name || otherUser?.name}</div>
						<div className="font-light text-neutral-500 text-sm">
							{statusText}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<ProfileDrawer data={conversation}>
						<EllipsisIcon className="size-5 cursor-pointer" />
					</ProfileDrawer>
				</div>
			</div>
		</>
	);
};
