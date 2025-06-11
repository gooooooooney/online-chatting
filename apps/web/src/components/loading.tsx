import { LuLoaderCircle } from "react-icons/lu";

export const Loading = () => {
	return (
		<div className="fixed  inset-0 z-50 flex items-center justify-center bg-background/50">
			<LuLoaderCircle className="size-10 animate-spin" />
		</div>
	);
};
