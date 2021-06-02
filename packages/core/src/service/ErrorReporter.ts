import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { LanguageErrorInfo, RangeLike } from '../source'
import { ErrorSeverity, IndexMap, LanguageError, Location, Range } from '../source'

export class ErrorReporter {
	public errors: LanguageError[] = []

	constructor() { }

	/**
	 * Reports a new error.
	 */
	report(message: string, range: RangeLike, severity = ErrorSeverity.Error, info?: LanguageErrorInfo): void {
		this.errors.push(LanguageError.create(message, Range.get(range), severity, info))
	}

	/**
	 * @returns All reported errors, and then clears the error stack.
	 */
	dump(): readonly LanguageError[] {
		const ans = Object.freeze(this.errors)
		this.errors = []
		return ans
	}

	/**
	 * Adds all errors from another reporter's error stack to the current reporter.
	 * This method does not affect the passed-in reporter.
	 */
	absorb(reporter: ErrorReporter, mapping?: { map: IndexMap, doc: TextDocument }): void {
		const incomingErrors = mapping ? reporter.errors.map(e => {
			e.range = IndexMap.toOuterRange(mapping.map, e.range)
			if (e.info?.related) {
				e.info.related = e.info.related.map(v => ({
					location: ErrorReporter.toOuterLocation(mapping.map, v.location, mapping.doc),
					message: v.message,
				}))
			}
			return e
		}) : reporter.errors
		this.errors.push(...incomingErrors)
	}

	private static toOuterLocation(map: IndexMap, inner: Location, doc: TextDocument): Location {
		return Location.create(
			doc,
			IndexMap.toOuterRange(map, inner.range)
		)
	}
}
