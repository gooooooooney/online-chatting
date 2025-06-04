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

export const MobileItem = ({
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
		<Link
			href={href}
			className={cn(
				"group flex w-full justify-center gap-x-3 p-4 font-semibold text-gray-500 text-sm leading-6 hover:bg-gray-100 hover:text-black",
				active && "bg-gray-100 text-black",
			)}
		>
			<Icon className="h-6 w-6" />
		</Link>
	);
};
