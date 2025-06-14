"use client";

import { authClient } from "@/lib/auth-client";
import { PathRoute } from "@/lib/constants/route";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { HiChat, HiCog } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { useConversation } from "./use-conversation";

export const useRoutes = () => {
	const pathname = usePathname();
	const router = useRouter();

	const { conversationId } = useConversation();

	const routes = useMemo(
		() => [
			{
				label: "Chat",
				href: "/conversations",
				icon: HiChat,
				active: pathname === "/conversations" || !!conversationId,
			},
			{
				label: "Users",
				href: "/users",
				icon: HiUsers,
				active: pathname === "/users",
			},
			{
				label: "Settings",
				href: "/settings",
				icon: HiCog,
				active: pathname === "/settings",
			},
			{
				label: "Logout",
				href: "#",
				icon: HiArrowLeftOnRectangle,
				onClick: () => {
					authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								router.push(PathRoute.AUTH_SIGN_IN);
							},
						},
					});
				},
			},
		],
		[pathname, conversationId],
	);

	return routes;
};
