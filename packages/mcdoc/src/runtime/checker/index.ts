import {
	type CheckerContext,
	ErrorSeverity,
	type FullResourceLocation,
	type Range,
} from '@spyglassmc/core'
import { arrayToMessage, localeQuote, localize } from '@spyglassmc/locales'
import { TypeDefSymbolData } from '../../binder/index.js'
import { type EnumKind, RangeKind } from '../../node/index.js'
import type {
	Attribute,
	EnumType,
	Index,
	KeywordType,
	ListType,
	LiteralType,
	NumericType,
	ParallelIndices,
	PrimitiveArrayType,
	StringType,
	StructType,
	StructTypePairField,
	TupleType,
	UnionType,
} from '../../type/index.js'
import { McdocType, NumericRange } from '../../type/index.js'

export type NodeEquivalenceChecker = (
	inferredNode: Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType>,
	definition: Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType>,
) => boolean

export type TypeInfoAttacher<T> = (
	node: T,
	definition: SimplifiedMcdocType,
) => void

export type ChildrenGetter<T> = (
	node: T,
	simplified: SimplifiedMcdocTypeNoUnion,
) => RuntimeUnion<T>[]

export type ErrorReporter<T> = (error: McdocCheckerError<T>) => void

export type RuntimeUnion<T> = RuntimeNode<T>[] | RuntimePair<T>

export interface RuntimeNode<T> {
	originalNode: T
	inferredType: Exclude<McdocType, UnionType>
}
export interface RuntimePair<T> {
	attributes?: Attribute[]
	key: RuntimeNode<T>
	possibleValues: RuntimeNode<T>[]
}

export interface McdocCheckerOptions<T> {
	context: CheckerContext
	isEquivalent: NodeEquivalenceChecker
	getChildren: ChildrenGetter<T>
	reportError: ErrorReporter<T>
	attachTypeInfo: TypeInfoAttacher<T>
}

export type McdocCheckerError<T> =
	| SimpleError<T>
	| UnknownVariantWithKeyCombinationError<T>
	| UnknownTupleElementError<T>
	| RangeError<T>
	| TypeMismatchError<T>
	| MissingKeyError<T>
export interface SimpleError<T> {
	kind:
		| 'unknown_key'
		| 'duplicate_key'
		| 'some_missing_keys'
		| 'sometimes_type_mismatch'
		| 'expected_key_value_pair'
	node: RuntimeNode<T>
}
export interface UnknownVariantWithKeyCombinationError<T> {
	kind: 'invalid_key_combination'
	node: RuntimeNode<T>[]
}
export interface UnknownTupleElementError<T> {
	kind: 'unknown_tuple_element'
	node: RuntimeUnion<T>
}
export interface RangeError<T> {
	kind: 'invalid_collection_length' | 'number_out_of_range'
	node: RuntimeNode<T>
	ranges: NumericRange[]
}
export interface MissingKeyError<T> {
	kind: 'missing_key'
	node: RuntimeNode<T>
	key: McdocType
}
export interface TypeMismatchError<T> {
	node: RuntimeNode<T>
	kind: 'type_mismatch'
	expected: SimplifiedMcdocType
}

export type SimplifiedMcdocType =
	| SimplifiedMcdocTypeNoUnion
	| UnionType<SimplifiedMcdocTypeNoUnion>

type SimplifiedMcdocTypeNoUnion =
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

const attributeHandlers: {
	[key: string]:
		| (<N>(
			node: N,
			attribute: Attribute,
			inferred: SimplifiedMcdocTypeNoUnion | SimplifiedStructTypePairField,
			expected: SimplifiedMcdocTypeNoUnion | SimplifiedStructTypePairField,
			options: McdocCheckerOptions<N>,
		) => McdocCheckerError<N>[])
		| undefined
} = {
	// TODO other attributes
	// TODO might need different interface, see https://discord.com/channels/666020457568403505/666037123450929163/1240827428452958209
	id: (_n, attribute, inferred, _e, options) => {
		if (inferred.kind === 'literal' && inferred.value.kind === 'string') {
			// TODO check registry
			if (!inferred.value.value.includes(':')) {
				inferred.value.value = 'minecraft:' + inferred.value.value
			}
		}
		return []
	},
}

export function reference<T>(
	node: RuntimeNode<T>[],
	path: string,
	options: McdocCheckerOptions<T>,
) {
	typeDefinition(node, { kind: 'reference', path: path }, options)
}

export function dispatcher<T>(
	node: RuntimeNode<T>[],
	registry: FullResourceLocation,
	index: string | Index | ParallelIndices,
	options: McdocCheckerOptions<T>,
) {
	const parallelIndices: ParallelIndices = typeof index === 'string'
		? [{ kind: 'static', value: index }]
		: Array.isArray(index)
		? index
		: [index]
	typeDefinition(node, {
		kind: 'dispatcher',
		registry: registry,
		parallelIndices: parallelIndices,
	}, options)
}

