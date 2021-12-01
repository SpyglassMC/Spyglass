import * as core from '@spyglassmc/core'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import * as ls from 'vscode-languageserver/node'
import { InsertTextFormat } from 'vscode-languageserver/node'

/**
 * A series of functions that can transform `@spyglassmc/core` types to `vscode-languageserver` types.
 * 
 * Functions are named after types in `vscode-languageserver`.
 */
export namespace toLS {
	const ZeroPosition: ls.Position = { line: 0, character: 0 }
	const ZeroRange: ls.Range = { start: ZeroPosition, end: ZeroPosition }

	export function color(color: core.Color): ls.Color {
		return ls.Color.create(...color)
	}

	export function colorInformation(info: core.ColorInfo, doc: TextDocument): ls.ColorInformation {
		return ls.ColorInformation.create(range(info.range, doc), color(info.color!))
	}

	export function colorInformationArray(info: core.ColorInfo[], doc: TextDocument): ls.ColorInformation[] {
		return info.map(i => colorInformation(i, doc))
	}

	export function colorPresentation(presentation: core.ColorPresentation, doc: TextDocument): ls.ColorPresentation {
		const edit = ls.TextEdit.replace(range(presentation.range, doc), presentation.text)
		return ls.ColorPresentation.create(presentation.label, edit)
	}

	export function colorPresentationArray(presentation: core.ColorPresentation[], doc: TextDocument): ls.ColorPresentation[] {
		return presentation.map(p => colorPresentation(p, doc))
	}

