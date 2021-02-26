import * as core from '@spyglassmc/core'
import { TextDocument } from 'vscode-languageserver-textdocument'
import * as ls from 'vscode-languageserver/node'

/**
 * A series of functions that can transform `@spyglassmc/core` types to `vscode-languageserver` types.
 */
export namespace transformer {
	export function range(range: core.Range, doc: TextDocument): ls.Range {
		return ls.Range.create(doc.positionAt(range.start), doc.positionAt(range.end))
	}

	export function errorSeverity(severity: core.ErrorSeverity): ls.DiagnosticSeverity {
		switch (severity) {
			case core.ErrorSeverity.Hint:
				return ls.DiagnosticSeverity.Hint
			case core.ErrorSeverity.Information:
				return ls.DiagnosticSeverity.Information
			case core.ErrorSeverity.Warning:
				return ls.DiagnosticSeverity.Warning
			case core.ErrorSeverity.Error:
				return ls.DiagnosticSeverity.Error
		}
	}

	export function error(error: core.LanguageError, doc: TextDocument): ls.Diagnostic {
		return ls.Diagnostic.create(range(error.range, doc), error.message, errorSeverity(error.severity))
	}

	export function errors(errors: readonly core.LanguageError[], doc: TextDocument): ls.Diagnostic[] {
		return errors.map(e => error(e, doc))
	}
}
