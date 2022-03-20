import type * as core from '@spyglassmc/core'
import type { Checker, RangeLike, Symbol, SymbolQuery } from '@spyglassmc/core'
import { ErrorSeverity, Range, ResourceLocationNode, SymbolPath, SymbolUtil, SymbolVisibility } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { Segments } from '../binder'
import { identifierToSeg, segToIdentifier } from '../binder'
import type { DescribesClauseNode, FloatRangeNode, IdentPathToken, InjectClauseNode, IntRangeNode, MainNode, ModuleDeclarationNode, UnsignedRangeNode, UseClauseNode } from '../node'
import { CompoundDefinitionNode, CompoundFieldNode, CompoundFieldTypeNode, EnumDefinitionNode, EnumFieldNode, ExtendableRootRegistryMap } from '../node'
import type { CheckerContext } from './CheckerContext'

export const entry: Checker<MainNode> = async (node: MainNode, ctx: core.CheckerContext): Promise<void> => {
	const modSeg = uriToSeg(ctx.doc.uri, ctx)
	if (modSeg === undefined) {
		ctx.err.report(localize('nbtdoc.checker.entry.undefined-mod-seg'), 0, ErrorSeverity.Warning)
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

async function compoundFields<N extends { fields: CompoundFieldNode[] }>(definitionQuery: core.SymbolQuery, node: N, ctx: CheckerContext) {
	const promises: Promise<void>[] = []

	definitionQuery.onEach(node.fields, field => {
		promises.push(new Promise(resolve => {
			definitionQuery.member(field.key.value, member => member
				.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, field.key))
				.else(async () => {
					const data = await CompoundFieldNode.toSymbolData(field, async n => (await resolveIdentPath(n, ctx))?.symbol)
					member.enter({
						data: { data, desc: field.doc.value, subcategory: 'compound_key' },
						usage: { type: 'definition', node: field.key, fullRange: field },
					})
					resolve()
				})
			)
		}))
	})

	return Promise.allSettled(promises)
}

