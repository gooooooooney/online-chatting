"use client";
import { useRoutes } from "@/app/hooks/use-routes";
import type { User } from "@/types";
import { useState } from "react";
import { Avatar } from "../avatar";
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

	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<div className="hidden justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r-[1px] lg:bg-white lg:pb-4 xl:px-6">
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
			<nav className="mt-4 flex flex-col justify-between ">
				<div
					onClick={() => {
						setIsOpen(true);
					}}
					className="cursor-pointer transition hover:opacity-75 "
				>
					<Avatar user={currentUser} />
				</div>
			</nav>
		</div>
	);
};
