import { Range, Source } from '@spyglassmc/core'
import type { CheckerContext, FullResourceLocation } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { TypeDefSymbolData } from '../../binder/index.js'
import { type EnumKind } from '../../node/index.js'
import type {
	ConcreteType,
	DispatcherType,
	EnumType,
	Index,
	IndexedType,
	KeywordType,
	ListType,
	LiteralType,
	MappedType,
	NumericType,
	ParallelIndices,
	PrimitiveArrayType,
	ReferenceType,
	StringType,
	StructType,
	StructTypePairField,
	TemplateType,
	TupleType,
	UnionType,
} from '../../type/index.js'
import { McdocType, NumericRange } from '../../type/index.js'
import { handleAttributes } from '../attribute/index.js'
import type { NodeEquivalenceChecker, RuntimeNode, RuntimePair, RuntimeUnion } from './context.js'
import { McdocCheckerContext } from './context.js'
import type { McdocRuntimeError } from './error.js'
import { condenseErrorsAndFilterSiblings } from './error.js'

export * from './context.js'
export * from './error.js'

export type SimplifiedMcdocType =
	| SimplifiedMcdocTypeNoUnion
	| UnionType<SimplifiedMcdocTypeNoUnion>

export type SimplifiedMcdocTypeNoUnion =
	| SimplifiedEnum
	| KeywordType
	| ListType
	| LiteralType
	| NumericType
	| PrimitiveArrayType
	| StringType
	| SimplifiedStructType
	| TupleType

export interface SimplifiedEnum extends EnumType {
	enumKind: EnumKind
}
export interface SimplifiedStructType extends StructType {
	fields: SimplifiedStructTypePairField[]
}
export interface SimplifiedStructTypePairField extends StructTypePairField {
	key: SimplifiedMcdocTypeNoUnion
}

export function reference<T>(
	node: RuntimeNode<T>[],
	path: string,
	ctx: McdocCheckerContext<T>,
) {
	typeDefinition(node, { kind: 'reference', path }, ctx)
}

export function dispatcher<T>(
	node: RuntimeNode<T>[],
	registry: FullResourceLocation,
	index: string | Index | ParallelIndices,
	ctx: McdocCheckerContext<T>,
) {
	const parallelIndices: ParallelIndices = typeof index === 'string'
		? [{ kind: 'static', value: index }]
		: Array.isArray(index)
		? index
		: [index]
	typeDefinition(node, { kind: 'dispatcher', registry, parallelIndices }, ctx)
}

export function isAssignable(
	assignValue: McdocType,
	typeDef: McdocType,
	ctx: CheckerContext,
	isEquivalent?: NodeEquivalenceChecker,
): boolean {
	if (
		assignValue.kind === 'literal' && typeDef.kind === 'literal'
		&& assignValue.value.kind === typeDef.value.kind
		&& !assignValue.attributes && !typeDef.attributes
	) {
		return assignValue.value.value === typeDef.value.value
	}
	let ans = true
	const newCtx = McdocCheckerContext.create(ctx, {
		isEquivalent,
		getChildren: (_, d) => {
			switch (d.kind) {
				case 'list':
					const vals = getPossibleTypes(d.item)
					return [vals.map(v => ({ originalNode: v, inferredType: v }))]
				case 'byte_array':
					return [[{ originalNode: { kind: 'byte' }, inferredType: { kind: 'byte' } }]]
				case 'int_array':
					return [[{ originalNode: { kind: 'int' }, inferredType: { kind: 'int' } }]]
				case 'long_array':
					return [[{ originalNode: { kind: 'long' }, inferredType: { kind: 'long' } }]]
				case 'struct':
					return d.fields.map(f => {
						const vals = getPossibleTypes(f.type)
						return {
							attributes: f.attributes,
							key: { originalNode: f.key, inferredType: f.key },
							possibleValues: vals.map(v => ({ originalNode: v, inferredType: v })),
						}
					})
				case 'tuple':
					return d.items.map(f => {
						const vals = getPossibleTypes(f)
						return vals.map(v => ({ originalNode: v, inferredType: v }))
					})
				default:
					return []
			}
		},
		reportError: () => {
			ans = false
		},
	})

	const node: CheckerTreeNode<McdocType> = {
		parent: undefined,
		key: undefined,
		possibleValues: [],
	}
	node.possibleValues = getPossibleTypes(typeDef).map(v => ({
		entryNode: node,
		node: { originalNode: v, inferredType: v },
		children: [],
		validDefinitions: [],
		condensedErrors: [],
	}))

	// TODO add bail option to allow checking logic to bail on first error
	typeDefinition(
		getPossibleTypes(assignValue).map(v => ({ originalNode: v, inferredType: v })),
		typeDef,
		newCtx,
	)

	return ans
}

export interface CheckerTreeNode<T> {
	parent: CheckerTreeRuntimeNode<T> | undefined

	key: {
		runtimeValue: RuntimeNode<T>
		typeDef: SimplifiedMcdocTypeNoUnion | undefined
	} | undefined
	possibleValues: CheckerTreeRuntimeNode<T>[]
}

