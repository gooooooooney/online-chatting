"use client";
import { useActiveListStore } from "@/hooks/use-active-list";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from "./ui/avatar";

interface AvatarProps {
	user?: User;
	classNames?: {
		wrapper?: string;
		fallback?: string;
	};
}

export const Avatar = ({ user, classNames }: AvatarProps) => {
	const { members } = useActiveListStore();
	const isActive = members.indexOf(user?.email ?? "") !== -1;
	return (
		<div
			className={cn(
				"relative mx-auto max-h-9 max-w-9 md:max-h-11 md:max-w-11",
				classNames?.wrapper,
			)}
		>
			<div className="flex items-center justify-center">
				<AvatarUI className="size-9 md:size-11">
					<AvatarImage
						src={user?.image ?? ""}
						alt="Avatar"
						className="object-cover"
					/>
					<AvatarFallback
						className={cn(
							"bg-gray-400 text-white text-xl uppercase",
							classNames?.fallback,
						)}
					>
						{user?.name?.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</AvatarUI>
			</div>
			{isActive && (
				<span className="absolute top-0 right-0 block size-2 rounded-full bg-green-500 ring-2 ring-white md:size-2.5 " />
			)}
		</div>
	);
};
