/* istanbul ignore file */

export interface Logger {
	/**
	 * Log a message.
	 */
	log(message: any): void

	/**
	 * Output a warning message.
	 */
	warn(message: any): void

	/**
	 * Output an error message.
	 */
	error(message: any): void
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
	log(message: any): void {
		console.log(message)
	}
	warn(message: any): void {
		console.warn(message)
	}
	error(message: any): void {
		console.error(message)
	}
}
