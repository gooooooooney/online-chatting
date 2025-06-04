import { Sidebar } from "@/components/sidebar/sidebar";
import type { User } from "@/types";
import { serverClient } from "@/utils/server-client";
import { UsersList } from "./components/user-list";

export default async function UsersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let users: User[] = [];
	try {
		users = await serverClient.user.getUsers();
	} catch (error) {
		console.error(error);
	}

	return (
		<div className="h-full">
			<UsersList users={users} />
			{children}
		</div>
	);
}