const compoundDefinition = async (node: CompoundDefinitionNode, ctx: CheckerContext): Promise<void> => {
	const definitionQuery = ctx.symbols.query(ctx.doc, 'nbtdoc', ctx.modIdentifier, node.identifier.value)
	if (!definitionQuery.symbol) {
		return
	}

	const data = await CompoundDefinitionNode.toSymbolData(node, async n => (await resolveIdentPath(n, ctx))?.symbol)
	definitionQuery.amend({ data: { data } })

	await compoundFields(definitionQuery, node, ctx)
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

function enumFields<N extends { fields: EnumFieldNode[] }>(definitionQuery: core.SymbolQuery, node: N, ctx: CheckerContext) {
	definitionQuery.onEach(node.fields, field => {
		definitionQuery.member(field.key.value, member => member
			.ifDeclared(symbol => reportDuplicatedDeclaration('nbtdoc.checker.duplicated-identifier', ctx, symbol, field.key))
			.else(() => {
				const data = EnumFieldNode.toSymbolData(field)
				member.enter({
					data: { data, desc: field.doc.value, subcategory: 'enum_key' },
					usage: { type: 'definition', node: field.key, fullRange: field },
				})
			})
		)
	})
}

const enumDefinition = (node: EnumDefinitionNode, ctx: CheckerContext): void => {
	const definitionQuery = ctx.symbols.query(ctx.doc, 'nbtdoc', ctx.modIdentifier, node.identifier.value)
	if (!definitionQuery.symbol) {
		return
	}

	const data = EnumDefinitionNode.toSymbolData(node)
	definitionQuery.amend({ data: { data } })

	enumFields(definitionQuery, node, ctx)
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
	const injectedQuery = await resolveIdentPath(node.def.path, ctx)
	if (!injectedQuery?.symbol) {
		return
	}
	if (!(
		(node.def?.type === 'nbtdoc:inject_clause/compound' && injectedQuery.symbol.subcategory === 'compound') ||
		(node.def?.type === 'nbtdoc:inject_clause/enum' && injectedQuery.symbol.subcategory === 'enum')
	)) {
		const target = localize(`nbtdoc.node.${injectedQuery.symbol.subcategory === 'enum' ? 'enum-definition' : 'compound-definition'}`)
		const injection = localize(`nbtdoc.node.${node.def?.type === 'nbtdoc:inject_clause/enum' ? 'enum-definition' : 'compound-definition'}`)
		ctx.err.report(localize('nbtdoc.checker.inject-clause.unmatched-injection', target, injection), node.def.path)
		return
	}
	if (node.def?.type === 'nbtdoc:inject_clause/compound') {
		await compoundFields(injectedQuery, node.def, ctx)
	} else if (node.def?.type === 'nbtdoc:inject_clause/enum') {
		enumFields(injectedQuery, node.def, ctx)
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

function uriToSeg(uri: string, ctx: core.CheckerContext): Segments | undefined {
	const identifier = Object
		.keys(ctx.symbols.global.nbtdoc ?? {})
		.find(identifier => {
			const symbol = ctx.symbols.global.nbtdoc![identifier]!
			return symbol.subcategory === 'module' && symbol.implementation?.some(loc => loc.uri === uri)
		})
	return identifier ? identifierToSeg(identifier) : undefined
}

function segToUri(seg: Segments, ctx: core.CheckerContext): string | undefined {
	const identifier = segToIdentifier(seg)
	return ctx.symbols.global.nbtdoc?.[identifier]?.implementation?.[0]?.uri
}

/**
 * @returns The actual symbol being used/imported from another module.
 */
async function resolveIdentPath(identPath: IdentPathToken, ctx: CheckerContext): Promise<SymbolQuery | undefined> {
	const targetSeg = identPath.fromGlobalRoot ? [] : [...ctx.modSeg]
	for (const [i, token] of identPath.children.entries()) {
		if (i < identPath.children.length - 1) {
			// Referencing to a module.

			// Resolve this token.
			if (token.value === 'super') {
				if (targetSeg.length === 0) {
					ctx.err.report(localize('nbtdoc.checker.ident-path.super-from-root'), Range.span(token, identPath))
					return undefined
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
						skipRenaming: token.value === 'super',
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
				const ensured = targetUri ? await ctx.ensureChecked(targetUri) : false
				if (!ensured) {
					ctx.err.report(
						localize('nbtdoc.checker.ident-path.unknown-module', localeQuote(targetId)),
						Range.span(token, identPath)
					)
					return undefined
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
	return undefined
}

export const checkAssignability = ({ source, target }: { source: CompoundFieldTypeNode.SymbolData | undefined, target: CompoundFieldTypeNode.SymbolData | undefined }): {
	isAssignable: boolean,
	errorMessage?: string,
} => {
	if (source === undefined || target === undefined) {
		return { isAssignable: true }
	}

	type TypeData = CompoundFieldTypeNode.SymbolData
	type RangeData = FloatRangeNode.SymbolData | IntRangeNode.SymbolData | UnsignedRangeNode.SymbolData | undefined
	const areRangesMatch = (s: RangeData, t: RangeData): boolean => {
		if (!t) {
			return true
		}
		if (!s) {
			return false
		}
		const [sMin, sMax] = s.value
		const [tMin, tMax] = t.value
		return (tMin === undefined || (sMin !== undefined && sMin >= tMin)) &&
			(tMax === undefined || (sMax !== undefined && sMax <= tMax))
	}

	enum CheckResult {
		Nah = 0b00,
		Assignable = 0b01,
		StrictlyAssignable = 0b11,
	}

	const flattenUnion = (union: CompoundFieldTypeNode.UnionSymbolData): CompoundFieldTypeNode.UnionSymbolData => {
		const set = new Set<TypeData>()
		const add = (data: TypeData): void => {
			for (const existingMember of set) {
				if ((check(data, existingMember) & CheckResult.StrictlyAssignable) === CheckResult.StrictlyAssignable) {
					return
				}
				if ((check(existingMember, data) & CheckResult.StrictlyAssignable) === CheckResult.StrictlyAssignable) {
					set.delete(existingMember)
				}
			}
			set.add(data)
		}
		for (const member of union.members) {
			if (member.type === 'union') {
				flattenUnion(member).members.forEach(add)
			} else {
				add(member)
			}
		}
		return {
			type: 'union',
			members: [...set],
		}
	}

	const simplifyUnion = (data: TypeData): TypeData => {
		if (data.type === 'union') {
			data = flattenUnion(data)
			if (data.members.length === 1) {
				return data.members[0]
			}
		}
		return data
	}

	const check = (s: TypeData, t: TypeData, errors: string[] = []): CheckResult => {
		const strictlyAssignableIfTrue = (value: boolean): CheckResult => value ? CheckResult.StrictlyAssignable : CheckResult.Nah
		const assignableIfTrue = (value: boolean): CheckResult => value ? CheckResult.Assignable : CheckResult.Nah
		let ans: CheckResult
		if (s.type === 'union') {
			ans = assignableIfTrue(s.members.every(v => check(v, t, errors)))
		} else if (t.type === 'union') {
			ans = assignableIfTrue(t.members.some(v => check(s, v)))
		} else if (s.type === 'boolean') {
			ans = strictlyAssignableIfTrue(t.type === 'boolean' || t.type === 'byte')
		} else if (s.type === 'byte') {
			if (t.type === 'boolean') {
				ans = check(s, { type: 'byte', valueRange: { value: [0, 1] } }, errors)
			} else if (t.type === 'byte') {
				ans = strictlyAssignableIfTrue(areRangesMatch(s.valueRange, t.valueRange))
			} else if (t.type === 'enum') {
				ans = assignableIfTrue(!t.enumType || t.enumType === 'byte')
			} else {
				ans = CheckResult.Nah
			}
		} else if (s.type === 'byte_array' || s.type === 'int_array' || s.type === 'long_array') {
			if (t.type === s.type) {
				ans = strictlyAssignableIfTrue(areRangesMatch(s.lengthRange, t.lengthRange) && areRangesMatch(s.valueRange, t.valueRange))
			} else {
				ans = CheckResult.Nah
			}
		} else if (s.type === 'compound' || s.type === 'index') {
			ans = assignableIfTrue(t.type === 'compound' || t.type === 'index')
		} else if (s.type === 'enum') {
			ans = assignableIfTrue((t.type === 'byte' || t.type === 'float' || t.type === 'double' || t.type === 'int' || t.type === 'long' || t.type === 'short' || t.type === 'string') && (!s.enumType || s.enumType === t.type))
		} else if (s.type === 'float' || s.type === 'double' || s.type === 'int' || s.type === 'long' || s.type === 'short') {
			if (t.type === s.type) {
				ans = strictlyAssignableIfTrue(areRangesMatch(s.valueRange, t.valueRange))
			} else if (t.type === 'enum') {
				ans = assignableIfTrue(!t.enumType || t.enumType === s.type)
			} else {
				ans = CheckResult.Nah
			}
		} else if (s.type === 'id') {
			if (t.type === 'id' && s.registry === t.registry) {
				ans = CheckResult.StrictlyAssignable
			} else {
				ans = assignableIfTrue(t.type === 'id' || t.type === 'string')
			}
		} else if (s.type === 'list') {
			if (t.type === 'list' && areRangesMatch(s.lengthRange, t.lengthRange)) {
				ans = check(s.item, t.item, errors)
			} else {
				ans = CheckResult.Nah
			}
		} else if (s.type === 'string') {
			if (t.type === 'string') {
				ans = CheckResult.StrictlyAssignable
			} else {
				ans = assignableIfTrue(t.type === 'enum' && (!t.enumType || t.enumType === 'string'))
			}
		} else {
			ans = CheckResult.Nah
		}

		if (!ans) {
			errors.push(localize('nbtdoc.checker.type-not-assignable',
				localeQuote(CompoundFieldTypeNode.symbolDataToString(s)),
				localeQuote(CompoundFieldTypeNode.symbolDataToString(t))
			))
		}
		return ans
	}

	source = simplifyUnion(source)
	target = simplifyUnion(target)

	const errors: string[] = []

	check(source, target, errors)

	return {
		isAssignable: errors.length === 0,
		...errors.length ? { errorMessage: errors.reverse().map((m, i) => `${'  '.repeat(i)}${m}`).join('\n') } : {},
	}
}
