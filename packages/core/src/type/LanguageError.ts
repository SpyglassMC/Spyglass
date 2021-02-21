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
	 * 
	 * Should be treated as the same severity as `Error` if not being used by a dispatcher parser.
	 */
	Fatal,
}
