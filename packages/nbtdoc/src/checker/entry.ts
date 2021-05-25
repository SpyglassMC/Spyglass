import type * as core from '@spyglassmc/core'
import type { Checker, RangeLike, Symbol, SymbolQuery } from '@spyglassmc/core'
import { ErrorSeverity, Range, ResourceLocationNode, SymbolPath, SymbolUtil, SymbolVisibility } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { Segments } from '../binder'
import { identifierToSeg, segToIdentifier } from '../binder'
import type { DescribesClauseNode, EnumDefinitionNode, IdentPathToken, InjectClauseNode, MainNode, ModuleDeclarationNode, UseClauseNode } from '../node'
import { CompoundDefinitionNode, CompoundFieldNode, ExtendableRootRegistryMap } from '../node'
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
	const modSymbol = ctx.symbols.lookup('nbtdoc', [modIdentifier], ctx.doc.uri).symbol!

	const hoistingNodes: (CompoundDefinitionNode | EnumDefinitionNode | ModuleDeclarationNode | UseClauseNode)[] = []
	const checkingNodes: (CompoundDefinitionNode | EnumDefinitionNode | DescribesClauseNode | InjectClauseNode)[] = []

	for (const childNode of node.children) {
		switch (childNode.type) {
			case 'nbtdoc:compound_definition':
				hoistingNodes.push(childNode)
				checkingNodes.push(childNode)
				break
			case 'nbtdoc:describes_clause':
				checkingNodes.push(childNode)
				break
			case 'nbtdoc:enum_definition':
				hoistingNodes.push(childNode)
				checkingNodes.push(childNode)
				break
			case 'nbtdoc:inject_clause':
				checkingNodes.push(childNode)
				break
			case 'nbtdoc:module_declaration':
				hoistingNodes.push(childNode)
				break
			case 'nbtdoc:use_clause':
				hoistingNodes.push(childNode)
				break
			case 'comment':
			default:
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
	for (const childNode of hoistingNodes) {
		switch (childNode.type) {
			case 'nbtdoc:compound_definition':
				compoundDefinitionHoisting(childNode, nbtdocCtx)
				break
			case 'nbtdoc:enum_definition':
				enumDefinitionHoisting(childNode, nbtdocCtx)
				break
			case 'nbtdoc:module_declaration':
				moduleDeclaration(childNode, nbtdocCtx)
				break
			case 'nbtdoc:use_clause':
				await useClause(childNode, nbtdocCtx)
				break
		}
	}

	// Actual checking.
	for (const childNode of checkingNodes) {
		switch (childNode.type) {
			case 'nbtdoc:compound_definition':
				await compoundDefinition(childNode, nbtdocCtx)
				break
			case 'nbtdoc:enum_definition':
				enumDefinition(childNode, nbtdocCtx)
				break
			case 'nbtdoc:describes_clause':
				await describesClause(childNode, nbtdocCtx)
				break
			case 'nbtdoc:inject_clause':
				await injectClause(childNode, nbtdocCtx)
				break
		}
	}
}

const compoundDefinition = async (node: CompoundDefinitionNode, ctx: CheckerContext): Promise<void> => {
	const definitionQuery = ctx.symbols.query(ctx.doc, 'nbtdoc', ctx.modIdentifier, node.identifier.value)
	if (!definitionQuery.symbol) {
		return
	}

	const extendedSymbol = node.extends?.type === 'nbtdoc:ident_path'
		? (await resolveIdentPath(node.extends, ctx))?.symbol ?? undefined
		: undefined
	const data = CompoundDefinitionNode.toSymbolData(node, SymbolPath.fromSymbol(extendedSymbol))
	definitionQuery.amend({ data: { data } })

	const promises: Promise<void>[] = []

	definitionQuery.onEach(node.fields, field => {
		promises.push(new Promise((resolve) => {
			definitionQuery.member(field.key.value, member => member
				.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, field.key))
				.else(async () => {
					const typeSymbol = field.fieldType.typeType === 'path'
						? (await resolveIdentPath(field.fieldType.path, ctx))?.symbol ?? undefined
						: undefined
					const data = CompoundFieldNode.toSymbolData(field, SymbolPath.fromSymbol(typeSymbol))
					member.enter({
						data: {
							data,
							desc: field.doc.value,
							subcategory: 'compound_key',
						},
						usage: {
							type: 'definition',
							node: field.key,
							fullRange: field,
						},
					})
					resolve()
				})
			)
		}))
	})

	await Promise.all(promises)
}

