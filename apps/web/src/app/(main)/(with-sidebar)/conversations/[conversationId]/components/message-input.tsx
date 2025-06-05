"use client";

import { useConversation } from "@/app/hooks/use-conversation";

interface MessageInputProps {
	id: string;
	placeholder?: string;
	type?: "text" | "file" | "image";
	required?: boolean;
	register: UseFormRegister<FieldValues>;
	errors: FieldErrors<FieldValues>;
}

export const MessageInput = ({ field }: MessageInputProps) => {
	const { conversationId } = useConversation();

	return <div>MessageInput</div>;
};
