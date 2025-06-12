"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConversation } from "@/hooks/use-conversation";
import { client } from "@/utils/client";
import { useForm } from "@tanstack/react-form";
import { ImageIcon, SendIcon } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { z } from "zod";

export const Form = () => {
	const { conversationId } = useConversation();
	const form = useForm({
		defaultValues: {
			message: "",
		},
		onSubmit: (data) => {
			client.messages
				.message({
					conversationId,
					message: data.value.message,
				})
				.then(() => {
					form.resetField("message");
				});
		},
		validators: {
			onSubmit: z.object({
				message: z.string().min(1, { message: "Message is required" }),
			}),
		},
	});

	const handleUpload = (url: string) => {
		client.messages.message({
			conversationId,
			image: url,
		});
	};

	return (
		<div className="flex w-full items-center gap-2 border-t  px-4 py-4 lg:gap-4">
			<CldUploadButton
				options={{
					maxFiles: 1,
				}}
				onSuccess={({ info }) => {
					if (info && typeof info !== "string") {
						handleUpload(info.secure_url);
					}
				}}
				uploadPreset="chatting-room"
				className="cursor-pointer hover:opacity-75 transition-opacity"
			>
				<ImageIcon className="size-6 text-sky-500 hover:text-sky-600" />
			</CldUploadButton>
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
						<div className="relative flex-1 rounded-full  p-4">
							<Input
								className="w-full resize-none rounded-full dark:bg-neutral-900 bg-neutral-100 p-4 text-block focus:outline-none"
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
