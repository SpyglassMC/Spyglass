export interface Logger {
	/**
	 * Output an error message.
	 */
	error(data: any, ...args: any[]): void

	/**
	 * Log an information.
	 */
	info(data: any, ...args: any[]): void

	/**
	 * Log a message.
	 */
	log(data: any, ...args: any[]): void

	/**
	 * Output a warning message.
	 */
	warn(data: any, ...args: any[]): void
}

export namespace Logger {
	/* istanbul ignore next */
	/**
	 * @returns The built-in `console`.
	 * Do **not** use this implementation in language servers, as some clients cannot handle
	 * non-LSP stdout. (https://github.com/SpyglassMC/Spyglass/issues/845)
	 */
	export function create(): Logger {
		return console
	}

	/**
	 * @returns A logger that does nothing.
	 */
	export function noop(): Logger {
		return new NoopLogger()
	}
}

class NoopLogger implements Logger {
	error(): void {}
	info(): void {}
	log(): void {}
	warn(): void {}
}
