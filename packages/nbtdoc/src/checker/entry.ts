import type * as core from '@spyglassmc/core'
import type { Checker } from '@spyglassmc/core'
import { ErrorSeverity, Range, SymbolPath } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { identifierToPath, pathToIdentifier } from '../binder'
import type { CompoundDefinitionNode, DescribesClauseNode, EnumDefinitionNode, IdentPathToken, InjectClauseNode, MainNode, ModuleDeclarationNode, UseClauseNode } from '../node'
import type { CheckerContext } from './CheckerContext'

export const entry: Checker<MainNode> = async (node: MainNode, ctx: core.CheckerContext): Promise<void> => {
	const modPath = uriToPath(ctx.doc.uri, ctx)
	if (modPath === null) {
		ctx.err.report(localize('nbtdoc.checker.entry.null-mod-path'), 0, ErrorSeverity.Warning)
		return
	} else if (modPath.length === 0) {
		ctx.err.report(localize('nbtdoc.checker.entry.empty-mod-path'), 0, ErrorSeverity.Warning)
	}

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
		modPath,
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

}

const describesClause = async (node: DescribesClauseNode, ctx: CheckerContext): Promise<void> => {

}

const enumDefinition = async (node: EnumDefinitionNode, ctx: CheckerContext): Promise<void> => {

}

const enumDefinitionHoisting = async (node: EnumDefinitionNode, ctx: CheckerContext): Promise<void> => {

}

const injectClause = async (node: InjectClauseNode, ctx: CheckerContext): Promise<void> => {

}

const moduleDeclaration = async (node: ModuleDeclarationNode, ctx: CheckerContext): Promise<void> => {
	if (node.identifier.value.length) {
		const declaredPath = [...ctx.modPath, node.identifier.value]
		const declaredIdentifier = pathToIdentifier(declaredPath)
		const result = ctx.symbols.lookup(SymbolPath.create('nbtdoc', declaredIdentifier))
		if (result?.symbol.subcategory !== 'module') {
			// Not implemented.
			// Once this module is implemented (i.e. the file is created), the uri binder will add it to the symbol
			// table and also trigger a re-check.
			ctx.err.report(
				localize('nbtdoc.checker.module-declaration.non-existent', [
					localize('punc.quote', [declaredIdentifier]),
				]),
				node.identifier
			)
		} else {
			if (result.symbol.declaration?.length) {
				// Already declared somewhere else.
				ctx.err.report(
					localize('nbtdoc.checker.module-declaration.duplicated', [
						localize('punc.quote', [declaredIdentifier]),
					]),
					node.identifier, ErrorSeverity.Warning,
					{
						related: [{
							location: result.symbol.declaration[0],
							message: localize('nbtdoc.checker.module-declaration.duplicated.related', [
								localize('punc.quote', [declaredIdentifier]),
							]),
						}],
					}
				)
			} else {
				// Haven't been declared.
				ctx.symbols.enter(ctx.doc, {
					category: 'nbtdoc',
					subcategory: 'module',
					identifier: declaredIdentifier,
					form: 'declaration',
					range: node.identifier,
					fullRange: node,
				})
			}
		}
	}
}

const useClause = async (node: UseClauseNode, ctx: CheckerContext): Promise<void> => {
	const targetPath = resolveIdentPath(node.path, ctx)
	if (targetPath) {
		// TODO: Creates an alias Symbol for the Symbol pointed by targetPath at File visibility scope.
	}
}

function uriToPath(uri: string, ctx: core.CheckerContext): string[] | null {
	const identifier = Object
		.keys(ctx.symbols.global.nbtdoc ?? {})
		.find(identifier => {
			const symbol = ctx.symbols.global.nbtdoc![identifier]!
			return symbol.subcategory === 'module' && symbol.implementation?.some(loc => loc.uri === uri)
		})
	return identifier ? identifierToPath(identifier) : null
}

/**
 * @returns Target path.
 */
function resolveIdentPath(identPath: IdentPathToken, ctx: CheckerContext): string[] | null {
	const ans = identPath.fromGlobalRoot ? [] : [...ctx.modPath]
	for (const [i, token] of identPath.children.entries()) {
		// Resolve this token.
		if (token.value === 'super') {
			if (ans.length === 0) {
				ctx.err.report(localize('nbtdoc.checker.ident-path.super-from-root'), Range.span(token, identPath))
				return null
			}
			ans.pop()
		} else {
			ans.push(token.value)
		}
		// Add this token as a reference of that Symbol.
		ctx.symbols.enter(ctx.doc, {
			category: 'nbtdoc',
			subcategory: 'module',
			identifier: pathToIdentifier(ans),
			form: 'reference',
			range: token,
			// TODO: If this token is 'super', we should make sure that renaming the module will not change this 'super' to the new name of the module.
		})
		// Associate this token with the corresponding module's Symbol.
		const path = { category: 'nbtdoc', path: [pathToIdentifier(ans)] } // FIXME: Special handle for the last element.
		token.symbol = ctx.symbols.lookup(path)!.symbol
	}
	return ans
}
