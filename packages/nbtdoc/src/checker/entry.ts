import type * as core from '@spyglassmc/core'
import type { Checker, Symbol } from '@spyglassmc/core'
import { ErrorSeverity, Range, SymbolVisibility } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { Segments } from '../binder'
import { identifierToSeg, segToIdentifier } from '../binder'
import type { CompoundDefinitionNode, DescribesClauseNode, EnumDefinitionNode, IdentPathToken, InjectClauseNode, MainNode, ModuleDeclarationNode, UseClauseNode } from '../node'
import type { CheckerContext } from './CheckerContext'

export const entry: Checker<MainNode> = async (node: MainNode, ctx: core.CheckerContext): Promise<void> => {
	const modSeg = uriToSeg(ctx.doc.uri, ctx)
	if (modSeg === null) {
		ctx.err.report(localize('nbtdoc.checker.entry.null-mod-seg'), 0, ErrorSeverity.Warning)
		return
	} else if (modSeg.length === 0) {
		ctx.err.report(localize('nbtdoc.checker.entry.empty-mod-seg'), 0, ErrorSeverity.Warning)
	}
	const modIdentifier = segToIdentifier(modSeg)
	const modSymbol = ctx.symbols.lookup('nbtdoc', [modIdentifier], ctx.doc.uri)!.symbol

	const compoundDefinitions: CompoundDefinitionNode[] = []
	const describesClauses: DescribesClauseNode[] = []
	const enumDefinitions: EnumDefinitionNode[] = []
	const injectClauses: InjectClauseNode[] = []
	const moduleDeclarations: ModuleDeclarationNode[] = []
	const useClauses: UseClauseNode[] = []

	for (const childNode of node.children) {
		switch (childNode.type) {
			case 'comment':
				break
			case 'nbtdoc:compound_definition':
				compoundDefinitions.push(childNode)
				break
			case 'nbtdoc:describes_clause':
				describesClauses.push(childNode)
				break
			case 'nbtdoc:enum_definition':
				enumDefinitions.push(childNode)
				break
			case 'nbtdoc:inject_clause':
				injectClauses.push(childNode)
				break
			case 'nbtdoc:module_declaration':
				moduleDeclarations.push(childNode)
				break
			case 'nbtdoc:use_clause':
				useClauses.push(childNode)
				break
		}
	}

	const nbtdocCtx: CheckerContext = {
		...ctx,
		modIdentifier,
		modSeg,
		modSymbol,
	}

	// Hoisting declarations.
	await Promise.all([
		...compoundDefinitions.map(n => compoundDefinitionHoisting(n, nbtdocCtx)),
		...enumDefinitions.map(n => enumDefinitionHoisting(n, nbtdocCtx)),
		...moduleDeclarations.map(n => moduleDeclaration(n, nbtdocCtx)),
		...useClauses.map(n => useClause(n, nbtdocCtx)),
	])

	// Actual checking.
	await Promise.all([
		...compoundDefinitions.map(n => compoundDefinition(n, nbtdocCtx)),
		...describesClauses.map(n => describesClause(n, nbtdocCtx)),
		...enumDefinitions.map(n => enumDefinition(n, nbtdocCtx)),
		...injectClauses.map(n => injectClause(n, nbtdocCtx)),
	])
}

const compoundDefinition = async (node: CompoundDefinitionNode, ctx: CheckerContext): Promise<void> => {

}

const compoundDefinitionHoisting = async (node: CompoundDefinitionNode, ctx: CheckerContext): Promise<void> => {
	if (!node.identifier.value) {
		return
	}
	// TODO: Enter in file as well.
	const { isNewlyCreated, symbol } = ctx.symbols.createMember(ctx.doc, 'nbtdoc', [ctx.modIdentifier], {
		category: 'nbtdoc',
		identifier: node.identifier.value,
		form: 'definition',
		range: node.identifier,
		subcategory: 'compound',
		doc: node.doc.doc,
	})
	if (isNewlyCreated) {
		node.identifier.symbol = symbol
	} else {
		// Duplicated identifier.
		ctx.err.report(
			localize('nbtdoc.checker.duplicated-identifier', [
				localeQuote(symbol.identifier),
			]),
			node.identifier, ErrorSeverity.Warning,
			{
				related: [{
					location: symbol.declaration?.[0] ?? symbol.definition![0],
					message: localize('nbtdoc.checker.duplicated-identifier.related', [
						localeQuote(symbol.identifier),
					]),
				}],
			}
		)
	}
}

