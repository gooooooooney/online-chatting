import { pusherClient } from "@/lib/pusher";
import type { Channel, Members } from "pusher-js";
import { useEffect, useState } from "react";
import { useActiveListStore } from "./use-active-list";

export const useActiveChannel = () => {
	const { set, add, remove } = useActiveListStore();
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

	useEffect(() => {
		let channel: Channel | null = activeChannel;
		if (!channel) {
			channel = pusherClient.subscribe("presence-messager");
			setActiveChannel(channel);
		}
		channel.bind("pusher:subscription_succeeded", (members: Members) => {
			let initialMembers: string[] = [];
			members.each((member: any) => {
				initialMembers.push(member.id);
			});
			set(initialMembers);
		});
		channel.bind("pusher:member_added", (member: any) => {
			add(member.id);
		});
		channel.bind("pusher:member_removed", (member: any) => {
			remove(member.id);
		});
		return () => {
			if (activeChannel) {
				pusherClient.unsubscribe("presence-messager");
				setActiveChannel(null);
			}
		};
	}, [activeChannel, set, add, remove]);
};
