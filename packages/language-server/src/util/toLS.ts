import * as core from '@spyglassmc/core'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import * as ls from 'vscode-languageserver/node'

/**
 * A series of functions that can transform `@spyglassmc/core` types to `vscode-languageserver` types.
 * 
 * Functions are named after types in `vscode-languageserver`.
 */
export namespace toLS {
	export function diagnostic(error: core.LanguageError, doc: TextDocument): ls.Diagnostic {
		const ans = ls.Diagnostic.create(range(error.range, doc), error.message, diagnosticSeverity(error.severity))
		if (error.info?.deprecated) {
			(ans.tags ??= [])?.push(ls.DiagnosticTag.Deprecated)
		}
		if (error.info?.unnecessary) {
			(ans.tags ??= [])?.push(ls.DiagnosticTag.Unnecessary)
		}
		if (error.info?.codeAction) {
			ans.data = {
				codeAction: error.info?.codeAction,
			}
		}
		if (error.info?.related) {
			ans.relatedInformation = error.info?.related.map(v => ({
				location: location(v.location),
				message: v.message,
			}))
		}
		return ans
	}

	export function diagnostics(errors: readonly core.LanguageError[], doc: TextDocument): ls.Diagnostic[] {
		return errors.map(e => diagnostic(e, doc))
	}

	export function diagnosticSeverity(severity: core.ErrorSeverity): ls.DiagnosticSeverity {
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

	export function documentHighlight(locations: core.SymbolLocations | null): ls.DocumentHighlight[] | null {
		return locations?.locations
			? locations.locations.map(loc => ({
				range: loc.posRange,
			}))
			: null
	}

	export function documentSelector(): ls.DocumentSelector {
		const ans: ls.DocumentSelector = core.MetaRegistry.instance.languages.map(id => ({ language: id }))
		return ans
	}

	export function hover(hover: core.Hover, doc: TextDocument): ls.Hover {
		const ans: ls.Hover = {
			contents: {
				kind: ls.MarkupKind.Markdown,
				value: hover.markdown,
			},
			range: range(hover.range, doc),
		}
		return ans
	}

	export function location(location: core.Location): ls.Location {
		return {
			uri: location.uri,
			range: location.posRange,
		}
	}

	export function locationLink(locations: core.SymbolLocations | null, doc: TextDocument, linkSupport: false): ls.Location[] | null
	export function locationLink(locations: core.SymbolLocations | null, doc: TextDocument, linkSupport: boolean | undefined): ls.LocationLink[] | ls.Location[] | null
	export function locationLink(locations: core.SymbolLocations | null, doc: TextDocument, linkSupport: boolean | undefined): ls.LocationLink[] | ls.Location[] | null {
		return locations?.locations
			? linkSupport
				? locations.locations.map(loc => ({
					originSelectionRange: range(locations.range, doc),
					targetUri: loc.uri,
					targetRange: loc.fullPosRange ?? loc.posRange,
					targetSelectionRange: loc.posRange,
				}))
				: locations.locations.map(location)
			: null
	}

	export function position(offset: number, doc: TextDocument): ls.Position {
		return doc.positionAt(offset)
	}

	export function range(range: core.Range, doc: TextDocument): ls.Range {
		return ls.Range.create(position(range.start, doc), position(range.end, doc))
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
			const pos = position(token.range.start, doc)
			const length = token.range.end - token.range.start
			builder.push(
				pos.line, pos.character, length,
				semanticTokenType(token.type),
				semanticTokenModifiers(token.modifiers)
			)
		}
		return builder.build()
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
}
