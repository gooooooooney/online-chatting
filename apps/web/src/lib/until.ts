export type AsyncTuple<ErrorType = Error, DataType = unknown> =
	| {
			error: ErrorType;
			data: null;
	  }
	| { error: null; data: DataType };

/**
 * Gracefully handles a given Promise factory.
 * @example
 * const { error, data } = await until(() => asyncAction())
 */
export const until = async <ErrorType = Error, DataType = unknown>(
	promise: () => Promise<DataType>,
): Promise<AsyncTuple<ErrorType, DataType>> => {
	try {
		const data = await promise().catch((error) => {
			throw error;
		});
		return { error: null, data };
	} catch (error) {
		return { error: error as ErrorType, data: null };
	}
};
