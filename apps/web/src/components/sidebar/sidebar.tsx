import type { User } from "@/types";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileFooter } from "./mobile-footer";

interface SidebarProps extends React.PropsWithChildren {
	currentUser?: User;
}

export const Sidebar = async ({ children, currentUser }: SidebarProps) => {
	return (
		<div className="h-full">
			<DesktopSidebar currentUser={currentUser} />
			<MobileFooter />
			<main className="h-full lg:pl-20">{children}</main>
		</div>
	);
};
