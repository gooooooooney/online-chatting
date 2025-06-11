"use client";

import type { User } from "@/types";
import { UserBox } from "./user-box";

interface UsersListProps {
	users: User[];
}

export const UsersList = ({ users }: UsersListProps) => {
	return (
		<aside className="fixed inset-y-0 left-0 block w-full overflow-y-auto  border-r pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0 dark:bg-gray-900 bg-white">
			<div className="px-5">
				<div className="flex-col">
					<div className="py-4 font-bold text-2xl text-primary">People</div>
					<div className="flex flex-col gap-1">
						{users.map((user) => (
							<UserBox key={user.id} data={user} />
						))}
					</div>
				</div>
			</div>
		</aside>
	);
};
