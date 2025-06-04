export enum RESPONSE_ENUM {
	SUCCESS = 200,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
}

export class ApiResponse<T> {
	constructor(
		public code: RESPONSE_ENUM,
		public msg: string,
		public data: T,
	) {}

	static success<T>(data: T) {
		return new ApiResponse(RESPONSE_ENUM.SUCCESS, "success", data);
	}

	static error(code: RESPONSE_ENUM, msg: string, data: any = null) {
		return new ApiResponse(code, msg, data);
	}
}