export interface CheckerTreeError<T> {
	error: McdocRuntimeError<T>
	definitionNode: CheckerTreeDefinitionNode<T> | undefined
}

export interface CheckerTreeRuntimeNode<T> {
	entryNode: CheckerTreeNode<T>
	children: CheckerTreeNode<T>[]
	node: RuntimeNode<T>

	condensedErrors: CheckerTreeError<T>[][]
	validDefinitions: CheckerTreeDefinitionNode<T>[]
}

export interface CheckerTreeDefinitionNode<T> {
	parent: CheckerTreeDefinitionNode<T> | undefined
	runtimeNode: CheckerTreeRuntimeNode<T>
	typeDef: SimplifiedMcdocTypeNoUnion
	desc?: string
}

export function typeDefinition<T>(
	runtimeValues: RuntimeNode<T>[],
	typeDef: McdocType,
	ctx: McdocCheckerContext<T>,
) {
	const rootNode: CheckerTreeNode<T> = {
		parent: undefined,
		key: undefined,
		possibleValues: [],
	}
	rootNode.possibleValues = runtimeValues.map(n => ({
		node: n,
		entryNode: rootNode,
		validDefinitions: [],
		children: [],
		condensedErrors: [],
	}))
	for (const value of rootNode.possibleValues) {
		const simplifiedRoot = simplify(typeDef, { ctx, node: value })
		const validRootDefinitions = simplifiedRoot.kind === 'union'
			? simplifiedRoot.members
			: [simplifiedRoot]
		value.validDefinitions = validRootDefinitions.map(d => ({
			parent: undefined,
			runtimeNode: value,
			typeDef: d,
		}))
	}
	const nodeQueue: CheckerTreeNode<T>[] = [rootNode]

	while (nodeQueue.length !== 0) {
		const node = nodeQueue.splice(0, 1)[0]
		const encounterdErrors: CheckerTreeError<T>[] = []

		for (const value of node.possibleValues) {
			const inferredSimplified = simplify(value.node.inferredType, { ctx, node: value })
			const children = ctx.getChildren(value.node.originalNode, inferredSimplified)
			const childNodes = children.map(c => {
				const ans: CheckerTreeNode<T> = {
					parent: value,
					key: !Array.isArray(c) ? { runtimeValue: c.key, typeDef: undefined } : undefined,
					possibleValues: [],
				}

				ans.possibleValues = (Array.isArray(c) ? c : c.possibleValues).map(v => ({
					entryNode: ans,
					node: v,
					validDefinitions: [],
					condensedErrors: [],
					children: [],
				}))

				return ans
			})

			for (const def of value.validDefinitions) {
				const { errors, childDefinitions } = checkShallowly(
					value.node,
					inferredSimplified,
					children,
					def.typeDef,
					ctx,
				)
				encounterdErrors.push(...errors.map(e => ({ error: e, definitionNode: def })))
				for (let i = 0; i < childDefinitions.length; i++) {
					const childDef = childDefinitions[i]
					if (!childDef) {
						continue
					}
					const child = childNodes[i]
					if (child.key) {
						child.key.typeDef = childDef.keyType
					}
					for (const childValue of child.possibleValues) {
						// TODO We need some sort of map / local cache which keeps track of the original
						// non-simplified types and see if they have been compared yet. This is needed
						// for structures that are cyclic, to essentially bail out once we are comparing
						// the same types again and just collect the errors of the lower depth.
						// This will currently lead to a stack overflow error when e.g. comparing two
						// text component definitions
						const simplified = simplify(childDef.type, { ctx, node: childValue })
						// TODO this does not keep track correctly of empty unions. The child node should receive
						// some kind of empty union valid definition with the parent set to the correct definition
						// so that we can potentially error some valid parent defs if only some of them produce an
						// empty union for the child.
						const validDefs =
							(simplified.kind === 'union' ? simplified.members : [simplified]).map(d => ({
								parent: def,
								runtimeNode: childValue,
								typeDef: d,
								desc: childDef.desc,
							}))
						childValue.validDefinitions.push(...validDefs)
					}
				}
			}
			value.children = childNodes
			nodeQueue.push(...childNodes)

			let curNode: CheckerTreeRuntimeNode<T> | undefined = value
			let depth = 0
			let childErrors = encounterdErrors
			while (curNode) {
				const stillValidDefintions: CheckerTreeDefinitionNode<T>[] = []
				const errors: CheckerTreeError<T>[] = []

				// It is only meaningful to reduce valid definitions where the union actually happened
				const definitionGroups = curNode.validDefinitions.reduce(
					(groups, item) => {
						const group = groups.find(g => g.parent === item.parent)
						if (group) {
							group.children.push(item)
						} else {
							groups.push({ parent: item.parent, children: [item] })
						}
						return groups
					},
					[] as {
						parent: CheckerTreeDefinitionNode<T> | undefined
						children: CheckerTreeDefinitionNode<T>[]
					}[],
				)

				for (const definitionGroup of definitionGroups) {
					const { definitions, condensedErrors } = condenseErrorsAndFilterSiblings(
						definitionGroup.children.map(c => ({
							definition: c,
							errors: childErrors.filter(e => e.definitionNode === c).map(e => e.error),
						})),
					)

					definitionGroup.children = definitions
					stillValidDefintions.push(...definitions)
					errors.push(
						...condensedErrors.map(e => ({
							error: e,
							definitionNode: definitionGroup.parent,
						})),
					)
				}
				curNode.condensedErrors.push(errors)

				if (curNode.validDefinitions.length !== stillValidDefintions.length) {
					curNode.validDefinitions = stillValidDefintions

					filterChildDefinitions(curNode.validDefinitions, curNode.children)

					function filterChildDefinitions(
						parentDefs: CheckerTreeDefinitionNode<T>[],
						children: CheckerTreeNode<T>[],
					) {
						for (const child of children) {
							for (const childValue of child.possibleValues) {
								childValue.validDefinitions = childValue.validDefinitions.filter(d =>
									parentDefs.includes(d.parent!)
								)
								filterChildDefinitions(childValue.validDefinitions, childValue.children)
							}
						}
					}
				}

				const oldNode: CheckerTreeRuntimeNode<T> = curNode
				curNode = oldNode.entryNode.parent

				const lastChild = curNode?.children.flatMap(v => v.possibleValues).findLast(v => {
					if (v.condensedErrors.length > depth) {
						return true
					}

					let children = [v]
					for (let i = 0; i < depth; i++) {
						children = children.flatMap(v => v.children).flatMap(v => v.possibleValues)
					}
					return children.length > 0
				})

				if (lastChild !== oldNode) {
					// Wait for all siblings to be evaluated first
					break
				}

				childErrors = curNode!.children.flatMap(c => c.possibleValues).flatMap(c =>
					c.condensedErrors.length > depth ? c.condensedErrors[depth] : []
				)

				depth++
			}
		}
	}

	if (ctx.attachTypeInfo) {
		for (const node of rootNode.possibleValues) {
			attachTypeInfo(node, ctx)
		}
	}

	for (const error of rootNode.possibleValues.flatMap(v => v.condensedErrors).flat()) {
		if (error) {
			ctx.reportError(error.error)
		}
	}
}