const compoundDefinitionHoisting = (node: CompoundDefinitionNode, ctx: CheckerContext): void => {
	if (!node.identifier.value) {
		return
	}
	ctx.symbols
		.query(ctx.doc, 'nbtdoc', ctx.modIdentifier, node.identifier.value)
		.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, node.identifier))
		.elseEnter({
			data: {
				desc: node.doc.value,
				subcategory: 'compound',
			},
			usage: {
				type: 'definition',
				node: node.identifier,
				fullRange: node,
			},
		})
}

const describesClause = async (node: DescribesClauseNode, ctx: CheckerContext): Promise<void> => {
	const registry = ResourceLocationNode.toString(node.registry, 'full')
	if (!(registry in ExtendableRootRegistryMap)) {
		return
	}

	const describerSymbol = await resolveIdentPath(node.path, ctx)

	const category = ExtendableRootRegistryMap[registry as keyof typeof ExtendableRootRegistryMap]
	const objects = node.objects ? node.objects.map(v => ResourceLocationNode.toString(v, 'full')) : ['@default']
	ctx.symbols
		.query(ctx.doc, 'nbtdoc/description', category)
		.enter({})
		.onEach(objects, (object, query) => {
			query.member(object, member => member
				.enter({
					data: {
						relations: {
							describedBy: SymbolPath.fromSymbol(describerSymbol?.symbol),
						},
					},
					usage: { type: 'definition', range: node },
				})
			)
		})
}

const enumDefinition = (node: EnumDefinitionNode, ctx: CheckerContext): void => {
	const definitionQuery = ctx.symbols.query(ctx.doc, 'nbtdoc', ctx.modIdentifier, node.identifier.value)
	if (!definitionQuery.symbol) {
		return
	}
	for (const field of node.fields) {
		ctx.symbols
			.query(ctx.doc, 'nbtdoc', ctx.modIdentifier, node.identifier.value, field.key.value)
			.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, field.key))
			.elseEnter({
				data: {
					/* data: {
						// TODO: Enum value
					}, */
					desc: field.doc.value,
					subcategory: 'enum_key',
				},
				usage: {
					type: 'declaration',
					node: field.key,
					fullRange: field,
				},
			})
	}
}

const enumDefinitionHoisting = (node: EnumDefinitionNode, ctx: CheckerContext): void => {
	if (!node.identifier.value) {
		return
	}
	ctx.symbols
		.query(ctx.doc, 'nbtdoc', ctx.modIdentifier, node.identifier.value)
		.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, node.identifier))
		.elseEnter({
			data: {
				desc: node.doc.value,
				subcategory: 'enum',
			},
			usage: {
				type: 'definition',
				node: node.identifier,
				fullRange: node,
			},
		})
}

const injectClause = async (node: InjectClauseNode, ctx: CheckerContext): Promise<void> => {
	if (!node.def) {
		return
	}
	const injectedQueryResult = await resolveIdentPath(node.def.path, ctx)
	if (!injectedQueryResult?.symbol) {
		return
	}
	// TODO: Check if the injected symbol has the same subcategory as our injection expects. 
	if (node.def?.type === 'nbtdoc:inject_clause/compound') {
		for (const field of node.def.fields) {
			const fieldPath = [...injectedQueryResult.path, field.key.value] as unknown as [string, ...string[]]
			ctx.symbols
				.query(ctx.doc, 'nbtdoc', ...fieldPath)
				.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, field.key))
				.elseEnter({
					data: {
						desc: field.doc.value,
						relations: {
							// TODO: Field type
						},
						subcategory: 'compound_key',
					},
					usage: {
						type: 'declaration',
						node: field.key,
						fullRange: field,
					},
				})
		}
	} else if (node.def?.type === 'nbtdoc:inject_clause/enum') {
		for (const field of node.def.fields) {
			const fieldPath = [...injectedQueryResult.path, field.key.value] as unknown as [string, ...string[]]
			ctx.symbols
				.query(ctx.doc, 'nbtdoc', ...fieldPath)
				.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, field.key))
				.elseEnter({
					data: {
						/* data: {
							// TODO: Enum value
						}, */
						desc: field.doc.value,
						subcategory: 'enum_key',
					},
					usage: {
						type: 'declaration',
						node: field.key,
						fullRange: field,
					},
				})
		}
	}
}

