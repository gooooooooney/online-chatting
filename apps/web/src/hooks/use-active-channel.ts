import { ablyClient } from "@/lib/pusher";
import type * as Ably from "ably";
import { useEffect, useRef } from "react";
import { useActiveListStore } from "./use-active-list";

export const useActiveChannel = () => {
	const { set, add, remove } = useActiveListStore();
	const channelRef = useRef<Ably.RealtimeChannel | null>(null);

	useEffect(() => {
		const channel = ablyClient.channels.get("presence-messager");
		channelRef.current = channel;

		const setupPresence = async () => {
			try {
				// Enter presence to indicate user is online
				await channel.presence.enter();

				// Listen for presence updates
				channel.presence.subscribe("enter", (member: Ably.PresenceMessage) => {
					add(member.clientId || "");
				});

				channel.presence.subscribe("leave", (member: Ably.PresenceMessage) => {
					remove(member.clientId || "");
				});

				// Get initial presence set
				const presenceSet = await channel.presence.get();
				if (presenceSet) {
					const initialMembers = presenceSet.map(
						(member: Ably.PresenceMessage) => member.clientId || "",
					);
					set(initialMembers);
				}
			} catch (error) {
				console.error("Error setting up presence:", error);
			}
		};

		setupPresence();

		return () => {
			if (channelRef.current) {
				channelRef.current.presence.leave();
				channelRef.current.presence.unsubscribe();
				channelRef.current = null;
			}
		};
	}, [set, add, remove]);
};
