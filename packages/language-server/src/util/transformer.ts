import * as core from '@spyglassmc/core'
import { TextDocument } from 'vscode-languageserver-textdocument'
import * as ls from 'vscode-languageserver/node'

/**
 * A series of functions that can transform `@spyglassmc/core` types to `vscode-languageserver` types.
 * 
 * Functions are named after types in `vscode-languageserver`.
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

	export function diagnostic(error: core.LanguageError, doc: TextDocument): ls.Diagnostic {
		return ls.Diagnostic.create(range(error.range, doc), error.message, errorSeverity(error.severity))
	}

	export function diagnostics(errors: readonly core.LanguageError[], doc: TextDocument): ls.Diagnostic[] {
		return errors.map(e => diagnostic(e, doc))
	}

	export function semanticTokensLegend(): ls.SemanticTokensLegend {
		const ans: ls.SemanticTokensLegend = {
			tokenTypes: core.ColorTokenTypes as unknown as string[],
			tokenModifiers: core.ColorTokenModifiers as unknown as string[],
		}
		return ans
	}

	export function semanticTokenType(type: core.ColorTokenType): number {
		return core.ColorTokenTypes.indexOf(type)
	}

	export function semanticTokenModifier(modifier: core.ColorTokenModifier): number {
		return core.ColorTokenModifiers.indexOf(modifier)
	}

	export function semanticTokenModifiers(modifiers: readonly core.ColorTokenModifier[] = []): number {
		let ans = 0
		for (const modifier of modifiers) {
			ans += 1 << semanticTokenModifier(modifier)
		}
		return ans
	}

	export function semanticTokens(tokens: readonly core.ColorToken[], doc: TextDocument): ls.SemanticTokens {
		const builder = new ls.SemanticTokensBuilder()
		for (const token of tokens) {
			const pos = doc.positionAt(token.range.start)
			const length = token.range.end - token.range.start
			builder.push(
				pos.line, pos.character, length, 
				semanticTokenType(token.type),
				semanticTokenModifiers(token.modifiers)
			)
		}
		return builder.build()
	}
}
