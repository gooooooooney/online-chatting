import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/types";
import { client } from "@/utils/client";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { LuUserPlus } from "react-icons/lu";
import { z } from "zod";

interface GroupChatModalProps {
	users: User[];
}

export default function GroupChatModal({ users }: GroupChatModalProps) {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		defaultValues: {
			name: "",
			members: [] as { label: string; value: string }[],
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(1),
				members: z
					.array(z.object({ label: z.string(), value: z.string() }))
					.min(1),
			}),
		},
		onSubmit: async (values) => {
			await client.conversation.getConversations({
				...values,
				isGroup: true,
			});
			setIsOpen(false);
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className="rounded-full cursor-pointer"
					size="icon"
				>
					<LuUserPlus size={20} />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new group chat</DialogTitle>
					<DialogDescription>
						Create a chat with more than 2 people.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field
						validators={{
							onBlur: ({ value }) => {
								if (value.length === 0) {
									return "Name is required";
								} else {
									return true;
								}
							},
						}}
						name="name"
					>
						{(field) => (
							<div className="flex flex-col gap-2">
								<Label htmlFor={field.name}>Name</Label>
								<Input
									className="w-full"
									placeholder="Group name"
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
							</div>
						)}
					</form.Field>
					<form.Field name="members">
						{(field) => (
							<div className="flex flex-col gap-2">
								<Label htmlFor={field.name}>Members</Label>
								<MultiSelect
									options={users.map((user) => ({
										label: user.name,
										value: user.id,
									}))}
									onValueChange={(value) => {
										field.handleChange(
											users
												.filter((user) => value.includes(user.id))
												.map((user) => ({
													label: user.name,
													value: user.id,
												})),
										);
									}}
									placeholder="Select members"
									variant="inverted"
									animation={2}
									maxCount={50}
								/>
							</div>
						)}
					</form.Field>
					<form.Subscribe>
						{({ isSubmitting, canSubmit }) => (
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit" disabled={!canSubmit || isSubmitting}>
									Create
								</Button>
							</DialogFooter>
						)}
					</form.Subscribe>
				</form>
			</DialogContent>
		</Dialog>
	);
}
