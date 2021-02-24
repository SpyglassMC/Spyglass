/* istanbul ignore file */

export interface Logger {
	/**
	 * Log a message.
	 */
	log(message: string): void

	/**
	 * Log an information.
	 */
	info(message: string): void

	/**
	 * Output a warning message.
	 */
	warn(message: string): void

	/**
	 * Output an error message.
	 */
	error(message: string): void
}

export namespace Logger {
	let instance: Logger | undefined

	/**
	 * @returns A `Logger` implementation based on the built-in `console` instance.
	 * Do **not** use this implementation in language servers, as some clients cannot handle
	 * non-LSP stdout. (https://github.com/SPYGlassMC/SPYGlass/issues/845)
	 */
	export function create(): Logger {
		return instance ?? (instance = new LogServiceImpl())
	}
}

class LogServiceImpl implements Logger {
	log(message: string): void {
		console.log(message)
	}
	info(message: string): void {
		console.info(message)
	}
	warn(message: string): void {
		console.warn(message)
	}
	error(message: string): void {
		console.error(message)
	}
}
