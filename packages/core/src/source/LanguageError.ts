import type { Location } from './Location'
import type { Range } from './Range'

export interface LanguageError {
	message: string,
	range: Range,
	severity: ErrorSeverity,
	info?: LanguageErrorInfo,
}

export namespace LanguageError {
	export function create(message: string, range: Range, severity = ErrorSeverity.Error, info?: LanguageErrorInfo): LanguageError {
		const ans: LanguageError = { range, message, severity }
		if (info) {
			ans.info = info
		}
		return ans
	}
}

export const enum ErrorSeverity {
	Hint,
	Information,
	Warning,
	Error,
}

export interface LanguageErrorInfo {
	codeAction?: string,
	deprecated?: boolean,
	unnecessary?: boolean,
	related?: {
		location: Location,
		message: string,
	}[]
}
