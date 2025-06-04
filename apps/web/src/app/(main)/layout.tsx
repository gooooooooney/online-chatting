import Header from "@/components/header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="grid h-svh">{children}</div>;
}
