"use client";
import { useConversation } from "@/app/hooks/use-conversation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PathRoute } from "@/lib/constants/route";
import { useORPC } from "@/utils/orpc";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useMutation } from "@tanstack/react-query";
import { Trash2Icon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface ConfirmModalProps {
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const ConfirmModal = ({
	isOpen: isOpenProp,
	onOpenChange: onOpenChangeProp,
}: ConfirmModalProps) => {
	const { conversationId } = useConversation();

	const orpc = useORPC();

	const router = useRouter();

	const [isOpen, setIsOpen] = useControllableState({
		prop: isOpenProp,
		defaultProp: false,
		onChange: onOpenChangeProp,
	});

	const onClose = () => {
		setIsOpen(false);
	};

	const { mutateAsync: deleteConversation, isPending } = useMutation(
		orpc.conversation.deleteConversation.mutationOptions({
			onSuccess: () => {
				onClose();
				router.push(PathRoute.CONVERSATIONS);
				router.refresh();
			},
		}),
	);

	const onDelete = async () => {
		toast.promise(deleteConversation({ conversationId }), {
			loading: "Deleting conversation...",
			success: "Conversation deleted",
			error: "Failed to delete conversation",
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="secondary" size="icon" className="cursor-pointer">
					<Trash2Icon className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="flex flex-row gap-4 justify-center items-center">
				<div className="self-start bg-red-100 mx-auto flex items-center justify-center rounded-full flex-shrink-0 sm:size-10 size-12">
					<TriangleAlertIcon className="size-6 text-red-600" />
				</div>
				<div className="flex flex-col gap-4">
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							Delete this conversation
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							conversation and all messages.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<Button onClick={onDelete} disabled={isPending}>
							{isPending ? "Deleting..." : "Delete"}
						</Button>
					</AlertDialogFooter>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
};
