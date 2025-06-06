"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
	label: string;
	icon: React.ElementType;
	href: string;
	onClick?: () => void;
	active?: boolean;
}
export const DesktopItem = ({
	label,
	icon: Icon,
	href,
	onClick,
	active,
}: Props) => {
	const handleClick = () => {
		if (onClick) {
			return onClick();
		}
	};
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<li onClick={handleClick}>
			<Link
				href={href}
				className={cn(
					"group flex gap-x-3 rounded-md p-3 font-semibold text-gray-500 text-sm leading-6 transition-all hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white",
					active && "bg-gray-100 text-black dark:bg-gray-800 dark:text-white",
				)}
			>
				<Icon className="h-6 w-6 shrink-0" />
				<span className="sr-only">{label}</span>
			</Link>
		</li>
	);
};
