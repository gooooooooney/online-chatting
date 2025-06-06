"use client";

import { cn } from "@/lib/utils";
import { AuthCard } from "@daveyplate/better-auth-ui";

export function AuthView({ pathname }: { pathname: string }) {
	return (
		<main className="flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
			<AuthCard
				// classNames={{
				//   separator: "!w-auto",
				// }}
				// className={cn({
				//   "md:min-w-md": !pathname.endsWith("settings")
				// })}
				redirectTo="/users"
				pathname={pathname}
			/>
		</main>
	);
}