function attachTypeInfo<T>(node: CheckerTreeRuntimeNode<T>, ctx: McdocCheckerContext<T>) {
	if (node.validDefinitions.length === 1) {
		const { typeDef, desc } = node.validDefinitions[0]
		ctx.attachTypeInfo?.(node.node.originalNode, typeDef, desc)
		handleStringAttachers(node.node, typeDef, ctx)
	} else if (node.validDefinitions.length > 1) {
		ctx.attachTypeInfo?.(node.node.originalNode, {
			kind: 'union',
			members: node.validDefinitions.map(d => d.typeDef),
		})
		// when there are multiple valid definitions, we don't run any string parsers,
	}
	for (const child of node.children) {
		if (child.key && child.key.typeDef) {
			ctx.attachTypeInfo?.(child.key.runtimeValue.originalNode, child.key.typeDef)
			handleStringAttachers(child.key.runtimeValue, child.key.typeDef, ctx)
		}

		for (const node of child.possibleValues) {
			attachTypeInfo(node, ctx)
		}
	}
}

function handleStringAttachers<T>(
	runtimeValue: RuntimeNode<T>,
	typeDef: SimplifiedMcdocTypeNoUnion,
	ctx: McdocCheckerContext<T>,
) {
	const { stringAttacher } = ctx
	if (!stringAttacher) {
		return
	}
	handleAttributes(typeDef.attributes, ctx, (handler, config) => {
		const parser = handler.stringParser?.(config, typeDef, ctx)
		if (!parser) {
			return
		}
		stringAttacher(runtimeValue.originalNode, (node) => {
			const src = new Source(node.value, node.valueMap)
			const start = src.cursor
			const child = parser(src, ctx)
			if (!child) {
				ctx.err.report(
					localize('expected', localize('mcdoc.runtime.checker.value')),
					Range.create(start, src.skipRemaining()),
				)
				return
			} else if (src.canRead()) {
				ctx.err.report(
					localize('mcdoc.runtime.checker.trailing'),
					Range.create(src.cursor, src.skipRemaining()),
				)
			}
			node.children = [child]
		})
	})
}

interface ShallowCheckResultChildDefinition {
	type: McdocType
	keyType?: SimplifiedMcdocTypeNoUnion
	desc?: string
}

interface ShallowCheckResult<T> {
	errors: McdocRuntimeError<T>[]
	childDefinitions: (ShallowCheckResultChildDefinition | undefined)[]
}

