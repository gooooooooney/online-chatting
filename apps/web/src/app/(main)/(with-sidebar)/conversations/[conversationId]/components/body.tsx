"use client";

import { useConversation } from "@/hooks/use-conversation";
import { ablyClient } from "@/lib/pusher";
import type { FullMessageType } from "@/types";
import { client } from "@/utils/client";
import type * as Ably from "ably";
import { find } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageBox } from "./message-box";

interface BodyProps {
	initialMessages: FullMessageType[];
}
export const Body = ({ initialMessages = [] }: BodyProps) => {
	const [messages, setMessages] = useState(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);
	const { conversationId } = useConversation();

	const messagesHandler = (message: Ably.Message) => {
		const messageData = message.data as FullMessageType;
		setMessages((current) => {
			if (find(current, { id: messageData.id })) {
				return current;
			}
			return [...current, messageData];
		});
	};

	const updateMessageHandler = (message: Ably.Message) => {
		const newMessage = message.data as FullMessageType;
		setMessages((current) => {
			return current.map((currentMessage) => {
				if (currentMessage.id === newMessage.id) {
					return newMessage;
				}
				return currentMessage;
			});
		});
	};

	useEffect(() => {
		setMessages(initialMessages);
	}, [initialMessages]);

	useEffect(() => {
		const channel = ablyClient.channels.get(conversationId);
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });

		channel.subscribe("message:new", messagesHandler);
		channel.subscribe("message:update", updateMessageHandler);
		return () => {
			channel.unsubscribe("message:new", messagesHandler);
			channel.unsubscribe("message:update", updateMessageHandler);
		};
	}, [conversationId]);

	useEffect(() => {
		if (conversationId) {
			client.conversation.seen({
				conversationId,
			});
		}
	}, [conversationId]);

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((message, index) => (
				<MessageBox
					isLast={index === messages.length - 1}
					isSameSender={messages[index + 1]?.senderId === message.senderId}
					key={message.id}
					data={message}
				/>
			))}
			<div ref={bottomRef} className="pt-24" />
		</div>
	);
};
