"use client";

import { useConversation } from "@/app/hooks/use-conversation";
import { useRoutes } from "@/app/hooks/use-routes";
import { MobileItem } from "./mobile-item";

export const MobileFooter = () => {
	const routes = useRoutes();
	const { isOpen } = useConversation();

	if (isOpen) {
		return null;
	}

	return (
		<div className="fixed bottom-0 z-40 flex w-full items-center justify-between border-t-[1px] bg-white lg:hidden ">
			{routes.map((route) => (
				<MobileItem
					key={route.href}
					href={route.href}
					label={route.label}
					icon={route.icon}
					active={route.active}
					onClick={route.onClick}
				/>
			))}
		</div>
	);
};
