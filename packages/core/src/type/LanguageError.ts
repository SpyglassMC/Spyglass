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
}
