"use client";

import { Avatar } from "@/components/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { FullMessageType, User } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import { useMemo } from "react";
import { PhotoView } from "react-photo-view";

interface MessageBoxProps {
	data: FullMessageType;
	isLast: boolean;
	isSameSender: boolean;
}

export const MessageBox = ({ data, isLast, isSameSender }: MessageBoxProps) => {
	const session = authClient.useSession();
	const currentUser = session.data?.user;

	const isOwn = useMemo(() => {
		return currentUser?.email === data.sender.email;
	}, [currentUser, data.sender.email]);

	const seenList = useMemo(() => {
		return (data.seen || [])
			.filter((user) => user.email !== data.sender.email)
			.map((user) => user.name)
			.join(", ");
	}, [data.seen, data.sender.email]);

	return (
		<div
			className={cn(
				"flex gap-3 p-4",
				isOwn && "justify-end",
				!isLast && "pb-10",
			)}
		>
			<div className={cn(isOwn && "order-2")}>
				<Avatar user={data.sender} />
			</div>
			<div className={cn("flex flex-col gap-2", isOwn && "items-end")}>
				<div className="flex items-center gap-2">
					<div className="text-sm  text-gray-500">{data.sender.name}</div>
					<div className="text-xs  text-gray-400">
						{format(new Date(data.createdAt), "p")}
					</div>
				</div>
				<div
					className={cn(
						"text-sm w-fit overflow-hidden",
						isOwn ? "bg-sky-500 text-white" : "bg-gray-100 dark:bg-gray-800",
						data.image ? "rounded-md p-0" : "rounded-full py-1.5 px-3",
					)}
				>
					{data.image ? (
						<PhotoView src={data.image}>
							<Image
								src={data.image}
								alt="Image"
								width={288}
								height={288}
								className="object-cover cursor-pointer"
							/>
						</PhotoView>
					) : (
						<div className="break-words whitespace-pre-wrap max-w-xs md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
							{data.body}
						</div>
					)}
				</div>
				{isLast && isOwn && seenList.length > 0 && (
					<div className="text-xs font-light dark:text-gray-500 text-gray-500">
						Seen by {seenList}
					</div>
				)}
			</div>
		</div>
	);
};