const moduleDeclaration = (node: ModuleDeclarationNode, ctx: CheckerContext): void => {
	if (node.identifier.value.length) {
		const declaredSeg = [...ctx.modSeg, node.identifier.value]
		const declaredIdentifier = segToIdentifier(declaredSeg)
		ctx.symbols
			.query(ctx.doc, 'nbtdoc', declaredIdentifier)
			.ifUnknown(() => ctx.err.report(
				localize('nbtdoc.checker.module-declaration.non-existent', localeQuote(declaredIdentifier)),
				node.identifier
			))
			.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.module-declaration.duplicated', ctx, symbol, node.identifier))
			.elseEnter({
				usage: {
					type: 'declaration',
					node: node.identifier,
					fullRange: node,
				},
			})
	}
}

const useClause = async (node: UseClauseNode, ctx: CheckerContext): Promise<void> => {
	const usedSymbol = (await resolveIdentPath(node.path, ctx))?.symbol
	if (usedSymbol) {
		const lastToken = node.path.children[node.path.children.length - 1]
		ctx.symbols
			.query(ctx.doc, 'nbtdoc', ctx.modIdentifier, usedSymbol.identifier)
			.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, lastToken))
			.elseEnter({
				data: {
					relations: {
						aliasOf: { category: 'nbtdoc', path: usedSymbol.path },
					},
				},
				usage: {
					type: 'declaration',
					node: lastToken,
					fullRange: node,
					...node.isExport ? {} : { visibility: SymbolVisibility.File },
				},
			})
	}
}

function reportDuplicatedDeclaration(localeString: string, ctx: CheckerContext, symbol: Symbol, range: RangeLike) {
	ctx.err.report(
		localize(localeString, localeQuote(symbol.identifier)),
		range, ErrorSeverity.Warning,
		{
			related: [{
				location: SymbolUtil.getDeclaredLocation(symbol) as core.Location,
				message: localize(`${localeString}.related`, localeQuote(symbol.identifier)),
			}],
		}
	)
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
 * @returns The actual symbol being used/imported from another module.
 */
async function resolveIdentPath(identPath: IdentPathToken, ctx: CheckerContext): Promise<SymbolQuery | null> {
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

			ctx.symbols
				.query(ctx.doc, 'nbtdoc', segToIdentifier(targetSeg))
				.amend({
					usage: {
						type: 'reference',
						node: token,
						// TODO: If this token is 'super', we should make sure that renaming the module will not change this 'super' to the new name of the module.
					},
				})
		} else {
			// Referencing to a compound or enum.

			const currentId = segToIdentifier(ctx.modSeg)
			const targetId = segToIdentifier(targetSeg)
			if (currentId !== targetId) {
				// The referenced compound/enum is in another module.
				// We should load and check that module first.

				const targetUri = segToUri(targetSeg, ctx)
				const ensured = targetUri ? await ctx.service.ensureChecked(targetUri) : false
				if (!ensured) {
					ctx.err.report(
						localize('nbtdoc.checker.ident-path.unknown-module', localeQuote(targetId)),
						Range.span(token, identPath)
					)
					return null
				}
			}

			return ctx.symbols
				.query(ctx.doc, 'nbtdoc', targetId, token.value)
				.ifUnknown(() => ctx.err.report(
					localize('nbtdoc.checker.ident-path.unknown-identifier', localeQuote(token.value), localeQuote(targetId)),
					Range.span(token, identPath)
				))
				.elseResolveAlias()
				.elseEnter({
					usage: {
						type: 'reference',
						node: token,
					},
				})
		}
	}
	return null
}
