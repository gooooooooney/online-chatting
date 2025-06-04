import { Sidebar } from "@/components/sidebar/sidebar";
import { getSession } from "@/lib/auth/get-session";

export default async function UsersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	return (
		<Sidebar currentUser={session?.user}>
			<div className="h-full">{children}</div>
		</Sidebar>
	);
}
