import { getSession } from "@/lib/auth/get-session";
import type { User } from "@/types";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileFooter } from "./mobile-footer";

export const Sidebar: React.FC<React.PropsWithChildren> = async ({
	children,
}) => {
	const session = await getSession();

	return (
		<div className="h-full">
			<DesktopSidebar currentUser={session?.user} />
			<MobileFooter />
			<main className="h-full lg:pl-20">{children}</main>
		</div>
	);
};