function checkShallowly<T>(
	runtimeNode: RuntimeNode<T>,
	simplifiedInferred: SimplifiedMcdocTypeNoUnion,
	children: RuntimeUnion<T>[],
	typeDef: SimplifiedMcdocTypeNoUnion,
	ctx: McdocCheckerContext<T>,
): ShallowCheckResult<T> {
	const typeDefValueType = getValueType(typeDef)
	const runtimeValueType = getValueType(simplifiedInferred)

	const childDefinitions = Array<ShallowCheckResultChildDefinition | undefined>(children.length)
		.fill(undefined)

	if (
		(typeDef.kind !== 'any' && typeDef.kind !== 'unsafe'
			&& simplifiedInferred.kind !== 'unsafe'
			&& runtimeValueType.kind !== typeDefValueType.kind
			&& !ctx.isEquivalent(runtimeValueType, typeDefValueType))
	) {
		return {
			childDefinitions,
			errors: [{ kind: 'type_mismatch', node: runtimeNode, expected: [typeDef] }],
		}
	}

	const errors: McdocRuntimeError<T>[] = []
	let assignable = true
	handleAttributes(typeDef.attributes, ctx, (handler, config) => {
		if (handler.checkInferred?.(config, simplifiedInferred, ctx) === false) {
			assignable = false
		}
	})
	if (!assignable) {
		errors.push({ kind: 'internal', node: runtimeNode })
	}

	if (
		(typeDef.kind === 'literal'
			&& (simplifiedInferred.kind !== 'literal'
				|| typeDef.value.value !== simplifiedInferred.value.value))
		// TODO handle enum field attributes
		|| (typeDef.kind === 'enum'
			&& (simplifiedInferred.kind !== 'literal'
				|| !typeDef.values.some(v => v.value === simplifiedInferred.value.value)))
	) {
		return {
			childDefinitions,
			errors: [{ kind: 'type_mismatch', node: runtimeNode, expected: [typeDef] }],
		}
	}

	switch (typeDef.kind) {
		case 'any':
		case 'unsafe':
			break
		case 'byte':
		case 'short':
		case 'int':
		case 'long':
		case 'float':
		case 'double':
			if (
				typeDef.valueRange
				&& simplifiedInferred.kind === 'literal'
				&& typeof simplifiedInferred.value.value === 'number'
				&& !NumericRange.isInRange(typeDef.valueRange, simplifiedInferred.value.value)
			) {
				errors.push({
					kind: 'number_out_of_range',
					node: runtimeNode,
					ranges: [typeDef.valueRange],
				})
			}
			break
		case 'string':
			if (
				typeDef.lengthRange
				&& simplifiedInferred.kind === 'literal'
				&& simplifiedInferred.value.kind === 'string'
				&& !NumericRange.isInRange(typeDef.lengthRange, simplifiedInferred.value.value.length)
			) {
				errors.push({
					kind: 'invalid_string_length',
					node: runtimeNode,
					ranges: [typeDef.lengthRange],
				})
			}
			break
		case 'struct': {
			const literalKvps = new Map<
				string,
				{
					values: { pair: RuntimePair<T>; index: number }[]
					definition: ShallowCheckResultChildDefinition | undefined
				}
			>()
			const otherKvps: { value: RuntimePair<T>; index: number }[] = []

			for (let i = 0; i < children.length; i++) {
				const child = children[i]
				if (Array.isArray(child)) {
					continue
				}
				if (
					child.key.inferredType.kind === 'literal'
					&& child.key.inferredType.value.kind === 'string'
				) {
					const existing = literalKvps.get(child.key.inferredType.value.value)
					if (existing) {
						// duplicate key
						existing.values.push({ pair: child, index: i })
					} else {
						literalKvps.set(child.key.inferredType.value.value, {
							values: [{ pair: child, index: i }],
							definition: undefined,
						})
					}
				} else {
					otherKvps.push({ value: child, index: i })
				}
			}

			for (const pair of typeDef.fields) {
				const otherKvpMatches: number[] = []
				let foundMatch = false
				if (pair.key.kind === 'literal' && pair.key.value.kind === 'string') {
					const runtimeChild = literalKvps.get(pair.key.value.value)
					if (runtimeChild) {
						foundMatch = true
						runtimeChild.definition = { keyType: pair.key, type: pair.type, desc: pair.desc }
					}
				}
				if (!foundMatch) {
					for (let i = 0; i < otherKvps.length; i++) {
						const kvp = otherKvps[i]
						if (
							isAssignable(
								kvp.value.key.inferredType,
								pair.key,
								ctx,
								ctx.isEquivalent,
							)
						) {
							foundMatch = true
							otherKvps.splice(i, 1)
							otherKvpMatches.push(kvp.index)
							i--
						}
					}
					for (const kvp of literalKvps.entries()) {
						if (
							!kvp[1].definition
							&& isAssignable(
								{ kind: 'literal', value: { kind: 'string', value: kvp[0] } },
								pair.key,
								ctx,
								ctx.isEquivalent,
							)
						) {
							foundMatch = true
							kvp[1].definition = { keyType: pair.key, type: pair.type, desc: pair.desc }
						}
					}
				}

				for (const match of otherKvpMatches) {
					childDefinitions[match] = { keyType: pair.key, type: pair.type, desc: pair.desc }
				}
				if (
					!foundMatch
					&& !ctx.allowMissingKeys
					&& pair.key.kind === 'literal'
					&& pair.key.value.kind === 'string'
					&& pair.optional !== true
				) {
					errors.push({ kind: 'missing_key', node: runtimeNode, keys: [pair.key.value.value] })
				}
			}

			for (const kvp of literalKvps.values()) {
				for (const value of kvp.values) {
					childDefinitions[value.index] = kvp.definition

					if (kvp.values.length > 1) {
						errors.push({ kind: 'duplicate_key', node: value.pair.key })
					}
				}
			}

			for (let i = 0; i < children.length; i++) {
				const childDef = childDefinitions[i]
				const child = children[i]
				if (childDef === undefined) {
					if (Array.isArray(child)) {
						// This should never happen
						errors.push(
							...child.map(v => ({
								kind: 'expected_key_value_pair' as 'expected_key_value_pair',
								node: v,
							})),
						)
					} else {
						errors.push({ kind: 'unknown_key', node: child.key })
					}
				}
			}
			break
		}
		case 'list':
		case 'byte_array':
		case 'int_array':
		case 'long_array': {
			let itemType: McdocType
			switch (typeDef.kind) {
				case 'list':
					itemType = typeDef.item
					break
				case 'byte_array':
					itemType = { kind: 'byte', valueRange: typeDef.valueRange }
					break
				case 'int_array':
					itemType = { kind: 'int', valueRange: typeDef.valueRange }
					break
				case 'long_array':
					itemType = { kind: 'long', valueRange: typeDef.valueRange }
					break
			}

			for (let i = 0; i < childDefinitions.length; i++) {
				childDefinitions[i] = { type: itemType }
			}

			if (typeDef.lengthRange && !NumericRange.isInRange(typeDef.lengthRange, children.length)) {
				errors.push({
					kind: 'invalid_collection_length',
					node: runtimeNode,
					ranges: [typeDef.lengthRange],
				})
			}
			break
		}
		case 'tuple': {
			for (let i = 0; i < children.length; i++) {
				const child = children[i]
				if (i < typeDef.items.length) {
					childDefinitions[i] = { type: typeDef.items[i] }
				} else {
					// This really should always be an array, just to handle this gracefully
					const values = Array.isArray(child) ? child : [...child.possibleValues, child.key]
					errors.push(
						...values.map(v => ({
							kind: 'unknown_tuple_element' as 'unknown_tuple_element',
							node: v,
						})),
					)
				}
			}

			if (typeDef.items.length > children.length) {
				errors.push({
					kind: 'invalid_collection_length',
					node: runtimeNode,
					ranges: [{ kind: 0b00, max: typeDef.items.length, min: typeDef.items.length }],
				})
			}
			break
		}
	}
	return { childDefinitions, errors }
}

