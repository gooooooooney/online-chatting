"use client";

import { useActiveChannel } from "@/hooks/use-active-channel";

export const ActiveStatus = () => {
	useActiveChannel();

	return null;
};
