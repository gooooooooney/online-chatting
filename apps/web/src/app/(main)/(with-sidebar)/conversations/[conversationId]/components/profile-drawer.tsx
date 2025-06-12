"use client";

import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useActiveListStore } from "@/hooks/use-active-list";
import { useOtherUser } from "@/hooks/use-other-user";
import type { FullConversation } from "@/types";
import { format } from "date-fns";
import { XIcon } from "lucide-react";
import { useMemo } from "react";
import { AvatarGroup } from "../../components/avatar-group";
import { ConfirmModal } from "./confirm-modal";

interface ProfileDrawerProps {
	data: FullConversation;
	children: React.ReactNode;
}

export const ProfileDrawer = ({ data, children }: ProfileDrawerProps) => {
	const otherUser = useOtherUser(data);
	const { members } = useActiveListStore();
	const isActive = members.indexOf(otherUser?.email ?? "") !== -1;

	const joinedDate = useMemo(() => {
		if (!otherUser) return null;
		return format(new Date(otherUser.createdAt), "PP");
	}, [otherUser?.createdAt]);

	const title = useMemo(() => {
		return data.name || otherUser?.name;
	}, [data.name, otherUser?.name]);

	const statusText = useMemo(() => {
		if (data.isGroup) {
			return `${data.users.length} members`;
		}
		return isActive ? "Active" : "Offline";
	}, [data.isGroup, data.users.length]);

	return (
		<Drawer direction="right">
			<DrawerTrigger>{children}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="flex items-center flex-row justify-between">
					<div>
						{/* <DrawerTitle className="text-lg font-bold">
              {title}
            </DrawerTitle> */}
					</div>
					<DrawerClose asChild>
						<Button variant="ghost" size="icon">
							<XIcon className="size-4" />
							<span className="sr-only">Close profile drawer</span>
						</Button>
					</DrawerClose>
				</DrawerHeader>
				<div className="flex flex-col items-center gap-2">
					{data.isGroup ? (
						<AvatarGroup users={data.users} />
					) : (
						<Avatar user={otherUser} />
					)}
					<div className="font-bold text-lg">{otherUser?.name}</div>
					<DrawerDescription>{statusText}</DrawerDescription>

					<ConfirmModal />

					<div className="w-full">
						<dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
							{data.isGroup && (
								<div>
									<dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0">
										Email
									</dt>
									<dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2">
										{data.users.map((user) => user.email).join(", ")}
									</dd>
								</div>
							)}
							{!data.isGroup && (
								<div>
									<dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0">
										Email
									</dt>
									<dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2">
										{otherUser?.email}
									</dd>
								</div>
							)}
							{!data.isGroup && (
								<>
									<hr />
									<div>
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 sm:flex-shrink-0">
											Joined
										</dt>
										<dd className="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:col-span-2">
											<time dateTime={joinedDate || ""}>{joinedDate}</time>
										</dd>
									</div>
								</>
							)}
						</dl>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
