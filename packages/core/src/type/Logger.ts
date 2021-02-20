/* istanbul ignore file */

export interface Logger {
	/**
	 * Log a message.
	 */
	log(message: string): void

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
	 * @returns A `LogService` implementation that provides access to the real file system
	 * based on the build-in node.js `console`.
	 */
	export function create(): Logger {
		return instance ?? (instance = new LogServiceImpl())
	}
}

class LogServiceImpl implements Logger {
	log(message: string): void {
		console.log(message)
	}
	warn(message: string): void {
		console.warn(message)
	}
	error(message: string): void {
		console.error(message)
	}
}
