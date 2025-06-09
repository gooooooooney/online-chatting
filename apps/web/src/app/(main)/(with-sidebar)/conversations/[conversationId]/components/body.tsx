"use client";

import { useConversation } from "@/app/hooks/use-conversation";
import type { FullMessageType } from "@/types";
import { client } from "@/utils/client";
import { useEffect, useRef, useState } from "react";
import { MessageBox } from "./message-box";

interface BodyProps {
	initialMessages: FullMessageType[];
}
export const Body = ({ initialMessages = [] }: BodyProps) => {
	const [messages, setMessages] = useState(initialMessages);
	const bottomRef = useRef<HTMLDivElement>(null);
	const { conversationId } = useConversation();

	useEffect(() => {
		setMessages(initialMessages);
	}, [initialMessages]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

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