	export function diagnostic(error: core.LanguageError, doc: TextDocument): ls.Diagnostic {
		const ans = ls.Diagnostic.create(range(error.range, doc), error.message, diagnosticSeverity(error.severity), undefined, 'spyglassmc')
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

	export function documentHighlight(locations: core.SymbolLocations | undefined): ls.DocumentHighlight[] | undefined {
		return locations?.locations
			?.filter(loc => loc.posRange)
			?.map(loc => ({ range: loc.posRange! }))
	}

	export function documentSelector(meta: core.MetaRegistry): ls.DocumentSelector {
		const ans: ls.DocumentSelector = meta.getLanguages().map(id => ({ language: id }))
		return ans
	}

	export function documentSymbol(symbol: core.Symbol, symLoc: core.SymbolLocation, doc: TextDocument, hierarchicalSupport: boolean | undefined, supportedKinds: ls.SymbolKind[] = []): ls.DocumentSymbol {
		return {
			name: symbol.identifier,
			kind: symbolKind(symbol.category, symbol.subcategory, supportedKinds),
			range: symLoc.fullPosRange ?? symLoc.posRange ?? ZeroRange,
			selectionRange: symLoc.posRange ?? ZeroRange,
			children: hierarchicalSupport ? documentSymbols(symbol.members, doc, hierarchicalSupport, supportedKinds) : undefined,
		}
	}

	export function documentSymbols(map: core.SymbolMap = {}, doc: TextDocument, hierarchicalSupport: boolean | undefined, supportedKinds: ls.SymbolKind[] = []): ls.DocumentSymbol[] {
		return Object.values(map)
			.map(s => [s, [...s.declaration ?? [], ...s.definition ?? [], ...s.implementation ?? [], ...s.typeDefinition ?? []].find(l => l.uri === doc.uri)] as const)
			.filter(([_s, l]) => !!l)
			.map(([s, l]) => documentSymbol(s, l!, doc, hierarchicalSupport, supportedKinds))
	}

	export function documentSymbolsFromTable(table: core.SymbolTable, doc: TextDocument, hierarchicalSupport: boolean | undefined, supportedKinds: ls.SymbolKind[] = []): ls.DocumentSymbol[] {
		return Object.values(table)
			.map(m => documentSymbols(m, doc, hierarchicalSupport, supportedKinds))
			.flat()
	}

	export function documentSymbolsFromTables(tables: core.SymbolTable[], doc: TextDocument, hierarchicalSupport: boolean | undefined, supportedKinds: ls.SymbolKind[] = []): ls.DocumentSymbol[] {
		return tables
			.map(t => documentSymbolsFromTable(t, doc, hierarchicalSupport, supportedKinds))
			.flat()
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

	export function completionItem(completion: core.CompletionItem, doc: TextDocument, requestedOffset: number, insertReplaceSupport: boolean | undefined): ls.CompletionItem {
		const insertText = completion.insertText ?? completion.label
		const canInsertReplace = insertReplaceSupport && ![core.CR, core.LF, core.CRLF].includes(insertText)
		const textEdit: ls.TextEdit | ls.InsertReplaceEdit = canInsertReplace
			? ls.InsertReplaceEdit.create(
				insertText,
				/* insert  */ range(core.Range.create(completion.range.start, requestedOffset), doc),
				/* replace */ range(completion.range, doc)
			)
			: ls.TextEdit.replace(range(completion.range, doc), insertText)
		const ans: ls.CompletionItem = {
			label: completion.label,
			kind: completion.kind,
			detail: completion.detail,
			documentation: completion.documentation,
			filterText: completion.filterText,
			sortText: completion.sortText,
			textEdit,
			insertTextFormat: InsertTextFormat.Snippet,
			insertTextMode: ls.InsertTextMode.adjustIndentation,
			...completion.deprecated ? { tags: [ls.CompletionItemTag.Deprecated] } : {},
		}
		return ans
	}

	export function location(location: { uri: string, posRange: core.PositionRange }): ls.Location {
		return {
			uri: location.uri,
			range: location.posRange,
		}
	}

	export function locationLink(locations: core.SymbolLocations | undefined, doc: TextDocument, linkSupport: false): ls.Location[] | undefined
	export function locationLink(locations: core.SymbolLocations | undefined, doc: TextDocument, linkSupport: boolean | undefined): ls.LocationLink[] | ls.Location[] | undefined
	export function locationLink(locations: core.SymbolLocations | undefined, doc: TextDocument, linkSupport: boolean | undefined): ls.LocationLink[] | ls.Location[] | undefined {
		return locations?.locations
			? linkSupport
				? locations.locations.map(loc => ({
					originSelectionRange: range(locations.range, doc),
					targetUri: loc.uri,
					targetRange: loc.fullPosRange ?? loc.posRange ?? ZeroRange,
					targetSelectionRange: loc.posRange ?? ZeroRange,
				}))
				: (locations.locations).map(loc => location({ uri: loc.uri, posRange: loc.posRange ?? ZeroRange }))
			: undefined
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

	export function symbolInformation(symbol: core.Symbol, symLoc: core.SymbolLocation, supportedKinds: ls.SymbolKind[] = []): ls.SymbolInformation {
		return {
			name: symbol.identifier,
			kind: symbolKind(symbol.category, symbol.subcategory, supportedKinds),
			location: location({ uri: symLoc.uri, posRange: symLoc.fullPosRange ?? symLoc.posRange ?? ZeroRange }),
		}
	}

	export function symbolInformationArray(map: core.SymbolMap = {}, query: string, supportedKinds: ls.SymbolKind[] = []): ls.SymbolInformation[] {
		return Object.values(map)
			.filter(s => s.identifier.includes(query))
			.map(s => [s, [...s.declaration ?? [], ...s.definition ?? [], ...s.implementation ?? [], ...s.typeDefinition ?? []][0]] as const)
			.filter(([_s, l]) => !!l)
			.map(([s, l]) => symbolInformation(s, l, supportedKinds))
	}

	export function symbolInformationArrayFromTable(table: core.SymbolTable, query: string, supportedKinds: ls.SymbolKind[] = []): ls.SymbolInformation[] {
		return Object.values(table)
			.map(m => symbolInformationArray(m, query, supportedKinds))
			.flat()
	}

	export function symbolKind(category: string, subcategory = '', supportedKinds: ls.SymbolKind[] = []): ls.SymbolKind {
		const UltimateFallback = ls.SymbolKind.Variable
		const getKind = (kind: ls.SymbolKind, fallback: ls.SymbolKind) => supportedKinds?.includes(kind) ? kind : fallback

		if (core.ResourceLocationCategory.is(category)) {
			return ls.SymbolKind.Function
		}
		if (category === 'nbtdoc') {
			const map = new Map([
				['enum', ls.SymbolKind.Enum],
				['enum_key', getKind(ls.SymbolKind.EnumMember, ls.SymbolKind.Field)],
				['compound', getKind(ls.SymbolKind.Struct, ls.SymbolKind.Interface)],
				['compound_key', ls.SymbolKind.Field],
				['module', ls.SymbolKind.Module],
			])
			return map.get(subcategory) ?? UltimateFallback
		}
		const map = new Map([
			['attribute_modifier_uuid', ls.SymbolKind.Number],
			['nbtdoc/description', ls.SymbolKind.Constructor],
			['objective', ls.SymbolKind.Variable],
			['score_holder', ls.SymbolKind.Class],
			['tag', ls.SymbolKind.String],
			['team', ls.SymbolKind.Array],
		])
		return map.get(category) ?? UltimateFallback
	}

	export function textEdit(range: core.Range, text: string, doc: TextDocument) {
		return ls.TextEdit.replace(toLS.range(range, doc), text)
	}
}
