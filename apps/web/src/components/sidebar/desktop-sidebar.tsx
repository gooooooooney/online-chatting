"use client";
import { useRoutes } from "@/hooks/use-routes";
import type { User } from "@/types";
import { UserButton } from "@daveyplate/better-auth-ui";
import { DesktopItem } from "./destop-item";

interface DesktopSidebarProps {
	currentUser?: User;
	users?: any[];
}

export const DesktopSidebar = ({
	currentUser,
	users = [],
}: DesktopSidebarProps) => {
	const routes = useRoutes();

	return (
		<div className="hidden justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r-[1px]  lg:pb-4 xl:px-6">
			<nav className="mt-4 flex flex-col justify-between ">
				<ul className="flex flex-col items-center space-y-1 ">
					{routes.map((route) => (
						<DesktopItem
							key={route.href}
							href={route.href}
							label={route.label}
							icon={route.icon}
							active={route.active}
							onClick={route.onClick}
						/>
					))}
				</ul>
			</nav>
			<nav className="mt-4 flex flex-col items-center justify-between ">
				<UserButton
					classNames={{
						trigger: {
							base: "cursor-pointer transition hover:opacity-75  size-12 flex items-center justify-center",
							avatar: {
								base: "size-10",
							},
						},
					}}
				/>
			</nav>
		</div>
	);
};
