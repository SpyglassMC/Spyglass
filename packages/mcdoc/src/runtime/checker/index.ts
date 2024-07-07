import { Range, Source } from '@spyglassmc/core'
import type { CheckerContext, FullResourceLocation, SymbolQuery } from '@spyglassmc/core'
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
	LongType,
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
import type { ErrorCondensingDefinition, McdocRuntimeError } from './error.js'
import { condenseAndPropagate } from './error.js'

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
	| LongType
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
		runtimeKey: undefined,
		possibleValues: [],
	}
	node.possibleValues = getPossibleTypes(typeDef).map(v => ({
		entryNode: node,
		node: { originalNode: v, inferredType: v },
		children: [],
		definitionsByParent: [],
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

	runtimeKey: RuntimeNode<T> | undefined
	possibleValues: CheckerTreeRuntimeNode<T>[]
}

export interface CheckerTreeRuntimeNode<T> {
	entryNode: CheckerTreeNode<T>
	children: CheckerTreeNode<T>[]
	node: RuntimeNode<T>

	definitionsByParent: CheckerTreeDefinitionGroupNode<T>[]
}

export interface CheckerTreeDefinitionGroupNode<T> {
	parents: CheckerTreeDefinitionNode<T>[]
	runtimeNode: CheckerTreeRuntimeNode<T>
	condensedErrors: McdocRuntimeError<T>[][]

	desc?: string
	keyDefinition: SimplifiedMcdocTypeNoUnion | undefined
	originalTypeDef: McdocType
	validDefinitions: CheckerTreeDefinitionNode<T>[]
}

export interface CheckerTreeDefinitionNode<T> {
	groupNode: CheckerTreeDefinitionGroupNode<T>
	typeDef: SimplifiedMcdocTypeNoUnion
	children: CheckerTreeDefinitionGroupNode<T>[]
}

export function typeDefinition<T>(
	runtimeValues: RuntimeNode<T>[],
	typeDef: McdocType,
	ctx: McdocCheckerContext<T>,
) {
	const rootNode: CheckerTreeNode<T> = {
		parent: undefined,
		runtimeKey: undefined,
		possibleValues: [],
	}
	rootNode.possibleValues = runtimeValues.map(n => ({
		node: n,
		entryNode: rootNode,
		definitionsByParent: [],
		children: [],
	}))
	for (const value of rootNode.possibleValues) {
		const simplifiedRoot = simplify(typeDef, { ctx, node: value }).typeDef
		const validRootDefinitions = simplifiedRoot.kind === 'union'
			? simplifiedRoot.members
			: [simplifiedRoot]
		value.definitionsByParent = [{
			parents: [],
			keyDefinition: undefined,
			runtimeNode: value,
			originalTypeDef: typeDef,
			condensedErrors: [],
			validDefinitions: [],
		}]
		value.definitionsByParent[0].validDefinitions = validRootDefinitions.map(d => ({
			groupNode: value.definitionsByParent[0],
			typeDef: d,
			children: [],
		}))
	}
	const nodeQueue: CheckerTreeNode<T>[] = [rootNode]

	while (nodeQueue.length !== 0) {
		const node = nodeQueue.shift()!

		for (const value of node.possibleValues) {
			const inferredSimplified = simplify(value.node.inferredType, { ctx, node: value }).typeDef
			const children = ctx.getChildren(value.node.originalNode, inferredSimplified)
			const childNodes = children.map(c => {
				const ans: CheckerTreeNode<T> = {
					parent: value,
					runtimeKey: !Array.isArray(c) ? c.key : undefined,
					possibleValues: [],
				}

				ans.possibleValues = (Array.isArray(c) ? c : c.possibleValues).map(v => ({
					entryNode: ans,
					node: v,
					definitionsByParent: [],
					condensedErrors: [],
					children: [],
				}))

				return ans
			})

			for (const definitionGroup of value.definitionsByParent) {
				const definitionErrors: ErrorCondensingDefinition<T>[] = []

				if (definitionGroup.validDefinitions.length === 0) {
					// nothing can be assigned to an empty union
					definitionGroup.condensedErrors = [[{
						kind: 'type_mismatch',
						node: value.node,
						expected: [],
					}]]
				}

				for (const def of definitionGroup.validDefinitions) {
					const { errors, childDefinitions } = checkShallowly(
						value.node,
						inferredSimplified,
						children,
						def.typeDef,
						ctx,
					)
					definitionErrors.push({ definition: def, errors })
					for (let i = 0; i < childDefinitions.length; i++) {
						const childDef = childDefinitions[i]
						if (!childDef) {
							continue
						}
						const child = childNodes[i]
						const existingDef = child.possibleValues.length > 0
							? child.possibleValues[0].definitionsByParent
								.find(
									d =>
										(d.keyDefinition === undefined || childDef.keyType === undefined
											? d.keyDefinition === undefined
											: McdocType.equals(d.keyDefinition, childDef.keyType))
										&& McdocType.equals(d.originalTypeDef, childDef.type),
								)
							: undefined

						for (const childValue of child.possibleValues) {
							if (existingDef) {
								existingDef.parents.push(def)
								def.children.push(existingDef)
								continue
							}
							// TODO We need some sort of map / local cache which keeps track of the original
							// non-simplified types and see if they have been compared yet. This is needed
							// for structures that are cyclic, to essentially bail out once we are comparing
							// the same types again and just collect the errors of the lower depth.
							// This will currently lead to a stack overflow error when e.g. comparing two
							// text component definitions
							const simplified = simplify(childDef.type, { ctx, node: childValue }).typeDef
							const childDefinitionGroup: CheckerTreeDefinitionGroupNode<T> = {
								parents: [def],
								runtimeNode: childValue,
								keyDefinition: childDef.keyType,
								originalTypeDef: childDef.type,
								validDefinitions: [],
								condensedErrors: [],
								desc: childDef.desc,
							}
							childDefinitionGroup.validDefinitions =
								(simplified.kind === 'union' ? simplified.members : [simplified])
									.map(
										d => ({
											groupNode: childDefinitionGroup,
											typeDef: d,
											children: [],
										}),
									)
							childValue.definitionsByParent.push(childDefinitionGroup)
							def.children.push(childDefinitionGroup)
						}
					}
				}

				condenseAndPropagate(definitionGroup, definitionErrors)
			}
			value.children = childNodes
			nodeQueue.push(...childNodes)
		}
	}

	if (ctx.attachTypeInfo) {
		for (const node of rootNode.possibleValues) {
			attachTypeInfo(node, ctx)
		}
	}

	for (
		const error of rootNode.possibleValues
			.flatMap(v => v.definitionsByParent)
			.flatMap(d => d.condensedErrors)
			.flat()
	) {
		if (error) {
			ctx.reportError(error)
		}
	}
}

function attachTypeInfo<T>(node: CheckerTreeRuntimeNode<T>, ctx: McdocCheckerContext<T>) {
	const definitions = node.definitionsByParent.flatMap(d => d.validDefinitions)
	if (definitions.length === 1) {
		const { typeDef, groupNode } = definitions[0]
		ctx.attachTypeInfo?.(node.node.originalNode, typeDef, groupNode.desc)
		handleNodeAttachers(node.node, typeDef, ctx)

		if (node.entryNode.runtimeKey && groupNode.keyDefinition) {
			ctx.attachTypeInfo?.(
				node.entryNode.runtimeKey.originalNode,
				groupNode.keyDefinition,
				groupNode.desc,
			)
			handleNodeAttachers(node.entryNode.runtimeKey, groupNode.keyDefinition, ctx)
		}
	} else if (definitions.length > 1) {
		ctx.attachTypeInfo?.(node.node.originalNode, {
			kind: 'union',
			members: definitions.map(d => d.typeDef),
		})

		if (node.entryNode.runtimeKey) {
			ctx.attachTypeInfo?.(node.entryNode.runtimeKey.originalNode, {
				kind: 'union',
				members: node.definitionsByParent
					.map(d => d.keyDefinition)
					.filter((d): d is SimplifiedMcdocTypeNoUnion => d !== undefined),
			})
		}
		// when there are multiple valid definitions, we don't run any string parsers.
	}
	for (const child of node.children.flatMap(c => c.possibleValues)) {
		attachTypeInfo(child, ctx)
	}
}

function handleNodeAttachers<T>(
	runtimeValue: RuntimeNode<T>,
	typeDef: SimplifiedMcdocTypeNoUnion,
	ctx: McdocCheckerContext<T>,
) {
	const { nodeAttacher, stringAttacher } = ctx
	if (!nodeAttacher && !stringAttacher) {
		return
	}
	handleAttributes(typeDef.attributes, ctx, (handler, config) => {
		const parser = handler.stringParser?.(config, typeDef, ctx)
		if (parser && stringAttacher) {
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
		}
		const checker = handler.checker?.(config, runtimeValue.inferredType, ctx)
		if (checker && nodeAttacher) {
			nodeAttacher(runtimeValue.originalNode, (node) => {
				checker(node, ctx)
			})
		}
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
	const childDefinitions = Array<ShallowCheckResultChildDefinition | undefined>(children.length)
		.fill(undefined)

	if (
		typeDef.kind === 'any' || typeDef.kind === 'unsafe' || simplifiedInferred.kind === 'unsafe'
	) {
		return { childDefinitions, errors: [] }
	}

	const typeDefValueType = getValueType(typeDef)
	const runtimeValueType = getValueType(simplifiedInferred)

	if (
		runtimeValueType.kind !== typeDefValueType.kind
		&& !ctx.isEquivalent(runtimeValueType, typeDefValueType)
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
		case 'byte':
		case 'short':
		case 'int':
		case 'long':
		case 'float':
		case 'double':
			if (
				typeDef.valueRange
				&& simplifiedInferred.kind === 'literal'
				&& simplifiedInferred.value.kind !== 'string'
				&& simplifiedInferred.value.kind !== 'boolean'
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
			const missingKeys = new Set<string>()

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
					for (const kvp of otherKvps) {
						if (
							isAssignable(
								kvp.value.key.inferredType,
								pair.key,
								ctx,
								ctx.isEquivalent,
							)
						) {
							foundMatch = true
							otherKvpMatches.push(kvp.index)
						}
					}
					for (const kvp of literalKvps.entries()) {
						if (
							(!kvp[1].definition || kvp[1].definition.keyType?.kind !== 'literal')
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
					missingKeys.add(pair.key.value.value)
				}
			}

			errors.push(
				...Array.from(missingKeys).map(key => ({
					kind: 'missing_key' as const,
					node: runtimeNode,
					keys: [key],
				})),
			)

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
								kind: 'expected_key_value_pair' as const,
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
							kind: 'unknown_tuple_element' as const,
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
		runtimeKey: RuntimeNode<T> | undefined
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
export interface SimplifyResult<T extends SimplifiedMcdocType> {
	typeDef: T
	dynamicData?: boolean
}
export function simplify<T>(
	typeDef: Exclude<McdocType, UnionType>,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocTypeNoUnion>
export function simplify<T>(
	typeDef: McdocType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType>
export function simplify<T>(
	typeDef: McdocType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	function wrap(result: SimplifyResult<SimplifiedMcdocType>) {
		if (!result.typeDef.attributes?.length) {
			return result
		}
		handleAttributes(typeDef.attributes, context.ctx, (handler, config) => {
			if (handler.mapType) {
				result.typeDef = handler.mapType(config, result.typeDef, context.ctx)
			}
		})
		return result
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
			return wrap({ typeDef })
	}
}

function simplifyReference<T>(
	typeDef: ReferenceType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	if (!typeDef.path) {
		// TODO when does this happen?
		context.ctx.logger.warn(`Tried to access empty reference`)
		return { typeDef: { kind: 'union', members: [] } }
	}
	const mapped = context.typeMapping?.[typeDef.path]
	if (mapped) {
		return { typeDef: mapped }
	}
	// TODO Probably need to keep original symbol around in some way to support "go to definition"
	const symbol = context.ctx.symbols.query(context.ctx.doc, 'mcdoc', typeDef.path)
	const data = symbol.getData(TypeDefSymbolData.is)
	if (!data?.typeDef) {
		context.ctx.logger.warn(`Tried to access unknown reference ${typeDef.path}`)
		return { typeDef: { kind: 'union', members: [] } }
	}
	if (data.simplifiedTypeDef) {
		return { typeDef: data.simplifiedTypeDef }
	}
	const simplifiedResult = simplify(data.typeDef, context)
	if (typeDef.attributes?.length) {
		simplifiedResult.typeDef = {
			...simplifiedResult.typeDef,
			attributes: [...typeDef.attributes, ...simplifiedResult.typeDef.attributes ?? []],
		}
	}
	if (!simplifiedResult.dynamicData) {
		symbol.amend({
			data: {
				data: {
					...data,
					simplifiedTypeDef: simplifiedResult.typeDef,
				} satisfies TypeDefSymbolData,
			},
		})
	}
	return simplifiedResult
}

function simplifyDispatcher<T>(
	typeDef: DispatcherType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	const dispatcherQuery = context.ctx.symbols.query(
		context.ctx.doc,
		'mcdoc/dispatcher',
		typeDef.registry,
	)
	const dispatcher = dispatcherQuery.symbol?.members
	if (!dispatcher) {
		context.ctx.logger.warn(`Tried to access unknown dispatcher ${typeDef.registry}`)
		return { typeDef: { kind: 'union', members: [] } }
	}
	const result = resolveIndices<T>(typeDef.parallelIndices, dispatcher, dispatcherQuery, context)
	return result
}

function simplifyIndexed<T>(
	typeDef: IndexedType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	const childResult = simplify(typeDef.child, {
		...context,
		typeArgs: [],
	})
	const child = childResult.typeDef

	if (child.kind !== 'struct') {
		context.ctx.logger.warn(`Tried to index un-indexable type ${child.kind}`)
		return { typeDef: { kind: 'union', members: [] }, dynamicData: childResult.dynamicData }
	}

	const symbolMap: { [key: string]: { data?: unknown } } = {}
	for (const field of child.fields) {
		if (field.key.kind === 'literal' && field.key.value.kind === 'string') {
			symbolMap[field.key.value.value] = {
				data: {
					typeDef: field.type,
				} satisfies TypeDefSymbolData,
			}
		}
	}

	const simplified = resolveIndices(typeDef.parallelIndices, symbolMap, undefined, context)
	return { ...simplified, dynamicData: childResult.dynamicData ?? simplified.dynamicData }
}

function resolveIndices<T>(
	parallelIndices: ParallelIndices,
	symbolMap: { [key: string]: { data?: unknown } },
	symbolQuery: SymbolQuery | undefined,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	let dynamicData = false
	let values: SimplifiedMcdocTypeNoUnion[] = []
	function pushValue(key: string, data: TypeDefSymbolData) {
		if (data.simplifiedTypeDef) {
			if (data.simplifiedTypeDef.kind === 'union') {
				values.push(...data.simplifiedTypeDef.members)
			} else {
				values.push(data.simplifiedTypeDef)
			}
		} else {
			const simplifiedResult = simplify(data.typeDef, context)
			if (simplifiedResult.dynamicData) {
				dynamicData = true
			} else if (symbolQuery) {
				symbolQuery.member(
					key,
					s =>
						s.amend({
							data: { data: { ...data, simplifiedTypeDef: simplifiedResult.typeDef } },
						}),
				)
			}
			if (simplifiedResult.typeDef.kind === 'union') {
				values.push(...simplifiedResult.typeDef.members)
			} else {
				values.push(simplifiedResult.typeDef)
			}
		}
	}

	let unkownTypeDef: TypeDefSymbolData | undefined | false = false
	function getUnknownTypeDef() {
		if (unkownTypeDef === false) {
			const data = symbolMap['%unknown']?.data
			unkownTypeDef = TypeDefSymbolData.is(data) ? data : undefined
		}
		return unkownTypeDef
	}

	for (const index of parallelIndices) {
		let lookup: string[] = []
		if (index.kind === 'static') {
			if (index.value === '%fallback') {
				values = []
				for (const [key, value] of Object.entries(symbolMap)) {
					if (TypeDefSymbolData.is(value.data)) {
						pushValue(key, value.data)
					}
				}
				break
			}
			if (index.value.startsWith('minecraft:')) {
				lookup.push(index.value.substring(10))
			} else {
				lookup.push(index.value)
			}
		} else {
			dynamicData = true
			let possibilities: SimplifyNode<T>[] = context.isMember
				? [{ value: context.node, key: context.node.entryNode.runtimeKey }]
				: [{
					value: context.node.entryNode.parent,
					key: context.node.entryNode.runtimeKey,
				}]
			for (const entry of index.accessor) {
				if (typeof entry !== 'string' && entry.keyword === 'parent') {
					possibilities = possibilities.map(n => ({
						value: n.value?.entryNode.parent,
						key: n.value?.entryNode.runtimeKey,
					}))
				} else if (typeof entry !== 'string' && entry.keyword === 'key') {
					possibilities = possibilities.map(p => ({
						value: p.key
							? { node: p.key, entryNode: { parent: p.value, runtimeKey: p.key } }
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
								simplify(node.value.node.inferredType, { ...context, node: node.value })
									.typeDef,
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
											entryNode: { parent: node.value, runtimeKey: c.key },
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

		const currentValues = lookup.map(v => {
			const data = symbolMap[v]?.data
			return { value: v, data: TypeDefSymbolData.is(data) ? data : getUnknownTypeDef() }
		})
		const missing = currentValues.find(v => !v.data)
		if (missing) {
			// fallback case
			return { typeDef: { kind: 'any' }, dynamicData }
		} else {
			for (const entry of currentValues) {
				pushValue(entry.value, entry.data!)
			}
		}
	}

	if (values.length === 1) {
		return { typeDef: values[0], dynamicData }
	}
	return { typeDef: { kind: 'union', members: values }, dynamicData }
}

function simplifyUnion<T>(
	typeDef: UnionType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	let dynamicData = false
	const filterCanonical = context.ctx.requireCanonical
		&& typeDef.members.some(m => m.attributes?.some(a => a.name === 'canonical'))

	const validMembers = typeDef.members
		.filter(member => {
			if (filterCanonical && !member.attributes?.some(a => a.name === 'canonical')) {
				return false
			}
			let keep = true
			handleAttributes(member.attributes, context.ctx, (handler, config) => {
				if (!keep || !handler.filterElement) {
					return
				}
				if (!handler.filterElement(config, context.ctx)) {
					keep = false
				}
			})
			return keep
		})

	if (validMembers.length === 1) {
		return simplify(validMembers[0], context)
	}

	const members: SimplifiedMcdocTypeNoUnion[] = []
	for (const member of validMembers) {
		const { typeDef: simplified, dynamicData: memberDynamid } = simplify(member, context)
		if (memberDynamid) {
			dynamicData = true
		}
		if (simplified.kind === 'union') {
			members.push(...simplified.members)
		} else {
			members.push(simplified)
		}
	}

	if (members.length === 1) {
		return { typeDef: members[0], dynamicData }
	}
	return { typeDef: { kind: 'union', members }, dynamicData }
}

function simplifyStruct<T>(
	typeDef: StructType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	const fields: SimplifiedStructTypePairField[] = []
	let dynamicData = false
	function addField(
		key: SimplifiedMcdocType | string,
		field: StructTypePairField,
	) {
		handleAttributes(field.attributes, context.ctx, (handler, config) => {
			if (handler.mapField) {
				field = handler.mapField(config, field, context.ctx)
			}
		})

		if (typeof key === 'string') {
			fields.push({
				...field,
				key: { kind: 'literal', value: { kind: 'string', value: key } },
			})
		} else if (key.kind === 'union') {
			key.members.forEach(m => addField(m, { ...field, optional: true }))
		} else {
			fields.push({ ...field, key })
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
			// Don't simplify the value here, simplify is shallow and needs a runtime value to work
			// properly, so the values should only be simplified once they were assigned to a
			// runtime value.
			let structKey: string | SimplifiedMcdocType
			if (typeof field.key === 'string') {
				structKey = field.key
			} else {
				const simplifiedKeyResult = simplify(field.key, {
					...context,
					isMember: true,
					typeArgs: [],
				})
				if (simplifiedKeyResult.dynamicData) {
					dynamicData = true
				}
				structKey = simplifiedKeyResult.typeDef
			}
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
			const simplifiedSpread = simplify(field.type, {
				...context,
				isMember: true,
				typeArgs: [],
			})
			if (simplifiedSpread.dynamicData) {
				dynamicData = true
			}
			if (simplifiedSpread.typeDef.kind === 'any') {
				fields.push({ kind: 'pair', key: { kind: 'any' }, type: { kind: 'any' } })
			} else if (simplifiedSpread.typeDef.kind === 'struct') {
				fields.push(...simplifiedSpread.typeDef.fields)
			}
		}
	}

	return {
		typeDef: { kind: 'struct', fields },
		dynamicData,
	}
}

function simplifyList<T>(typeDef: ListType, context: SimplifyContext<T>): SimplifyResult<ListType> {
	if (!context.typeMapping) {
		return { typeDef }
	}
	return {
		typeDef: {
			...typeDef,
			item: { kind: 'mapped', child: typeDef.item, mapping: context.typeMapping },
		},
	}
}

function simplifyTuple<T>(
	typeDef: TupleType,
	context: SimplifyContext<T>,
): SimplifyResult<TupleType> {
	if (!context.typeMapping) {
		return { typeDef }
	}
	return {
		typeDef: {
			...typeDef,
			items: typeDef.items.map(item => ({
				kind: 'mapped',
				child: item,
				mapping: context.typeMapping!,
			})),
		},
	}
}

function simplifyEnum<T>(
	typeDef: EnumType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedEnum> {
	const filteredValues = typeDef.values.filter(value => {
		let keep = true
		handleAttributes(value.attributes, context.ctx, (handler, config) => {
			if (!keep || !handler.filterElement) {
				return
			}
			if (!handler.filterElement(config, context.ctx)) {
				keep = false
			}
		})
		return keep
	})
	return { typeDef: { ...typeDef, enumKind: typeDef.enumKind ?? 'int', values: filteredValues } }
}

function simplifyConcrete<T>(
	typeDef: ConcreteType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	let dynamicData = false
	const simplifiedArgs = typeDef.typeArgs.map(arg => {
		const ans = simplify(arg, context)
		if (ans.dynamicData) {
			dynamicData = true
		}
		return ans.typeDef
	})
	const result = simplify(typeDef.child, { ...context, typeArgs: simplifiedArgs })
	return { typeDef: result.typeDef, dynamicData: dynamicData || result.dynamicData }
}

function simplifyTemplate<T>(
	typeDef: TemplateType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
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

function simplifyMapped<T>(
	typeDef: MappedType,
	context: SimplifyContext<T>,
): SimplifyResult<SimplifiedMcdocType> {
	let dynamicData = false
	// Mapped types that were created in simplify are always simplified
	// types already, in which case this will be a cheap operation, but
	// this is necessary for type safety
	const simplifiedMapping = Object.fromEntries(
		Object.entries(typeDef.mapping).map(([path, param]) => {
			const ans = simplify(param, context)
			if (ans.dynamicData) {
				dynamicData = true
			}
			return [path, ans.typeDef]
		}),
	)
	const ans = simplify(typeDef.child, { ...context, typeMapping: simplifiedMapping })
	return { typeDef: ans.typeDef, dynamicData: dynamicData || ans.dynamicData }
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