const describesClause = async (node: DescribesClauseNode, ctx: CheckerContext): Promise<void> => {

}

const enumDefinition = async (node: EnumDefinitionNode, ctx: CheckerContext): Promise<void> => {

}

const enumDefinitionHoisting = async (node: EnumDefinitionNode, ctx: CheckerContext): Promise<void> => {
	if (!node.identifier.value) {
		return
	}
	// TODO: Enter in file as well.
	const { isNewlyCreated, symbol } = ctx.symbols.createMember(ctx.doc, 'nbtdoc', [ctx.modIdentifier], {
		category: 'nbtdoc',
		identifier: node.identifier.value,
		form: 'definition',
		range: node.identifier,
		subcategory: 'enum',
		doc: node.doc.doc,
	})
	if (isNewlyCreated) {
		node.identifier.symbol = symbol
	} else {
		// Duplicated identifier.
		ctx.err.report(
			localize('nbtdoc.checker.duplicated-identifier', [
				localeQuote(symbol.identifier),
			]),
			node.identifier, ErrorSeverity.Warning,
			{
				related: [{
					location: symbol.declaration?.[0] ?? symbol.definition![0],
					message: localize('nbtdoc.checker.duplicated-identifier.related', [
						localeQuote(symbol.identifier),
					]),
				}],
			}
		)
	}
}

const injectClause = async (node: InjectClauseNode, ctx: CheckerContext): Promise<void> => {

}

const moduleDeclaration = async (node: ModuleDeclarationNode, ctx: CheckerContext): Promise<void> => {
	if (node.identifier.value.length) {
		const declaredSeg = [...ctx.modSeg, node.identifier.value]
		const declaredIdentifier = segToIdentifier(declaredSeg)
		const result = ctx.symbols.lookup('nbtdoc', [declaredIdentifier])
		if (!result) {
			// Not implemented.
			// Once this module is implemented (i.e. the file is created), the uri binder will add it to the symbol
			// table and also trigger a re-check.
			ctx.err.report(
				localize('nbtdoc.checker.module-declaration.non-existent', [
					localeQuote(declaredIdentifier),
				]),
				node.identifier
			)
		} else if (result.symbol.declaration?.length) {
			// Already declared somewhere else.
			ctx.err.report(
				localize('nbtdoc.checker.module-declaration.duplicated', [
					localeQuote(declaredIdentifier),
				]),
				node.identifier, ErrorSeverity.Warning,
				{
					related: [{
						location: result.symbol.declaration[0],
						message: localize('nbtdoc.checker.module-declaration.duplicated.related', [
							localeQuote(declaredIdentifier),
						]),
					}],
				}
			)
		} else {
			// Haven't been declared.
			node.identifier.symbol = ctx.symbols.enter(ctx.doc, {
				category: 'nbtdoc',
				identifier: declaredIdentifier,
				form: 'declaration',
				range: node.identifier,
				fullRange: node,
			})
		}
	}
}

