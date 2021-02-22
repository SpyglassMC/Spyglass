import { ErrorSeverity, LanguageError } from '../type/LanguageError'
import { Range } from '../type/Range'

/**
 * @template E The type of error.
 */
export class ErrorReporter<E = LanguageError> {
	public errors: E[] = []

	constructor(
		private readonly creator: (this: void, message: string, range: Range, severity: ErrorSeverity) => E = LanguageError.create as any
	) { }

	/**
	 * Reports a new error.
	 */
	report(message: string, range: Range, severity = ErrorSeverity.Error): void {
		this.errors.push(this.creator(message, range, severity))
	}

	/**
	 * @returns All reported errors of type `E`, and then clears the error stack.
	 */
	dump(): readonly E[] {
		const ans = Object.freeze(this.errors)
		this.errors = []
		return ans
	}

	/**
	 * @returns A new `ErrorReporter` instance with the same `creator` as this one with an empty error stack.
	 */
	derive(): ErrorReporter<E> {
		return new ErrorReporter(this.creator)
	}

	/**
	 * Adds all errors from another reporter's error stack to the current reporter.
	 * This method does not affect the passed-in reporter.
	 */
	absorb(reporter: ErrorReporter<E>): void {
		this.errors.push(...reporter.errors)
	}
}