export function getPossibleTypes(typeDef: McdocType): Exclude<McdocType, UnionType>[] {
	return typeDef.kind === 'union' ? typeDef.members.flatMap(m => getPossibleTypes(m)) : [typeDef]
}

interface SimplifyNode<T> {
	value:
		| SimplifyValueNode<T>
		| undefined
	/**
	 * This key facilitates the %key lookup. This key should always be a member of
	 * {@link value} and facilitates the `%key` lookup. This is the key of the member
	 * the dispatcher originates from, while {@link value} is the struct containing
	 * this key with a dispatcher associated with it.
	 */
	key: RuntimeNode<T> | undefined
}
/**
 * Basically the same as a {@link CheckerTreeRuntimeNode}, just with a few fields
 * that aren't needed here removed for simplicity.
 *
 * This means {@link CheckerTreeRuntimeNode} can be used in place of this type without
 * any conversions as this type is compatible with {@link CheckerTreeRuntimeNode}.
 */
export interface SimplifyValueNode<T> {
	entryNode: {
		parent: SimplifyValueNode<T> | undefined
		key: { runtimeValue: RuntimeNode<T> } | undefined
	}
	node: RuntimeNode<T>
}
export interface SimplifyContext<T> {
	node: SimplifyValueNode<T>
	ctx: McdocCheckerContext<T>
	isMember?: boolean
	typeArgs?: SimplifiedMcdocType[]
	typeMapping?: { [path: string]: SimplifiedMcdocType }
}
export function simplify<T>(
	typeDef: Exclude<McdocType, UnionType>,
	context: SimplifyContext<T>,
): SimplifiedMcdocTypeNoUnion
export function simplify<T>(typeDef: McdocType, context: SimplifyContext<T>): SimplifiedMcdocType
export function simplify<T>(typeDef: McdocType, context: SimplifyContext<T>): SimplifiedMcdocType {
	function wrap(typeDef: SimplifiedMcdocType) {
		if (!typeDef.attributes?.length) {
			return typeDef
		}
		handleAttributes(typeDef.attributes, context.ctx, (handler, config) => {
			if (handler.mapType) {
				typeDef = handler.mapType(config, typeDef, context.ctx)
			}
		})
		return typeDef
	}
	switch (typeDef.kind) {
		case 'reference':
			return wrap(simplifyReference(typeDef, context))
		case 'dispatcher':
			return wrap(simplifyDispatcher(typeDef, context))
		case 'indexed':
			return wrap(simplifyIndexed(typeDef, context))
		case 'union':
			return wrap(simplifyUnion(typeDef, context))
		case 'struct':
			return wrap(simplifyStruct(typeDef, context))
		case 'list':
			return wrap(simplifyList(typeDef, context))
		case 'tuple':
			return wrap(simplifyTuple(typeDef, context))
		case 'enum':
			return wrap(simplifyEnum(typeDef, context))
		case 'concrete':
			return wrap(simplifyConcrete(typeDef, context))
		case 'template':
			return wrap(simplifyTemplate(typeDef, context))
		case 'mapped':
			return wrap(simplifyMapped(typeDef, context))
		default:
			return wrap(typeDef)
	}
}

