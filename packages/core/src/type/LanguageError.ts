import { Range } from './Range'

export interface LanguageError {
	message: string,
	range: Range,
	severity: ErrorSeverity,
}

export namespace LanguageError {
	export function create(message: string, range: Range, severity = ErrorSeverity.Error): LanguageError {
		return { range, message, severity }
	}
}

export const enum ErrorSeverity {
	Hint,
	Information,
	Warning,
	Error,
	/**
	 * Doesn't even satisfy the fundamental requirement for this AST node. Usually used by
	 * dispatcher parsers to try the next parser.
	 */
	Fatal,
}

/* istanbul ignore next */
/**
 * @template E The type of error.
 */
export class ErrorReporter<E = LanguageError> {
	private errors: E[] = []

	constructor(
		private readonly creator: (this: void, message: string, range: Range, severity: ErrorSeverity) => E
	) { }

	/**
	 * Reports a new error.
	 */
	report(message: string, range: Range, severity = ErrorSeverity.Error): void {
		this.errors.push(this.creator(message, range, severity))
	}

	/**
	 * Returns all reported errors of type `E`, and then clears them.
	 */
	dump(): readonly E[] {
		const ans = Object.freeze(this.errors)
		this.errors = []
		return ans
	}
}
