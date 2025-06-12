import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import { ActiveStatus } from "@/components/active-status";
import Header from "@/components/header";
import Providers from "@/components/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "oral-app",
	description: "oral-app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-svh antialiased`}
			>
				<Providers>
					<ActiveStatus />
					{children}
				</Providers>
			</body>
		</html>
	);
}