function simplifyReference<T>(
	typeDef: ReferenceType,
	context: SimplifyContext<T>,
): SimplifiedMcdocType {
	if (!typeDef.path) {
		// TODO when does this happen?
		context.ctx.logger.warn(`Tried to access empty reference`)
		return { kind: 'union', members: [] }
	}
	const mapped = context.typeMapping?.[typeDef.path]
	if (mapped) {
		return mapped
	}
	// TODO Probably need to keep original symbol around in some way to support "go to definition"
	const symbol = context.ctx.symbols.query(context.ctx.doc, 'mcdoc', typeDef.path)
	const def = symbol.getData(TypeDefSymbolData.is)?.typeDef
	if (!def) {
		context.ctx.logger.warn(`Tried to access unknown reference ${typeDef.path}`)
		return { kind: 'union', members: [] }
	}
	const simplifiedDef = simplify(def, context)
	if (typeDef.attributes?.length) {
		return {
			...simplifiedDef,
			attributes: [...typeDef.attributes, ...simplifiedDef.attributes ?? []],
		}
	}
	return simplifiedDef
}

function simplifyDispatcher<T>(
	typeDef: DispatcherType,
	context: SimplifyContext<T>,
): SimplifiedMcdocType {
	const dispatcher = context.ctx.symbols.query(
		context.ctx.doc,
		'mcdoc/dispatcher',
		typeDef.registry,
	).symbol
		?.members
	if (!dispatcher) {
		context.ctx.logger.warn(`Tried to access unknown dispatcher ${typeDef.registry}`)
		return { kind: 'union', members: [] }
	}
	const structFields: StructTypePairField[] = []
	for (const key in dispatcher) {
		const data = dispatcher[key].data
		if (TypeDefSymbolData.is(data)) {
			structFields.push({ kind: 'pair', key, type: data.typeDef })
		}
	}
	return simplifyIndexed({
		kind: 'indexed',
		parallelIndices: typeDef.parallelIndices,
		child: { kind: 'struct', fields: structFields },
	}, context)
}

