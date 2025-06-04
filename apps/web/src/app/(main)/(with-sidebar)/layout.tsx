import { Sidebar } from "@/components/sidebar/sidebar";

export default function WithSidebarLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Sidebar>{children}</Sidebar>;
}
