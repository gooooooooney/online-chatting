import { os } from "@orpc/server";

interface ResponseFormat<T = unknown> {
	code: number;
	msg: string;
	data: T;
}

export class BusinessError extends Error {
	constructor(
		public code: number,
		message: string,
		public data: unknown = null,
	) {
		super(message);
		this.name = "BusinessError";
	}
}

export const responseMiddleware = os.middleware(async ({ next }) => {
	try {
		const result = await next();
		const response: ResponseFormat = {
			code: 200,
			msg: "success",
			data: result.output,
		};
		return { output: response, context: result.context };
	} catch (error) {
		if (error instanceof BusinessError) {
			const response: ResponseFormat = {
				code: error.code,
				msg: error.message,
				data: error.data,
			};
			return { output: response, context: {} };
		}

		const response: ResponseFormat = {
			code: 500,
			msg: error instanceof Error ? error.message : "Internal server error",
			data: null,
		};
		// Return empty context when error occurs
		return { output: response, context: {} };
	}
});