function simplifyIndexed<T>(
	typeDef: IndexedType,
	context: SimplifyContext<T>,
): SimplifiedMcdocType {
	const child = simplify(typeDef.child, { ...context, typeArgs: [] })

	if (child.kind !== 'struct') {
		context.ctx.logger.warn(`Tried to index un-indexable type ${child.kind}`)
		return { kind: 'union', members: [] }
	}
	let values: McdocType[] = []

	for (const index of typeDef.parallelIndices) {
		let lookup: string[] = []
		if (index.kind === 'static') {
			// if (index.value === '%fallback') {
			// 	values = child.fields.filter(f => f.kind === 'pair').map(f => f.type)
			// 	break
			// }
			if (index.value.startsWith('minecraft:')) {
				lookup.push(index.value.substring(10))
			} else {
				lookup.push(index.value)
			}
		} else {
			let possibilities: SimplifyNode<T>[] = context.isMember
				? [{ value: context.node, key: context.node.entryNode.key?.runtimeValue }]
				: [{
					value: context.node.entryNode.parent,
					key: context.node.entryNode.key?.runtimeValue,
				}]
			for (const entry of index.accessor) {
				if (typeof entry !== 'string' && entry.keyword === 'parent') {
					possibilities = possibilities.map(n => ({
						value: n.value?.entryNode.parent,
						key: n.value?.entryNode.key?.runtimeValue,
					}))
				} else if (typeof entry !== 'string' && entry.keyword === 'key') {
					possibilities = possibilities.map(p => ({
						value: p.key
							? { node: p.key, entryNode: { parent: p.value, key: { runtimeValue: p.key } } }
							: undefined,
						key: undefined,
					}))
					break
				} else if (typeof entry === 'string') {
					const newPossibilities: SimplifyNode<T>[] = []
					for (const node of possibilities) {
						const possibleChildren: SimplifyNode<T>[] = node.value
							? (context.ctx.getChildren(
								node.value.node.originalNode,
								simplify(node.value.node.inferredType, { ...context, node: node.value }),
							).filter(child => {
								if (!Array.isArray(child)) {
									return child.key.inferredType.kind === 'literal'
										&& child.key.inferredType.value.kind === 'string'
										&& child.key.inferredType.value.value === entry
								}
								// TODO if it's a list, consider all list items.
								// This should probably work recursively if we have a list of lists.
								return false
							}) as RuntimePair<T>[]) // We don't consider arrays yet, see above.
								.flatMap(c =>
									c.possibleValues.map(v => ({
										value: {
											node: v,
											entryNode: { parent: node.value, key: { runtimeValue: c.key } },
										},
										key: undefined,
									}))
								)
							: [{ value: undefined, key: undefined }]
						newPossibilities.push(...possibleChildren)
					}
					possibilities = newPossibilities
				} else {
					lookup.push('%none')
					break
				}
			}
			for (const value of possibilities.map(p => p.value?.node)) {
				if (
					value?.inferredType.kind === 'literal' && value.inferredType.value.kind === 'string'
				) {
					const ans = value.inferredType.value.value
					if (ans.startsWith('minecraft:')) {
						lookup.push(ans.substring(10))
					} else {
						lookup.push(ans)
					}
				} else {
					lookup.push('%none')
				}
			}
		}

		if (lookup.length === 0) {
			lookup = ['%none']
		}

		const currentValues = lookup.map(v =>
			child.fields.find(f =>
				f.kind === 'pair' && f.key.kind === 'literal' && f.key.value.value === v
			)
				?? child.fields.find(f =>
					f.kind === 'pair' && f.key.kind === 'literal' && f.key.value.value === '%unknown'
				)
		)
		if (currentValues.includes(undefined)) {
			const fallbackDispatch = child.fields.find(f =>
				f.kind === 'pair' && f.key.kind === 'literal' && f.key.value.value === '%fallback'
			)

			if (fallbackDispatch) {
				values.push(fallbackDispatch.type)
			} else {
				// fallback case if a dispatch to `%fallback` is unavailable
				values = child.fields.filter(f => f.kind === 'pair').map(f => f.type)
				break	
			}
		} else {
			values.push(...currentValues.map(v => v!.type))
		}
	}
	return simplifyUnion({ kind: 'union', members: values }, context)
}

function simplifyUnion<T>(typeDef: UnionType, context: SimplifyContext<T>): SimplifiedMcdocType {
	const members: SimplifiedMcdocTypeNoUnion[] = []
	const filterCanonical = context.ctx.requireCanonical
		&& typeDef.members.some(m => m.attributes?.some(a => a.name === 'canonical'))
	for (const member of typeDef.members) {
		if (filterCanonical && !member.attributes?.some(a => a.name === 'canonical')) {
			continue
		}
		const simplified = simplify(member, context)
		let keep = true
		handleAttributes(member.attributes, context.ctx, (handler, config) => {
			if (!keep || !handler.filterElement) return
			if (!handler.filterElement(config, context.ctx)) {
				keep = false
			}
		})
		if (!keep) continue

		if (simplified.kind === 'union') {
			members.push(...simplified.members)
		} else {
			members.push(simplified)
		}
	}
	if (members.length === 1) {
		return members[0]
	}
	return { ...typeDef, kind: 'union', members }
}

