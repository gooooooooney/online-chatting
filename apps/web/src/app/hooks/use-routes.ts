import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { useConversation } from "./use-conversation";

export const useRoutes = () => {
	const pathname = usePathname();

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
				label: "Logout",
				href: "#",
				icon: HiArrowLeftOnRectangle,
				onClick: () => {
					authClient.signOut();
				},
			},
		],
		[pathname, conversationId],
	);

	return routes;
};
