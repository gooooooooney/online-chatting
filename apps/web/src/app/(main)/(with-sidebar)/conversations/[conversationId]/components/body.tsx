"use client";

import { useConversation } from "@/hooks/use-conversation";
import { pusherClient } from "@/lib/pusher";
import type { FullMessageType } from "@/types";
import { client } from "@/utils/client";
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

	const messagesHandler = (message: FullMessageType) => {
		setMessages((current) => {
			if (find(current, { id: message.id })) {
				return current;
			}
			return [...current, message];
		});
	};

	const updateMessageHandler = (newMessage: FullMessageType) => {
		console.log(newMessage);
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
		pusherClient.subscribe(conversationId);
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });

		pusherClient.bind("message:new", messagesHandler);
		pusherClient.bind("message:update", updateMessageHandler);
		return () => {
			pusherClient.unsubscribe(conversationId);
			pusherClient.unbind("message:new", messagesHandler);
			pusherClient.unbind("message:update", updateMessageHandler);
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
