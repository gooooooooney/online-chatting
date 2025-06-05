"use client";

import { useConversation } from "@/app/hooks/use-conversation";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	Form as FormUI,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/utils/client";
import { useForm } from "@tanstack/react-form";
import { ImageIcon, SendIcon } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

const formSchema = z.object({
	message: z.string().min(1, { message: "Message is required" }),
});

export const Form = () => {
	const { conversationId } = useConversation();
	const form = useForm({
		defaultValues: {
			message: "",
		},
		onSubmit: (data) => {
			client.messages.createMessage({
				conversationId,
				message: data.value.message,
			});
		},
		validators: {
			onSubmit: z.object({
				message: z.string().min(1, { message: "Message is required" }),
			}),
		},
	});

	return (
		<div className="flex w-full items-center gap-2 border-t bg-white px-4 py-4 lg:gap-4">
			<ImageIcon className="size-8 text-sky-500" />
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex w-full items-center gap-2 lg:gap-4"
			>
				<form.Field name="message">
					{(field) => (
						<div className="relative flex-1 rounded-full bg-white p-4">
							<Input
								className="w-full resize-none rounded-full bg-neutral-100 p-4 text-block focus:outline-none"
								placeholder="Write a message"
								id={field.name}
								name={field.name}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										form.handleSubmit();
									}
								}}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</div>
					)}
				</form.Field>
				<form.Subscribe>
					{({ isSubmitting, canSubmit }) => (
						<Button
							type="submit"
							className="cursor-pointer bg-sky-500 transition hover:bg-sky-600"
							disabled={!canSubmit || isSubmitting}
						>
							<SendIcon className="size-6" />
						</Button>
					)}
				</form.Subscribe>
			</form>
		</div>
	);
};
