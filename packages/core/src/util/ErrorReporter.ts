import { ErrorSeverity, LanguageError } from '../type/LanguageError'
import { Range } from '../type/Range'

/**
 * @template E The type of error.
 */
export class ErrorReporter<E = LanguageError> {
	private errors: E[] = []

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
	 * Returns all reported errors of type `E`, and then clears them.
	 * @throws If it is still during an attempt.
	 */
	dump(): readonly E[] {
		const ans = Object.freeze(this.errors)
		this.errors = []
		return ans
	}
}
