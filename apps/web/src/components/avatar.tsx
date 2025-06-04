"use client";
import type { User } from "@/types";
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from "./ui/avatar";

interface AvatarProps {
	user?: User;
}

export const Avatar = ({ user }: AvatarProps) => {
	return (
		<div className="relative mx-auto max-h-9 max-w-9 md:max-h-11 md:max-w-11">
			<div className="flex items-center justify-center">
				<AvatarUI className="size-9 md:size-11">
					<AvatarImage
						src={user?.image ?? ""}
						alt="Avatar"
						className="object-cover"
					/>
					<AvatarFallback className="bg-gray-400 text-white text-xl uppercase">
						{user?.name?.charAt(0)}
					</AvatarFallback>
				</AvatarUI>
			</div>
			<span className="absolute top-0 right-0 block size-2 rounded-full bg-green-500 ring-2 ring-white md:size-2.5 " />
		</div>
	);
};
