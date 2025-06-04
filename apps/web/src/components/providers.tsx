"use client";

import { ORPCContext, orpc, queryClient } from "@/utils/orpc";
import { AuthUIProvider as _AuthUIProvider } from "@daveyplate/better-auth-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

import { authClient } from "@/lib/auth-client";
import { PathRoute } from "@/lib/constants/route";

function AuthUIProvider({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<_AuthUIProvider
			authClient={authClient}
			navigate={router.push}
			replace={router.replace}
			providers={["github", "google"]}
			onSessionChange={() => {
				// Clear router cache (protected routes)
				router.refresh();
			}}
			redirectTo={PathRoute.USERS}
			Link={Link}
		>
			{children}
		</_AuthUIProvider>
	);
}
export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<AuthUIProvider>
				<QueryClientProvider client={queryClient}>
					<ORPCContext.Provider value={orpc}>{children}</ORPCContext.Provider>
					<ReactQueryDevtools />
				</QueryClientProvider>
				<Toaster richColors />
			</AuthUIProvider>
		</ThemeProvider>
	);
}
