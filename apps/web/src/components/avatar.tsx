"use client";
import type { User } from "@/types";
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from "./ui/avatar";

interface AvatarProps {
	user?: User;
}

export const Avatar = ({ user }: AvatarProps) => {
	return (
		<div className="relative">
			{/* <div className="relative inline-block h-9 w-9 overflow-hidden rounded-full md:h-11 md:w-11"> */}
			<div className="flex items-center justify-center">
				<AvatarUI className="size-9 md:size-11">
					<AvatarImage
						src={user?.image ?? ""}
						alt="Avatar"
						className="object-cover"
					/>
					<AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
				</AvatarUI>
			</div>
		</div>
	);
};
