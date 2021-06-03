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
	/* istanbul ignore next */
	/**
	 * @returns The built-in `console`.
	 * Do **not** use this implementation in language servers, as some clients cannot handle
	 * non-LSP stdout. (https://github.com/SPYGlassMC/SPYGlass/issues/845)
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
	log(): void { }
	info(): void { }
	warn(): void { }
	error(): void { }
}