function simplifyStruct<T>(typeDef: StructType, context: SimplifyContext<T>): SimplifiedStructType {
	const literalFields = new Map<string, StructTypePairField>()
	let complexFields: SimplifiedStructTypePairField[] = []

	function addField(key: string | SimplifiedMcdocType, field: StructTypePairField) {
		handleAttributes(field.attributes, context.ctx, (handler, config) => {
			if (handler.mapField) {
				field = handler.mapField(config, field, context.ctx)
			}
		})
		if (typeof key === 'string') {
			literalFields.set(key, field)
		} else if (key.kind === 'literal' && key.value.kind === 'string' && !key.attributes?.length) {
			literalFields.set(key.value.value, field)
		} else if (key.kind === 'union') {
			key.members.forEach(m => addField(m, { ...field, optional: true }))
		} else {
			// Only keep fields where the new key is not assignable to an existing field
			complexFields = complexFields.filter(other =>
				!McdocType.equals(
					key,
					typeof other.key === 'string'
						? { kind: 'literal', value: { kind: 'string', value: other.key } }
						: other.key,
				)
			)
			complexFields.push({ ...field, key })
		}
	}
	for (const field of typeDef.fields) {
		let keep = true
		handleAttributes(field.attributes, context.ctx, (handler, config) => {
			if (keep && handler.filterElement?.(config, context.ctx) === false) {
				keep = false
			}
		})
		if (!keep) {
			continue
		}
		if (field.kind === 'pair') {
			// Don't simplify the value here. We need to have the correct `node` and `parents`, which we
			// cannot deterministically find for non-string keys.
			// Instead, this method will be called by every struct child by the outer checking method.
			const structKey = typeof field.key === 'string'
				? field.key
				: simplify(field.key, { ...context, isMember: true, typeArgs: [] })
			const mappedField = context.typeMapping
				? {
					...field,
					type: {
						kind: 'mapped',
						child: field.type,
						mapping: context.typeMapping,
					} satisfies McdocType,
				}
				: field
			addField(structKey, mappedField)
		} else {
			// TODO: potential optimization: merge unions first before simplifying them,
			// to avoid having to simplify shared nested spread types multiple times
			const simplifiedSpreadType = simplify(field.type, {
				...context,
				isMember: true,
				typeArgs: [],
			})
			if (simplifiedSpreadType.kind === 'struct') {
				for (const field of simplifiedSpreadType.fields) {
					addField(field.key, field)
				}
			} else if (simplifiedSpreadType.kind === 'union') {
				for (const member of simplifiedSpreadType.members) {
					if (member.kind === 'struct') {
						for (const field of member.fields) {
							// TODO: technically, if a field is required in all members of
							// this union, it could be added as a required field
							addField(field.key, { ...field, optional: true })
						}
					}
				}
			}
			// Silently ignore spreading non-struct types
		}
	}
	// Literal fields may still be assignable to complex fields,
	// however this is currently not seen as an issue
	return {
		kind: 'struct',
		fields: [
			...complexFields,
			...[...literalFields.entries()].map(([key, field]) => ({
				...field,
				key: { kind: 'literal', value: { kind: 'string', value: key } } as const,
			})),
		],
	}
}

function simplifyList<T>(typeDef: ListType, context: SimplifyContext<T>): ListType {
	if (!context.typeMapping) {
		return typeDef
	}
	return {
		...typeDef,
		item: { kind: 'mapped', child: typeDef.item, mapping: context.typeMapping },
	}
}

function simplifyTuple<T>(typeDef: TupleType, context: SimplifyContext<T>): TupleType {
	if (!context.typeMapping) {
		return typeDef
	}
	return {
		...typeDef,
		items: typeDef.items.map(item => ({
			kind: 'mapped',
			child: item,
			mapping: context.typeMapping!,
		})),
	}
}

function simplifyEnum<T>(typeDef: EnumType, context: SimplifyContext<T>): SimplifiedEnum {
	const filteredValues = typeDef.values.filter(value => {
		let keep = true
		handleAttributes(value.attributes, context.ctx, (handler, config) => {
			if (!keep || !handler.filterElement) return
			if (!handler.filterElement(config, context.ctx)) {
				keep = false
			}
		})
		return keep
	})
	return { ...typeDef, enumKind: typeDef.enumKind ?? 'int', values: filteredValues }
}

function simplifyConcrete<T>(
	typeDef: ConcreteType,
	context: SimplifyContext<T>,
): SimplifiedMcdocType {
	const simplifiedArgs = typeDef.typeArgs.map(arg => simplify(arg, context))
	return simplify(typeDef.child, { ...context, typeArgs: simplifiedArgs })
}

function simplifyTemplate<T>(
	typeDef: TemplateType,
	context: SimplifyContext<T>,
): SimplifiedMcdocType {
	if (context.typeArgs?.length !== typeDef.typeParams.length) {
		context.ctx.logger.warn(
			`Expected ${typeDef.typeParams.length} mcdoc type args for ${
				McdocType.toString(typeDef.child)
			}, but got ${context.typeArgs?.length ?? 0}`,
		)
	}
	const mapping = Object.fromEntries(typeDef.typeParams.map((param, i) => {
		const arg = context.typeArgs?.[i] ?? { kind: 'union', members: [] }
		return [param.path, arg]
	}))
	return simplify(typeDef.child, { ...context, typeArgs: [], typeMapping: mapping })
}

function simplifyMapped<T>(typeDef: MappedType, context: SimplifyContext<T>): SimplifiedMcdocType {
	// Mapped types that were created in simplify are always simplified
	// types already, in which case this will be a cheap operation, but
	// this is necessary for type safety
	const simplifiedMapping = Object.fromEntries(
		Object.entries(typeDef.mapping).map(([path, param]) => {
			return [path, simplify(param, context)]
		}),
	)
	return simplify(typeDef.child, { ...context, typeMapping: simplifiedMapping })
}

function getValueType(
	type: SimplifiedMcdocTypeNoUnion,
): Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType>
function getValueType(
	type: SimplifiedMcdocTypeNoUnion | SimplifiedStructTypePairField,
): Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType> | SimplifiedStructTypePairField
function getValueType(
	type: SimplifiedMcdocTypeNoUnion | SimplifiedStructTypePairField,
): Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType> | SimplifiedStructTypePairField {
	switch (type.kind) {
		case 'literal':
			return { kind: type.value.kind }
		case 'enum':
			return { kind: type.enumKind }
		default:
			return type
	}
}
