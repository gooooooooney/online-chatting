"use client";

import { Avatar } from "@/components/avatar";
import { PathRoute } from "@/lib/constants/route";
import type { User } from "@/types";
import { useORPC } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface UserBoxProps {
	data: User;
}

export const UserBox = ({ data }: UserBoxProps) => {
	const router = useRouter();
	const orpc = useORPC();
	const {
		data: conversations,
		isPending,
		mutate: createConversation,
	} = useMutation(
		orpc.conversation.createConversation.mutationOptions({
			onSuccess(data) {
				router.push(PathRoute.getConversationPath(data.id));
			},
		}),
	);

	const handleClick = () => {
		createConversation({ userId: data.id });
	};

	return (
		<div
			onClick={handleClick}
			className="relative flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-neutral-100 dark:hover:bg-gray-800"
		>
			<Avatar user={data} />
			<div className="min-w-0 flex-1">
				<div className="focus:outline-none">
					<div className="mb-1 flex items-center justify-between">
						<p className="font-medium text-foreground text-sm">{data.name}</p>
					</div>
					{/* <span className="block text-sm font-light text-neutral-500">
            {conversations?.users.find((user) => user.id !== data.id)?.name}
          </span> */}
				</div>
			</div>
		</div>
	);
};
