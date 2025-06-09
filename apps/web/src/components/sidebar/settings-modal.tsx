"use client";

import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useForm } from "@tanstack/react-form";
import { SettingsIcon, UserIcon } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";
import z from "zod";
import { Avatar } from "../avatar";
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SettingsModalProps {
	user?: User;
	isOpen?: boolean;
	setIsOpen?: (isOpen: boolean) => void;
}
export const SettingsModal = ({
	user,
	isOpen: isOpenProp,
	setIsOpen: setIsOpenProp,
}: SettingsModalProps) => {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			name: user?.name ?? "",
			image: user?.image ?? "",
		},
		onSubmit: (data) => {
			console.log(data);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(1, { message: "Name is required" }),
				image: z.string(),
			}),
		},
	});

	const [isOpen, setIsOpen] = useControllableState({
		prop: isOpenProp,
		onChange: setIsOpenProp,
		defaultProp: false,
	});

	const handleUpload = (url: string) => {
		form.setFieldValue("image", url);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className="cursor-pointer transition hover:opacity-75 ">
				<Avatar user={user} />
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Profile</DialogTitle>
					<DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
						Update your profile information.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="w-full space-y-6 gap-2 lg:gap-4"
				>
					<form.Field name="name">
						{(field) => (
							<div className="relative flex flex-col gap-y-2 flex-1">
								<Label htmlFor={field.name}>Name</Label>
								<Input
									placeholder="Your name"
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
					<form.Field name="image">
						{(field) => (
							<div>
								<Label
									className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
									htmlFor={field.name}
								>
									Photo
								</Label>
								<div className="mt-2 flex items-center gap-x-3">
									<AvatarUI className="size-12 cursor-pointer">
										<AvatarImage
											src={field.state.value || user?.image || ""}
											alt="Avatar"
										/>
										<AvatarFallback>
											<UserIcon className="size-6" />
										</AvatarFallback>
									</AvatarUI>
								</div>
							</div>
						)}
					</form.Field>
					<form.Subscribe>
						{({ isSubmitting, canSubmit }) => (
							<Button
								type="submit"
								className="cursor-pointer"
								disabled={!canSubmit || isSubmitting}
							>
								Save
							</Button>
						)}
					</form.Subscribe>
				</form>
			</DialogContent>
		</Dialog>
	);
};
