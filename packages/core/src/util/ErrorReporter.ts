import { ErrorSeverity, LanguageError } from '../type/LanguageError'
import { Range } from '../type/Range'

/**
 * @template E The type of error.
 */
export class ErrorReporter<E = LanguageError> {
	private errors: E[] = []
	private readonly attemptedErrorStack: LanguageError[][] = []

	private get inAttempt(): boolean {
		return !!this.attemptedErrorStack.length
	}

	constructor(
		private readonly creator: (this: void, message: string, range: Range, severity: ErrorSeverity) => E = LanguageError.create as any
	) { }

	/**
	 * Reports a new error.
	 */
	report(message: string, range: Range, severity = ErrorSeverity.Error): void {
		if (this.inAttempt) {
			this.attemptedErrorStack[this.attemptedErrorStack.length - 1].push(
				LanguageError.create(message, range, severity)
			)
		} else {
			this.errors.push(this.creator(message, range, severity))
		}
	}

	/**
	 * Returns all reported errors of type `E`, and then clears them.
	 * @throws If it is still during an attempt.
	 */
	dump(): readonly E[] {
		if (this.inAttempt) {
			throw new Error('The error reporter is still under an attempt')
		}
		const ans = Object.freeze(this.errors)
		this.errors = []
		return ans
	}

	/**
	 * Starts an attempt.
	 *
	 * Errors reported during an attempt will not be immediately stored in the usual error dump.
	 * Those errors will be moved there only if the method `endAttempt`is called _and_
	 * there are no `Fatal` errors.
	 * 
	 * `endAttempt` must be called after this method was used, or something terrible will happen.
	 * It's recommended to use a try-catch-finally block to ensure the calling of `endAttempt`.
	 * 
	 * It is completely possible to start another attempt during an attempt; you have to call
	 * `endAttempt` twice as well.
	 *
	 * @see endAttempt
	 */
	startAttempt(): void {
		this.attemptedErrorStack.push([])
	}

	/**
	 * Ends the last attempt.
	 *
	 * If there are no `ErrorSeverity.Fatal` errors reported during the last attempt, it reports all those errors again and returns true.
	 * However, if there are `Fatal` errors, it returns `false` and drops all the errors.
	 *
	 * @see startAttempt
	 * @throws If no attempt was started.
	 */
	endAttempt(): boolean {
		const attemptedErrors = this.attemptedErrorStack.pop()
		if (!attemptedErrors) {
			throw new Error('No attempt has been started yet')
		}
		if (attemptedErrors.find(e => e.severity === ErrorSeverity.Fatal)) {
			return false
		} else {
			for (const e of attemptedErrors) {
				this.report(e.message, e.range, e.severity)
			}
			return true
		}
	}
}