const useClause = async (node: UseClauseNode, ctx: CheckerContext): Promise<void> => {
	const usedSymbol = await resolveIdentPath(node.path, ctx)
	if (usedSymbol) {
		// Creates an alias symbol for the used symbol.

		const lastToken = node.path.children[node.path.children.length - 1]
		const { isNewlyCreated, symbol: aliasSymbol } = ctx.symbols.create(ctx.doc, {
			category: 'nbtdoc',
			identifier: usedSymbol.identifier,
			form: 'declaration',
			range: lastToken,
			visibility: SymbolVisibility.File,
			relations: {
				// FIXME
				// aliasOf: usedSymbol,
			},
		})
		if (!isNewlyCreated) {
			// Duplicated identifier.
			ctx.err.report(
				localize('nbtdoc.checker.duplicated-identifier', [
					localeQuote(usedSymbol.identifier),
				]),
				lastToken, ErrorSeverity.Warning,
				{
					related: [{
						location: aliasSymbol.declaration?.[0] ?? aliasSymbol.definition![0],
						message: localize('nbtdoc.checker.duplicated-identifier.related', [
							localeQuote(usedSymbol.identifier),
						]),
					}],
				}
			)
		}

		// Enter in module if this is export.

		if (node.isExport) {
			ctx.symbols.createMember(ctx.doc, 'nbtdoc', [ctx.modIdentifier], {
				category: 'nbtdoc',
				identifier: lastToken.value,
				form: 'declaration',
				range: lastToken,
				relations: {
					// FIXME
					// aliasOf: usedSymbol,
				},
			})
		}
	}
}

function uriToSeg(uri: string, ctx: core.CheckerContext): Segments | null {
	const identifier = Object
		.keys(ctx.symbols.global.nbtdoc ?? {})
		.find(identifier => {
			const symbol = ctx.symbols.global.nbtdoc![identifier]!
			return symbol.subcategory === 'module' && symbol.implementation?.some(loc => loc.uri === uri)
		})
	return identifier ? identifierToSeg(identifier) : null
}

function segToUri(seg: Segments, ctx: core.CheckerContext): string | null {
	const identifier = segToIdentifier(seg)
	return ctx.symbols.global.nbtdoc?.[identifier]?.implementation?.[0]?.uri ?? null
}

/**
 * @returns Target segments.
 */
async function resolveIdentPath(identPath: IdentPathToken, ctx: CheckerContext): Promise<Symbol | null> {
	const targetSeg = identPath.fromGlobalRoot ? [] : [...ctx.modSeg]
	for (const [i, token] of identPath.children.entries()) {
		if (i < identPath.children.length - 1) {
			// Referencing to a module.

			// Resolve this token.
			if (token.value === 'super') {
				if (targetSeg.length === 0) {
					ctx.err.report(localize('nbtdoc.checker.ident-path.super-from-root'), Range.span(token, identPath))
					return null
				}
				targetSeg.pop()
			} else {
				targetSeg.push(token.value)
			}

			const amendedSymbol = ctx.symbols.amend(ctx.doc, {
				category: 'nbtdoc',
				identifier: segToIdentifier(targetSeg),
				form: 'reference',
				range: token,
				// TODO: If this token is 'super', we should make sure that renaming the module will not change this 'super' to the new name of the module.
			})
			if (!amendedSymbol) {
				continue
			}
			token.symbol = amendedSymbol
		} else {
			// Referencing to a compound or enum.

			const currentId = segToIdentifier(ctx.modSeg)
			const targetId = segToIdentifier(targetSeg)
			if (currentId !== targetId) {
				// The referenced compound/enum is in another module.
				// We should load and check that module first.

				const targetUri = segToUri(targetSeg, ctx)
				const targetDocAndNode = targetUri ? await ctx.service.ensure(targetUri) : null
				if (targetDocAndNode) {
					await ctx.service.check(targetDocAndNode.node, targetDocAndNode.doc)
				} else {
					ctx.err.report(
						localize('nbtdoc.checker.ident-path.unknown-module', [localeQuote(targetId)]),
						Range.span(token, identPath)
					)
					return null
				}
			}

			const amendedSymbol = ctx.symbols.amendMember(ctx.doc, 'nbtdoc', [targetId], {
				category: 'nbtdoc',
				identifier: token.value,
				form: 'reference',
				range: token,
			})
			if (!amendedSymbol) {
				ctx.err.report(
					localize('nbtdoc.checker.ident-path.unknown-identifier', [
						localeQuote(token.value),
						localeQuote(targetId),
					]),
					Range.span(token, identPath)
				)
				return null
			}
			return token.symbol = amendedSymbol
		}
	}
	return null
}