export function isAssignable(
	assignValue: McdocType,
	typeDef: McdocType,
	ctx: CheckerContext,
	isEquivalent?: NodeEquivalenceChecker,
): boolean {
	let ans = true
	const options: McdocCheckerOptions<McdocType> = {
		context: ctx,
		isEquivalent: isEquivalent ? isEquivalent : () => false,
		getChildren: (_, d) => {
			switch (d.kind) {
				case 'list':
					const vals = getPossibleTypes(d.item)
					return [vals.map(v => ({ originalNode: v, inferredType: v }))]
				case 'byte_array':
					return [[{
						originalNode: { kind: 'byte' },
						inferredType: { kind: 'byte' },
					}]]
				case 'int_array':
					return [[{
						originalNode: { kind: 'int' },
						inferredType: { kind: 'int' },
					}]]
				case 'long_array':
					return [[{
						originalNode: { kind: 'long' },
						inferredType: { kind: 'long' },
					}]]
				case 'struct':
					return d.fields.map(f => {
						const vals = getPossibleTypes(f.type)
						return {
							attributes: f.attributes,
							key: { originalNode: f.key, inferredType: f.key },
							possibleValues: vals.map(v => ({
								originalNode: v,
								inferredType: v,
							})),
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
		reportError: () => ans = false,
		attachTypeInfo: () => {},
	}

	const node: CheckerTreeNode<McdocType> = {
		parent: undefined,
		runtimeKey: undefined,
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
		getPossibleTypes(assignValue).map(v => ({
			originalNode: v,
			inferredType: v,
		})),
		typeDef,
		options,
	)

	return ans
}

interface CheckerTreeNode<T> {
	parent: CheckerTreeRuntimeNode<T> | undefined

	runtimeKey: RuntimeNode<T> | undefined
	possibleValues: CheckerTreeRuntimeNode<T>[]
}

interface CheckerTreeError<T> {
	error: McdocCheckerError<T>
	definitionNode: CheckerTreeDefinitionNode<T> | undefined
}

interface CheckerTreeRuntimeNode<T> {
	entryNode: CheckerTreeNode<T>
	children: CheckerTreeNode<T>[]
	node: RuntimeNode<T>

	condensedErrors: CheckerTreeError<T>[][]
	validDefinitions: CheckerTreeDefinitionNode<T>[]
}

interface CheckerTreeDefinitionNode<T> {
	parent: CheckerTreeDefinitionNode<T> | undefined
	runtimeNode: CheckerTreeRuntimeNode<T>
	typeDef: SimplifiedMcdocTypeNoUnion
}

export function typeDefinition<T>(
	runtimeValues: RuntimeNode<T>[],
	typeDef: McdocType,
	options: McdocCheckerOptions<T>,
) {
	const rootNode: CheckerTreeNode<T> = {
		parent: undefined,
		runtimeKey: undefined,
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
		const simplifiedRoot = simplify(typeDef, value, options)
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
			const inferredSimplified = simplify(
				value.node.inferredType,
				value,
				options,
			)
			const children = options.getChildren(
				value.node.originalNode,
				inferredSimplified,
			)
			const childNodes: CheckerTreeNode<T>[] = children.map(c => {
				const ans: CheckerTreeNode<T> = {
					parent: value,
					runtimeKey: !Array.isArray(c) ? c.key : undefined,
					possibleValues: [],
				}

				ans.possibleValues = (Array.isArray(c) ? c : c.possibleValues)
					.map(v => ({
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
					options,
				)
				encounterdErrors.push(
					...errors.map(e => ({ error: e, definitionNode: def })),
				)
				for (let i = 0; i < childDefinitions.length; i++) {
					const childDef = childDefinitions[i]
					if (!childDef) {
						continue
					}
					const child = childNodes[i]
					for (const childValue of child.possibleValues) {
						// TODO We need some sort of map / local cache which keeps track of the original
						// non-simplified types and see if they have been compared yet. This is needed
						// for structures that are cyclic, to essentially bail out once we are comparing
						// the same types again and just collect the errors of the lower depth.
						// This will currently lead to a stack overflow error when e.g. comparing two
						// text component definitions
						const simplified = simplify(childDef, childValue, options)
						// TODO this does not keep track correctly of empty unions. The child node should receive
						// some kind of empty union valid definition with the parent set to the correct definition
						// so that we can potentially error some valid parent defs if only some of them produce an
						// empty union for the child.
						const validDefs = (simplified.kind === 'union'
							? simplified.members
							: [simplified])
							.map(d => ({
								parent: def,
								runtimeNode: childValue,
								typeDef: d,
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
				const definitionGroups = curNode.validDefinitions
					.reduce(
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
					const { definitions, condensedErrors } =
						condenseErrorsAndFilterSiblings(
							definitionGroup.children.map(c => ({
								definition: c,
								errors: childErrors.filter(e => e.definitionNode === c)
									.map(e => e.error),
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

				if (
					curNode.validDefinitions.length !== stillValidDefintions.length
				) {
					curNode.validDefinitions = stillValidDefintions

					filterChildDefinitions(
						curNode.validDefinitions,
						curNode.children,
					)

					function filterChildDefinitions(
						parentDefs: CheckerTreeDefinitionNode<T>[],
						children: CheckerTreeNode<T>[],
					) {
						for (const child of children) {
							for (const childValue of child.possibleValues) {
								childValue.validDefinitions = childValue
									.validDefinitions.filter(d =>
										parentDefs.includes(d.parent!)
									)
								filterChildDefinitions(
									childValue.validDefinitions,
									childValue.children,
								)
							}
						}
					}
				}

				const oldNode: CheckerTreeRuntimeNode<T> = curNode
				curNode = oldNode.entryNode.parent

				const lastChild = curNode?.children
					.flatMap(v => v.possibleValues)
					.findLast(v => {
						if (v.condensedErrors.length > depth) {
							return true
						}

						let children = [v]
						for (let i = 0; i < depth; i++) {
							children = children.flatMap(v => v.children).flatMap(v =>
								v.possibleValues
							)
						}
						return children.length > 0
					})

				if (lastChild !== oldNode) {
					// Wait for all siblings to be evaluated first
					break
				}

				childErrors = curNode!.children
					.flatMap(c => c.possibleValues)
					.flatMap(c =>
						c.condensedErrors.length > depth
							? c.condensedErrors[depth]
							: []
					)

				depth++
			}
		}
	}

	// TODO iterate final tree and call `options.attachTypeInfo`

	for (
		const error of rootNode.possibleValues.flatMap(v => v.condensedErrors)
			.flat()
	) {
		if (error) {
			options.reportError(error.error)
		}
	}
}

function condenseErrorsAndFilterSiblings<T>(
	definitions: {
		definition: CheckerTreeDefinitionNode<T>
		errors: McdocCheckerError<T>[]
	}[],
): {
	definitions: CheckerTreeDefinitionNode<T>[]
	condensedErrors: McdocCheckerError<T>[]
} {
	if (definitions.length === 0) {
		return { definitions: [], condensedErrors: [] }
	}

	let validDefinitions = definitions
	const errors = validDefinitions[0].errors.filter(e =>
		e.kind === 'duplicate_key'
	)

	const alwaysMismatch: TypeMismatchError<T>[] = (validDefinitions[0].errors
		.filter(e =>
			e.kind === 'type_mismatch' &&
			!validDefinitions.some(d =>
				!d.errors.some(oe =>
					oe.kind === 'type_mismatch' &&
					e.node.originalNode === oe.node.originalNode
				)
			)
		) as TypeMismatchError<T>[])
		.map(e => {
			const expected = validDefinitions
				.map(d =>
					(d.errors.find(oe =>
						oe.kind === 'type_mismatch' &&
						oe.node.originalNode === e.node.originalNode
					) as TypeMismatchError<T>).expected
				)
				.flatMap(t => t.kind === 'union' ? t.members : [t])
				.filter((d, i, arr) =>
					arr.findIndex(od => od.kind === d.kind) === i
				)
			return {
				...e,
				expected: expected.length === 1
					? expected[0]
					: { kind: 'union', members: expected },
			}
		})
	errors.push(...alwaysMismatch)

	const onlyCommonTypeMismatches = definitions.filter(d =>
		!d.errors.some(e =>
			e.kind === 'sometimes_type_mismatch' ||
			(e.kind === 'type_mismatch' && !alwaysMismatch.some(oe =>
				oe.node.originalNode === e.node.originalNode
			))
		)
	)
	if (onlyCommonTypeMismatches.length !== 0) {
		validDefinitions = onlyCommonTypeMismatches
	} else {
		// TODO Generic error, maybe we can keep original expected types?
		// Error could be sth like Expected a string, a list or a different key in this file to have a different type.

		const typeMismatches: SimpleError<T>[] = validDefinitions
			.flatMap(d =>
				d.errors
					.filter(e =>
						e.kind === 'type_mismatch' && !alwaysMismatch.some(oe =>
							oe.node.originalNode === e.node.originalNode
						)
					)
			)
			.map(e => e.node as RuntimeNode<T>)
			.concat(
				validDefinitions.flatMap(d => d.errors).filter(e =>
					e.kind === 'sometimes_type_mismatch'
				).map(e => e.node as RuntimeNode<T>),
			)
			.filter((v, i, arr) =>
				arr.findIndex(o => o.originalNode === v.originalNode) === i
			)
			.map(n => ({ kind: 'sometimes_type_mismatch', node: n }))

		errors.push(...typeMismatches)
	}

	const alwaysUnknown = validDefinitions[0].errors
		.filter(e =>
			e.kind === 'unknown_key' &&
			!validDefinitions.some(d =>
				!d.errors.some(oe =>
					oe.kind === 'unknown_key' &&
					e.node.originalNode === oe.node.originalNode
				)
			)
		) as SimpleError<T>[]
	errors.push(...alwaysUnknown)

	const onlyCommonUnknownKeys = validDefinitions
		.filter(d =>
			!d.errors.some(e =>
				e.kind === 'invalid_key_combination' ||
				(e.kind === 'unknown_key' &&
					!alwaysUnknown.some(oe =>
						oe.node.originalNode === e.node.originalNode
					))
			)
		)
	if (onlyCommonUnknownKeys.length !== 0) {
		validDefinitions = onlyCommonUnknownKeys
	} else {
		const unknownKeys = validDefinitions
			.flatMap(d =>
				d.errors
					.filter(e =>
						e.kind === 'unknown_key' && !alwaysUnknown.some(oe =>
							oe.node.originalNode === e.node.originalNode
						)
					)
			)
			.map(e => e.node as RuntimeNode<T>)
			.concat(
				validDefinitions.flatMap(d => d.errors).filter(e =>
					e.kind === 'invalid_key_combination'
				).map(e => e.node as RuntimeNode<T>),
			)
			.filter((v, i, arr) =>
				arr.findIndex(o => o.originalNode === v.originalNode) === i
			)

		errors.push({ kind: 'invalid_key_combination', node: unknownKeys })
	}

	const noExpectedKvp = validDefinitions.filter(d =>
		!d.errors.some(e => e.kind === 'expected_key_value_pair')
	)
	if (noExpectedKvp.length !== 0) {
		validDefinitions = noExpectedKvp
	} else {
		errors.push(
			...validDefinitions
				.flatMap(d => d.errors)
				.filter((e, i, arr) =>
					e.kind === 'expected_key_value_pair' &&
					arr.findIndex(oe =>
							oe.kind === 'expected_key_value_pair' &&
							oe.node.originalNode === e.node.originalNode
						) === i
				),
		)
	}

	const noUnknownTupleElements = validDefinitions.filter(d =>
		d.errors.some(e => e.kind !== 'unknown_tuple_element')
	)
	if (noUnknownTupleElements.length !== 0) {
		validDefinitions = noUnknownTupleElements
	}

	const alwaysMissing = validDefinitions[0].errors.filter(e =>
		e.kind === 'missing_key' &&
		!validDefinitions.some(d =>
			!d.errors.some(oe =>
				oe.kind === 'missing_key' &&
				oe.node.originalNode === e.node.originalNode
			)
		)
	) as MissingKeyError<T>[]
	errors.push(...alwaysMissing)
	const onlyCommonMissing = validDefinitions
		.filter(d =>
			!d.errors.some(e =>
				e.kind === 'some_missing_keys' ||
				(e.kind === 'missing_key' &&
					!alwaysMissing.some(oe =>
						oe.node.originalNode === e.node.originalNode
					))
			)
		)
	if (onlyCommonMissing.length !== 0) {
		validDefinitions = onlyCommonMissing
	} else {
		// In this case we have multiple conflicting missing keys.
		// This is a generic error message with no further info.
		// A more informative error message would be quite complicated
		// and look sth like this:
		// Missing either keys ("A", "B" and "C"), ("A", and "D"), or "F"
		errors.push(
			...validDefinitions
				.flatMap(d =>
					d.errors
						.filter(e =>
							e.kind === 'missing_key' &&
							!alwaysMissing.some(oe =>
								oe.node.originalNode === e.node.originalNode
							)
						)
				)
				.map(e => e.node as RuntimeNode<T>)
				.concat(
					validDefinitions.flatMap(d => d.errors).filter(e =>
						e.kind === 'some_missing_keys'
					).map(e => e.node as RuntimeNode<T>),
				)
				.filter((v, i, arr) =>
					arr.findIndex(o => o.originalNode === v.originalNode) === i
				)
				.map(n => ({
					kind: 'some_missing_keys' as 'some_missing_keys',
					node: n,
				})),
		)
	}

	// TODO handle list length range and value range errors (merge ranges, could be multiple possible distinct ranges)

	return {
		definitions: validDefinitions.map(d => d.definition),
		condensedErrors: errors,
	}
}

interface ValidDefintionResult<T> {
	errors: McdocCheckerError<T>[]
	childDefinitions: (McdocType | undefined)[]
}

function checkShallowly<T>(
	runtimeNode: RuntimeNode<T>,
	simplifiedInferred: SimplifiedMcdocTypeNoUnion,
	children: RuntimeUnion<T>[],
	typeDef: SimplifiedMcdocTypeNoUnion,
	options: McdocCheckerOptions<T>,
): ValidDefintionResult<T> {
	const typeDefValueType = getValueType(typeDef)
	const runtimeValueType = getValueType(simplifiedInferred)

	if (
		(typeDef.kind !== 'any' && typeDef.kind !== 'unsafe' &&
			runtimeValueType.kind !== typeDefValueType.kind &&
			!options.isEquivalent(runtimeValueType, typeDefValueType)) ||
		(typeDef.kind === 'literal' &&
			(simplifiedInferred.kind !== 'literal' ||
				typeDef.value.value !== simplifiedInferred.value.value)) ||
		// TODO handle enum field attributes
		(typeDef.kind === 'enum' &&
			(simplifiedInferred.kind !== 'literal' ||
				!typeDef.values.some(v =>
					v.value === simplifiedInferred.value.value
				)))
	) {
		return {
			childDefinitions: Array(children.length).fill(undefined),
			errors: [{
				kind: 'type_mismatch',
				node: runtimeNode,
				expected: typeDef,
			}],
		}
	}

	const childDefinitions: (McdocType | undefined)[] = Array(children.length)
		.fill(undefined)
	const errors: McdocCheckerError<T>[] = []
	if (typeDef.attributes) {
		for (const attribute of typeDef.attributes) {
			const handler = attributeHandlers[attribute.name]
			if (handler) {
				errors.push(
					...handler(
						runtimeNode.originalNode,
						attribute,
						simplifiedInferred,
						typeDef,
						options,
					),
				)
			}
		}
	}
	switch (typeDef.kind) {
		case 'any':
		case 'unsafe':
			break
		case 'struct': {
			const literalKvps = new Map<
				string,
				{
					values: { pair: RuntimePair<T>; index: number }[]
					definition: McdocType | undefined
				}
			>()
			const otherKvps: { value: RuntimePair<T>; index: number }[] = []

			for (let i = 0; i < children.length; i++) {
				const child = children[i]
				if (Array.isArray(child)) {
					continue
				}
				if (
					child.key.inferredType.kind === 'literal' &&
					child.key.inferredType.value.kind === 'string'
				) {
					const existing = literalKvps.get(
						child.key.inferredType.value.value,
					)
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
				if (
					pair.key.kind === 'literal' && pair.key.value.kind === 'string'
				) {
					const runtimeChild = literalKvps.get(pair.key.value.value)
					if (runtimeChild) {
						foundMatch = true
						runtimeChild.definition = pair.type
					}
				}
				if (!foundMatch) {
					for (let i = 0; i < otherKvps.length; i++) {
						const kvp = otherKvps[i]
						if (
							isAssignable(
								kvp.value.key.inferredType,
								pair.key,
								options.context,
								options.isEquivalent,
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
							!kvp[1].definition &&
							isAssignable(
								{
									kind: 'literal',
									value: { kind: 'string', value: kvp[0] },
								},
								pair.key,
								options.context,
								options.isEquivalent,
							)
						) {
							foundMatch = true
							kvp[1].definition = pair.type
						}
					}
				}

				for (const match of otherKvpMatches) {
					childDefinitions[match] = pair.type
				}
				if (
					!foundMatch && pair.key.kind === 'literal' &&
					pair.optional !== true
				) {
					errors.push({
						kind: 'missing_key',
						node: runtimeNode,
						key: pair.key,
					})
				}
			}

			for (const kvp of literalKvps.values()) {
				for (const value of kvp.values) {
					childDefinitions[value.index] = kvp.definition

					if (kvp.values.length > 1) {
						errors.push({
							kind: 'duplicate_key',
							node: value.pair.key,
						})
					}
				}
			}

			for (let i = 0; i < children.length; i++) {
				const childDef = childDefinitions[i]
				const child = children[i]
				if (childDef === undefined) {
					if (Array.isArray(child)) {
						errors.push(...child.map(v => ({
							kind:
								'expected_key_value_pair' as 'expected_key_value_pair',
							node: v,
						})))
					} else {
						errors.push({
							kind: 'unknown_key',
							node: child.key,
						})
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
				childDefinitions[i] = itemType
			}

			if (
				typeDef.lengthRange &&
				!NumericRange.isInRange(typeDef.lengthRange, children.length)
			) {
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
					childDefinitions[i] = typeDef.items[i]
				} else {
					errors.push({
						kind: 'unknown_tuple_element',
						node: child,
					})
				}
			}

			if (typeDef.items.length > children.length) {
				errors.push({
					kind: 'invalid_collection_length',
					node: runtimeNode,
					ranges: [{
						kind: 0b00,
						max: typeDef.items.length,
						min: typeDef.items.length,
					}],
				})
			}
			break
		}
	}
	return {
		childDefinitions: childDefinitions,
		errors: errors,
	}
}

export function getPossibleTypes(
	typeDef: McdocType,
): Exclude<McdocType, UnionType>[] {
	return typeDef.kind === 'union'
		? typeDef.members.flatMap(m => getPossibleTypes(m))
		: [typeDef]
}

interface SimplifyNode<T> {
	value: SimplifyValueNode<T> | undefined
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
export function simplify<T>(
	typeDef: Exclude<McdocType, UnionType>,
	node: SimplifyValueNode<T>,
	options: McdocCheckerOptions<T>,
): SimplifiedMcdocTypeNoUnion
export function simplify<T>(
	typeDef: McdocType,
	node: SimplifyValueNode<T>,
	options: McdocCheckerOptions<T>,
): SimplifiedMcdocType
export function simplify<T>(
	typeDef: McdocType,
	node: SimplifyValueNode<T>,
	options: McdocCheckerOptions<T>,
): SimplifiedMcdocType {
	return simplifyInternal(typeDef, node, options, false)
}

function simplifyInternal<T>(
	typeDef: Exclude<McdocType, UnionType>,
	node: SimplifyValueNode<T>,
	options: McdocCheckerOptions<T>,
	simplifyingNodeMember: boolean,
): SimplifiedMcdocTypeNoUnion
function simplifyInternal<T>(
	typeDef: McdocType,
	node: SimplifyValueNode<T>,
	options: McdocCheckerOptions<T>,
	simplifyingNodeMember: boolean,
): SimplifiedMcdocType
function simplifyInternal<T>(
	typeDef: McdocType,
	node: SimplifyValueNode<T>,
	options: McdocCheckerOptions<T>,
	simplifyingNodeMember: boolean,
): SimplifiedMcdocType {
	if (typeDef.attributes) {
		// TODO
	}

	switch (typeDef.kind) {
		case 'reference':
			if (!typeDef.path) {
				// TODO when does this happen?
				options.context.logger.warn(`Tried to access empty reference`)
				return { kind: 'union', members: [] }
			}
			// TODO Probably need to keep original symbol around in some way to support "go to definition"
			const symbol = options.context.symbols.query(
				options.context.doc,
				'mcdoc',
				typeDef.path,
			)
			const def = symbol.getData(TypeDefSymbolData.is)?.typeDef
			if (!def) {
				options.context.logger.warn(
					`Tried to access unknown reference ${typeDef.path}`,
				)
				return { kind: 'union', members: [] }
			}

			return simplifyInternal(def, node, options, simplifyingNodeMember)
		case 'dispatcher':
			const dispatcher = options.context.symbols.query(
				options.context.doc,
				'mcdoc/dispatcher',
				typeDef.registry,
			).symbol?.members
			if (!dispatcher) {
				options.context.logger.warn(
					`Tried to access unknown dispatcher ${typeDef.registry}`,
				)
				return { kind: 'union', members: [] }
			}
			const structFields: StructTypePairField[] = []
			for (const key in dispatcher) {
				// TODO Better way to access typedef without any cast?
				const data = dispatcher[key].data as any
				if (data && data.typeDef) {
					structFields.push({ kind: 'pair', key: key, type: data.typeDef })
				}
			}
			return simplifyInternal(
				{
					kind: 'indexed',
					parallelIndices: typeDef.parallelIndices,
					child: { kind: 'struct', fields: structFields },
				},
				node,
				options,
				simplifyingNodeMember,
			)
		case 'indexed':
			const child = simplifyInternal(
				typeDef.child,
				node,
				options,
				simplifyingNodeMember,
			)

			if (child.kind !== 'struct') {
				options.context.logger.warn(
					`Tried to index unindexable type ${child.kind}`,
				)
				return { kind: 'union', members: [] }
			}
			let values: McdocType[] = []

			for (const index of typeDef.parallelIndices) {
				let lookup: string[] = []
				if (index.kind === 'static') {
					if (index.value === '%fallback') {
						values = child.fields.filter(f => f.kind === 'pair').map(f =>
							f.type
						)
						break
					}
					lookup.push(index.value)
				} else {
					let possibilities: SimplifyNode<T>[] = simplifyingNodeMember
						? [{ value: node, key: node.entryNode.runtimeKey }]
						: [{
							value: node.entryNode.parent,
							key: node.entryNode.runtimeKey,
						}]
					for (const entry of index.accessor) {
						if (typeof entry !== 'string' && entry.keyword === 'parent') {
							possibilities = possibilities.map(n => ({
								value: n.value?.entryNode.parent,
								key: simplifyingNodeMember
									? n.value?.entryNode.parent?.entryNode.runtimeKey
									: n.value?.entryNode.runtimeKey,
							}))
						} else if (
							typeof entry !== 'string' && entry.keyword === 'key'
						) {
							possibilities = possibilities
								.map(p => ({
									value: p.key
										? {
											node: p.key,
											entryNode: {
												parent: p.value,
												runtimeKey: p.key,
											},
										}
										: undefined,
									key: undefined,
								}))
							break
						} else if (typeof entry === 'string') {
							const newPossibilities: SimplifyNode<T>[] = []
							for (const node of possibilities) {
								const possibleChildren: SimplifyNode<T>[] = node.value
									? (options.getChildren(
										node.value.node.originalNode,
										simplifyInternal(
											node.value.node.inferredType,
											node.value,
											options,
											simplifyingNodeMember,
										),
									)
										.filter(child => {
											if (!Array.isArray(child)) {
												return isAssignable(
													child.key.inferredType,
													{
														kind: 'literal',
														value: {
															kind: 'string',
															value: entry,
														},
													},
													options.context,
													options.isEquivalent,
												)
											}
											// TODO if it's a list, consider all list items.
											// This should probably work recursively if we have a list of lists.
											return false
										}) as RuntimePair<T>[]) // We don't consider arrays yet, see above.
										.flatMap(c =>
											c.possibleValues.map(v => ({
												value: {
													node: v,
													entryNode: {
														parent: node.value,
														runtimeKey: c.key,
													},
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
							value?.inferredType.kind === 'literal' &&
							value.inferredType.value.kind === 'string'
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
						f.kind === 'pair' && f.key.kind === 'literal' &&
						f.key.value.value === v
					) ??
						child.fields.find(f =>
							f.kind === 'pair' && f.key.kind === 'literal' &&
							f.key.value.value === '%unknown'
						)
				)
				if (currentValues.includes(undefined)) {
					// fallback case
					values = child.fields.filter(f => f.kind === 'pair').map(f =>
						f.type
					)
					break
				} else {
					values.push(...currentValues.map(v => v!.type))
				}
			}
			return simplifyInternal(
				{ kind: 'union', members: values },
				node,
				options,
				simplifyingNodeMember,
			)
		case 'union':
			const members: SimplifiedMcdocTypeNoUnion[] = []
			for (const member of typeDef.members) {
				const simplified = simplifyInternal(
					member,
					node,
					options,
					simplifyingNodeMember,
				)

				if (simplified.kind === 'union') {
					members.push(...simplified.members)
				} else {
					members.push(simplified)
				}
			}
			if (members.length === 1) {
				return members[0]
			}
			return { kind: 'union', members: members }
		case 'struct':
			const literalFields = new Map<string, StructTypePairField>()
			let complexFields: SimplifiedStructTypePairField[] = []

			function addField(
				key: string | SimplifiedMcdocType,
				field: StructTypePairField,
			) {
				if (typeof key === 'string') {
					literalFields.set(key, field)
				} else if (key.kind === 'literal' && key.value.kind === 'string') {
					literalFields.set(key.value.value, field)
				} else if (key.kind === 'union') {
					key.members.forEach(m =>
						addField(m, { ...field, optional: true })
					)
				} else {
					// Only keep fields where the new key is not assignable to an existing field
					complexFields = complexFields.filter(other =>
						!isAssignable(
							key,
							typeof other.key === 'string'
								? {
									kind: 'literal',
									value: { kind: 'string', value: other.key },
								}
								: other.key,
							options.context,
							options.isEquivalent,
						)
					)
					complexFields.push({ ...field, key })
				}
			}
			for (const field of typeDef.fields) {
				if (field.kind === 'pair') {
					// Don't simplify the value here. We need to have the correct `node` and `parents`, which we
					// cannot deterministically find for non-string keys.
					// Instead, this method will be called by every struct child by the outer checking method.
					const structKey = typeof field.key === 'string'
						? field.key
						: simplifyInternal(field.key, node, options, true)
					addField(structKey, field)
				} else {
					const simplifiedSpreadType = simplifyInternal(
						field.type,
						node,
						options,
						true,
					)
					if (simplifiedSpreadType.kind === 'struct') {
						for (const field of simplifiedSpreadType.fields) {
							addField(field.key, field)
						}
					} else {
						const type = McdocType.toString(simplifiedSpreadType)
						options.context.logger.warn(
							`Tried to spread non-struct type ${type}`,
						)
					}
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
						key: {
							kind: 'literal',
							value: { kind: 'string', value: key },
						} as const,
					})),
				],
			}
		case 'enum':
			return { ...typeDef, enumKind: typeDef.enumKind ?? 'int' }
		case 'concrete': // TODO
		case 'template': // TODO
			return { kind: 'union', members: [] }
		default:
			return typeDef
	}
}

function getValueType(
	type: SimplifiedMcdocTypeNoUnion,
): Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType>
function getValueType(
	type: SimplifiedMcdocTypeNoUnion | SimplifiedStructTypePairField,
):
	| Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType>
	| SimplifiedStructTypePairField
function getValueType(
	type: SimplifiedMcdocTypeNoUnion | SimplifiedStructTypePairField,
):
	| Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType>
	| SimplifiedStructTypePairField
{
	switch (type.kind) {
		case 'literal':
			return { kind: type.value.kind }
		case 'enum':
			return { kind: type.enumKind }
		default:
			return type
	}
}

export function getDefaultErrorReporter<T>(
	ctx: CheckerContext,
	getRange: (
		node: RuntimeNode<T>,
		error: McdocCheckerError<T>['kind'],
	) => Range,
): ErrorReporter<T> {
	return (error: McdocCheckerError<T>) => {
		const defaultTranslationKey = error.kind.replace('_', '-')
		if (error.kind === 'unknown_tuple_element') {
			const nodes = Array.isArray(error.node)
				? error.node
				: [...error.node.possibleValues, error.node.key]
			for (const node of nodes) {
				ctx.err.report(
					localize('expected', localize('nothing')),
					getRange(node, 'unknown_tuple_element'),
				)
			}
			return
		} else if (error.kind === 'invalid_key_combination') {
			const message = localize(
				defaultTranslationKey,
				arrayToMessage(
					error.node.map(n => McdocType.toString(n.inferredType)),
				),
			)
			for (const node of error.node) {
				ctx.err.report(message, getRange(node, 'unknown_tuple_element'))
			}
			return
		}
		const range = getRange(error.node, error.kind)
		switch (error.kind) {
			case 'unknown_key':
				ctx.err.report(
					localize(
						defaultTranslationKey,
						error.node.inferredType.kind === 'literal'
							? error.node.inferredType.value.value
							: `<${
								localize(`mcdoc.type.${error.node.inferredType.kind}`)
							}>`,
					),
					range,
					ErrorSeverity.Warning,
				)
				break
			case 'missing_key':
				ctx.err.report(
					localize(
						defaultTranslationKey,
						error.key.kind === 'literal'
							? error.key.value.value
							: `<${localize(`mcdoc.type.${error.key.kind}`)}>`,
					),
					range,
				)
				break
			case 'invalid_collection_length':
			case 'number_out_of_range':
				const baseKey = error.kind === 'invalid_collection_length'
					? 'mcdoc.runtime.checker.range.collection'
					: 'mcdoc.runtime.checker.range.number'
				const rangeMessages = error.ranges.map(r => {
					const left = r.min !== undefined
						? localize(
							RangeKind.isLeftExclusive(r.kind)
								? 'mcdoc.runtime.checker.range.left-exclusive'
								: 'mcdoc.runtime.checker.range.left-inclusive',
							r.min,
						)
						: undefined
					const right = r.max !== undefined
						? localize(
							RangeKind.isLeftExclusive(r.kind)
								? 'mcdoc.runtime.checker.range.right-exclusive'
								: 'mcdoc.runtime.checker.range.right-inclusive',
							r.max,
						)
						: undefined

					if (left !== undefined && right !== undefined) {
						return localize(
							'mcdoc.runtime.checker.range.concat',
							left,
							right,
						)
					}
					return left ?? right
				}).filter(r => r !== undefined) as string[]
				ctx.err.report(
					localize(baseKey, arrayToMessage(rangeMessages, false)),
					range,
				)
				break
			case 'type_mismatch':
				const types = error.expected.kind === 'union'
					? error.expected.members
					: [error.expected]
				ctx.err.report(
					localize(
						'expected',
						arrayToMessage(
							types.map(e =>
								e.kind === 'enum'
									? arrayToMessage(
										e.values.map(v => v.value.toString()),
									)
									: e.kind === 'literal'
									? localeQuote(e.value.value.toString())
									: localize(`mcdoc.type.${e.kind}`)
							),
							false,
						),
					),
					range,
				)
				break
			case 'expected_key_value_pair':
				ctx.err.report(
					localize(`mcdoc.runtime.checker.${defaultTranslationKey}`),
					range,
				)
				break
			default:
				ctx.err.report(localize(defaultTranslationKey), range)
		}
	}
}
