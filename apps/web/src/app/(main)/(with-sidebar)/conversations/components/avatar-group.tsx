"use client";

import {
	AvatarFallback,
	AvatarImage,
	Avatar as AvatarUI,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface AvatarGroupProps {
	users: User[];
}

export const AvatarGroup = ({ users }: AvatarGroupProps) => {
	const slicedUsers = users.slice(0, 3);
	const positionMap = {
		0: "top-0 left-[12px]",
		1: "bottom-0",
		2: "bottom-0 right-0",
	};
	return (
		<div className="relative size-11">
			{slicedUsers.map((user, index) => (
				<AvatarUI
					className={cn(
						"size-[21px] inline-block overflow-hidden absolute",
						positionMap[index as keyof typeof positionMap],
					)}
					key={user.id}
				>
					<AvatarImage
						src={user?.image ?? ""}
						alt="Avatar"
						className="object-cover"
					/>
					<AvatarFallback className={cn("bg-gray-400 text-white text-[10px]")}>
						{user?.name?.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</AvatarUI>
			))}
		</div>
	);
};
