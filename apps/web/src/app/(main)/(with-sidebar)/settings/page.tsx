"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	// UpdateUsernameCard,
	ChangeEmailCard,
	ChangePasswordCard,
	DeleteAccountCard,
	ProvidersCard,
	SessionsCard,
	UpdateAvatarCard,
	UpdateNameCard,
} from "@daveyplate/better-auth-ui";
import {
	HiOutlineCog6Tooth,
	HiOutlineLockClosed,
	HiOutlineUser,
} from "react-icons/hi2";

export default function SettingsPage() {
	return (
		<div className="flex flex-col gap-6 max-w-6xl mx-auto py-8 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account settings and preferences.
				</p>
			</div>

			<Tabs defaultValue="account" className="w-full">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Left sidebar with tab triggers */}
					<div className="w-full lg:w-64 flex-shrink-0">
						<TabsList className="flex flex-col lg:flex-col w-full h-auto p-1 bg-muted/50 rounded-xl">
							<TabsTrigger
								value="account"
								className="w-full cursor-pointer justify-start px-4 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
							>
								<div className="flex items-center gap-3">
									<HiOutlineUser />
									Account
								</div>
							</TabsTrigger>
							<TabsTrigger
								value="security"
								className="w-full cursor-pointer justify-start px-4 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
							>
								<div className="flex items-center gap-3">
									<HiOutlineLockClosed />
									Security
								</div>
							</TabsTrigger>
							<TabsTrigger
								value="advanced"
								className="w-full cursor-pointer justify-start px-4 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
							>
								<div className="flex items-center gap-3">
									<HiOutlineCog6Tooth />
									Advanced
								</div>
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Right content area */}
					<div className="flex-1 min-w-0">
						<TabsContent value="account" className="mt-0 space-y-6">
							<div className="bg-card rounded-xl border p-6 space-y-6">
								<div>
									<h2 className="text-xl font-semibold mb-2">
										Account Information
									</h2>
									<p className="text-muted-foreground text-sm">
										Update your account details and profile information.
									</p>
								</div>
								<div className="space-y-6">
									<UpdateAvatarCard />
									<UpdateNameCard />
								</div>
							</div>
						</TabsContent>

						<TabsContent value="security" className="mt-0 space-y-6">
							<div className="bg-card rounded-xl border p-6 space-y-6">
								<div>
									<h2 className="text-xl font-semibold mb-2">
										Security Settings
									</h2>
									<p className="text-muted-foreground text-sm">
										Manage your password, email, and security preferences.
									</p>
								</div>
								<div className="space-y-6">
									<ChangePasswordCard />
									<ChangeEmailCard />
									<ProvidersCard />
									<SessionsCard />
								</div>
							</div>
						</TabsContent>

						<TabsContent value="advanced" className="mt-0 space-y-6">
							<div className="bg-card rounded-xl border p-6 space-y-6">
								<div>
									<h2 className="text-xl font-semibold mb-2">
										Advanced Settings
									</h2>
									<p className="text-muted-foreground text-sm">
										Dangerous zone - proceed with caution.
									</p>
								</div>
								<div className="space-y-6">
									<DeleteAccountCard />
								</div>
							</div>
						</TabsContent>
					</div>
				</div>
			</Tabs>
		</div>
	);
}
