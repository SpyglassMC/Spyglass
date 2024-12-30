import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { Location } from './Location.js'
import { PositionRange } from './PositionRange.js'
import type { Range } from './Range.js'

export interface LanguageErrorData {
	message: string
	severity: ErrorSeverity
	info?: LanguageErrorInfo
	source?: string
}

export interface LanguageError extends LanguageErrorData {
	range: Range
}

/**
 * A language error that uses {@link PositionRange} instead of {@link Range} to represent the span of the error.
 */
export interface PosRangeLanguageError extends LanguageErrorData {
	posRange: PositionRange
}

export namespace LanguageError {
	export function create(
		message: string,
		range: Range,
		severity = ErrorSeverity.Error,
		info?: LanguageErrorInfo,
		source?: string,
	): LanguageError {
		const ans: LanguageError = { range, message, severity }
		if (info) {
			ans.info = info
		}
		if (source) {
			ans.source = source
		}
		return ans
	}
	/**
	 * @returns A {@link PosRangeLanguageError}.
	 */
	export function withPosRange(error: LanguageError, doc: TextDocument): PosRangeLanguageError {
		return {
			posRange: PositionRange.from(error.range, doc),
			message: error.message,
			severity: error.severity,
			...(error.info && { info: error.info }),
			...(error.source && { source: error.source }),
		}
	}
}

export const enum ErrorSeverity {
	Hint,
	Information,
	Warning,
	Error,
}

export interface LanguageErrorInfo {
	codeAction?: LanguageErrorAction
	deprecated?: boolean
	unnecessary?: boolean
	related?: { location: Location; message: string }[]
}

export interface LanguageErrorAction {
	title: string
	isPreferred?: boolean
	// TODO
}
