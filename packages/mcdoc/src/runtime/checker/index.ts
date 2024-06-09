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
	definition: SimplifiedMcdocTypeNoUnion,
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

	const node: CheckerTreeEntryNode<McdocType> = {
		parent: undefined,
		possibleRuntimeValues: [],
		typeDef: assignValue,
	}
	node.possibleRuntimeValues = getPossibleTypes(typeDef).map(v => ({
		entryNode: node,
		node: { originalNode: v, inferredType: v },
		validDefinitions: [],
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

interface CheckerTreeDefinitionNode<T> {
	typeDef: SimplifiedMcdocTypeNoUnion
	runtimeNode: CheckerTreeRuntimeNode<T>
	children: CheckerTreeEntryNode<T>[]
	errors: McdocCheckerError<T>[]
}
interface CheckerTreeRuntimeNode<T> {
	node: RuntimeNode<T>
	entryNode: CheckerTreeEntryNode<T>
	validDefinitions: CheckerTreeDefinitionNode<T>[]
	/// Each outer entry represents a layer of siblings
	/// Each inner entry represents a specific condensed error within that layer.
	condensedChildErrors?: McdocCheckerError<T>[][]
}
interface CheckerTreeEntryNode<T> {
	parent: CheckerTreeDefinitionNode<T> | undefined
	runtimeKey?: RuntimeNode<T>
	possibleRuntimeValues: CheckerTreeRuntimeNode<T>[]
	typeDef: McdocType | undefined
}

export function typeDefinition<T>(
	runtimeValues: RuntimeNode<T>[],
	typeDef: McdocType,
	options: McdocCheckerOptions<T>,
) {
	const rootNode: CheckerTreeEntryNode<T> = {
		possibleRuntimeValues: [],
		parent: undefined,
		typeDef: typeDef,
	}
	rootNode.possibleRuntimeValues = runtimeValues.map(n => ({
		node: n,
		validDefinitions: [],
		entryNode: rootNode,
	}))
	const nodeQueue: CheckerTreeEntryNode<T>[] = [rootNode]

	while (nodeQueue.length !== 0) {
		const node = nodeQueue.splice(0, 1)[0]
		check(node, options)
		for (const runtimeValue of node.possibleRuntimeValues) {
			let siblingErrors = runtimeValue.validDefinitions.map(d => ({
				node: d,
				errors: d.errors,
			}))
			let parent: CheckerTreeRuntimeNode<T> | undefined = runtimeValue
			let depth = 0
			while (parent) {
				const { siblings, condensedErrors } =
					condenseErrorsAndFilterSiblings(siblingErrors)
				// TODO possible optimization: Remove entries from nodeQueue which are now no longer neccessary to evaluate.
				// This is quite tricky and would mess up the check at the bottom here, and maybe not worth it if this is no bottleneck
				parent.validDefinitions = siblings
				parent.condensedChildErrors ??= []
				parent.condensedChildErrors.push(condensedErrors)

				// TypeScript is drunken (no reason for typedef here)
				const oldParent: CheckerTreeRuntimeNode<T> = parent
				parent = oldParent.entryNode.parent?.runtimeNode

				const lastDefinition = parent
					?.validDefinitions[parent.validDefinitions.length - 1]
				const lastChild = lastDefinition?.children.findLast(c => {
					let values = c.possibleRuntimeValues
					for (let i = 0; i < depth; i++) {
						values = values.flatMap(v => v.validDefinitions).flatMap(v =>
							v.children
						).flatMap(v => v.possibleRuntimeValues)
					}
					return values.length > 0
				})
				const lastValue = lastChild?.possibleRuntimeValues.findLast(v => {
					let values = [v]
					for (let i = 0; i < depth; i++) {
						values = values.flatMap(v => v.validDefinitions).flatMap(v =>
							v.children
						).flatMap(v => v.possibleRuntimeValues)
					}
					return values.length > 0
				})

				if (lastValue !== oldParent) {
					// Wait for all siblings to be evaluated first
					break
				}

				siblingErrors = parent!.validDefinitions.map(d => ({
					node: d,
					errors: d.children.flatMap(c => c.possibleRuntimeValues).flatMap(
						v =>
							v.condensedChildErrors &&
								v.condensedChildErrors.length > depth
								? v.condensedChildErrors[depth]
								: [],
					),
				}))

				depth++
			}

			for (const def of runtimeValue.validDefinitions) {
				nodeQueue.push(...def.children)
			}
		}
	}

	// TODO iterate final tree and call `options.attachTypeInfo`

	for (
		const error of rootNode.possibleRuntimeValues.flatMap(v =>
			v.condensedChildErrors?.flat()
		)
	) {
		if (error) {
			options.reportError(error)
		}
	}
}

function condenseErrorsAndFilterSiblings<T>(
	siblings: {
		node: CheckerTreeDefinitionNode<T>
		errors: McdocCheckerError<T>[]
	}[],
): {
	siblings: CheckerTreeDefinitionNode<T>[]
	condensedErrors: McdocCheckerError<T>[]
} {
	if (siblings.length === 0) {
		return { siblings: [], condensedErrors: [] }
	}

	let validDefinitions = siblings
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

	const onlyCommonTypeMismatches = siblings.filter(d =>
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
			...validDefinitions.map(d => ({
				kind: 'some_missing_keys' as 'some_missing_keys',
				node: d.node.runtimeNode.node,
			})),
		)
	}

	// TODO handle list length range and value range errors (merge ranges, could be multiple possible distinct ranges)

	return {
		siblings: validDefinitions.map(d => d.node),
		condensedErrors: errors,
	}
}

function check<T>(
	node: CheckerTreeEntryNode<T>,
	options: McdocCheckerOptions<T>,
) {
	if (node.typeDef === undefined) {
		return
	}
	const parents: RuntimeUnion<T>[] = []
	let current: CheckerTreeEntryNode<T> | undefined = node
	while (current) {
		const possibleValues = current.possibleRuntimeValues.map(v => v.node)
		parents.unshift(
			current.runtimeKey
				? { key: current.runtimeKey, possibleValues }
				: possibleValues,
		)
		current = current.parent?.runtimeNode.entryNode
	}
	const simplifiedNode = simplify(node.typeDef, options, parents)
	const simplifiedOptions = simplifiedNode.kind === 'union'
		? simplifiedNode.members
		: [simplifiedNode]

	for (const possibleNode of node.possibleRuntimeValues) {
		const { originalNode, inferredType } = possibleNode.node
		// TODO We need some sort of map / local cache which keeps track of the original
		// non-simplified types and see if they have been compared yet. This is needed
		// for structures that are cyclic, to essentially bail out once we are comparing
		// the same types again and just collect the errors of the lower depth.
		// This will currently lead to a stack overflow error when e.g. comparing two
		// text component definitions
		const simplifiedRuntime = simplify(inferredType, options, parents)
		const inferredValue = getValueType(simplifiedRuntime)
		const matches = []
		for (const simplified of simplifiedOptions) {
			const simplifiedValue = getValueType(simplified)

			if (
				(inferredValue.kind === simplifiedValue.kind ||
					options.isEquivalent(inferredValue, simplifiedValue)) &&
				(simplified.kind !== 'literal' ||
					(simplifiedRuntime.kind === 'literal' &&
						simplified.value.value === simplifiedRuntime.value.value)) &&
				// TODO handle enum field attributes
				(simplified.kind !== 'enum' ||
					(simplifiedRuntime.kind === 'literal' &&
						simplified.values.some(v =>
							v.value === simplifiedRuntime.value.value
						)))
			) {
				matches.push(simplified)
			}
		}

		if (matches.length === 0) {
			possibleNode.validDefinitions = simplifiedOptions.map(d => ({
				typeDef: d,
				runtimeNode: possibleNode,
				children: [],
				errors: [{
					kind: 'type_mismatch',
					node: possibleNode.node,
					expected: d,
				}],
			}))
			continue
		}
		const children = options.getChildren(originalNode, simplifiedRuntime)

		for (const simplified of matches) {
			const errors: McdocCheckerError<T>[] = []
			if (simplified.attributes) {
				for (const attribute of simplified.attributes) {
					const handler = attributeHandlers[attribute.name]
					if (handler) {
						errors.push(
							...handler(
								originalNode,
								attribute,
								simplifiedRuntime,
								simplified,
								options,
							),
						)
					}
				}
			}
			let childNodes: CheckerTreeEntryNode<T>[] = children.map(c => {
				if (Array.isArray(c)) {
					const ans: CheckerTreeEntryNode<T> = {
						parent: undefined,
						possibleRuntimeValues: [],
						typeDef: undefined,
					}
					ans.possibleRuntimeValues = c.map(c => ({
						node: c,
						validDefinitions: [],
						entryNode: ans,
					}))
					return ans
				}
				const ans: CheckerTreeEntryNode<T> = {
					parent: undefined,
					typeDef: undefined,
					runtimeKey: c.key,
					possibleRuntimeValues: [],
				}
				ans.possibleRuntimeValues = c.possibleValues.map(v => ({
					node: v,
					validDefinitions: [],
					entryNode: ans,
				}))
				return ans
			})
			switch (simplified.kind) {
				case 'any':
				case 'unsafe':
					childNodes = []
					break
				case 'struct': {
					const unmatchedKvps = children
						.map((v, i) => ({ value: v, index: i }))
						.filter(v => !Array.isArray(v.value)) as {
							value: RuntimePair<T>
							index: number
						}[]

					for (const pair of simplified.fields) {
						const matches: number[] = []
						for (let i = 0; i < unmatchedKvps.length; i++) {
							const kvp = unmatchedKvps[i]
							if (
								isAssignable(
									kvp.value.key.inferredType,
									pair.key,
									options.context,
									options.isEquivalent,
								)
							) {
								unmatchedKvps.splice(i, 1)
								matches.push(kvp.index)
								i--
							}
						}
						if (matches.length > 1) {
							if (pair.key.kind === 'literal') {
								errors.push(...matches.map(m => ({
									kind: 'duplicate_key',
									node: (children[m] as RuntimePair<T>).key,
								} as SimpleError<T>)))
							} else {
								// TODO
							}
						}
						for (const match of matches) {
							childNodes[match].typeDef = pair.type
						}
						if (matches.length === 0 && pair.optional !== true) {
							errors.push({
								kind: 'missing_key',
								node: possibleNode.node,
								key: pair.key,
							})
						}
					}
					for (const child of childNodes) {
						if (child.typeDef === undefined) {
							if (child.runtimeKey === undefined) {
								errors.push(...child.possibleRuntimeValues.map(v => ({
									kind:
										'expected_key_value_pair' as 'expected_key_value_pair',
									node: v.node,
								})))
							} else {
								errors.push({
									kind: 'unknown_key',
									node: child.runtimeKey,
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
					switch (simplified.kind) {
						case 'list':
							itemType = simplified.item
							break
						case 'byte_array':
							itemType = {
								kind: 'byte',
								valueRange: simplified.valueRange,
							}
							break
						case 'int_array':
							itemType = {
								kind: 'int',
								valueRange: simplified.valueRange,
							}
							break
						case 'long_array':
							itemType = {
								kind: 'long',
								valueRange: simplified.valueRange,
							}
							break
					}

					for (const child of childNodes) {
						child.typeDef = itemType
					}

					if (
						simplified.lengthRange &&
						!NumericRange.isInRange(
							simplified.lengthRange,
							children.length,
						)
					) {
						errors.push({
							kind: 'invalid_collection_length',
							node: possibleNode.node,
							ranges: [simplified.lengthRange],
						})
					}
					break
				}
				case 'tuple': {
					for (let i = 0; i < childNodes.length; i++) {
						const child = childNodes[i]
						if (i < simplified.items.length) {
							child.typeDef = simplified.items[i]
						} else {
							errors.push({
								kind: 'unknown_tuple_element',
								node: child.runtimeKey === undefined
									? child.possibleRuntimeValues.map(c => c.node)
									: {
										key: child.runtimeKey,
										possibleValues: child.possibleRuntimeValues.map(
											c => c.node,
										),
									},
							})
						}
					}

					if (simplified.items.length > children.length) {
						errors.push({
							kind: 'invalid_collection_length',
							node: possibleNode.node,
							ranges: [{
								kind: 0b00,
								max: simplified.items.length,
								min: simplified.items.length,
							}],
						})
					}
					break
				}
			}
			const def: CheckerTreeDefinitionNode<T> = {
				typeDef: simplified,
				runtimeNode: possibleNode,
				children: childNodes,
				errors: errors,
			}
			for (const child of def.children) {
				child.parent = def
			}
			possibleNode.validDefinitions.push(def)
		}
	}
}

export function getPossibleTypes(
	typeDef: McdocType,
): Exclude<McdocType, UnionType>[] {
	return typeDef.kind === 'union'
		? typeDef.members.flatMap(m => getPossibleTypes(m))
		: [typeDef]
}

export function simplify<T>(
	typeDef: Exclude<McdocType, UnionType>,
	options: McdocCheckerOptions<T>,
	parents: RuntimeUnion<T>[],
): SimplifiedMcdocTypeNoUnion
export function simplify<T>(
	typeDef: McdocType,
	options: McdocCheckerOptions<T>,
	parents: RuntimeUnion<T>[],
): SimplifiedMcdocType
export function simplify<T>(
	typeDef: McdocType,
	options: McdocCheckerOptions<T>,
	parents: RuntimeUnion<T>[],
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

			return simplify(def, options, parents)
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
			return simplify(
				{
					kind: 'indexed',
					parallelIndices: typeDef.parallelIndices,
					child: { kind: 'struct', fields: structFields },
				},
				options,
				parents,
			)
		case 'indexed':
			const child = simplify(typeDef.child, options, parents)

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
					const parentsCpy = [...parents]
					const initial = parentsCpy.pop()
					let possibilities = [{
						parents: parentsCpy,
						node: initial,
					}]
					for (const entry of index.accessor) {
						if (typeof entry !== 'string' && entry.keyword === 'parent') {
							possibilities = possibilities.map(n => {
								const node = n.parents.pop()
								return { parents: n.parents, node }
							})
						} else if (
							typeof entry !== 'string' && entry.keyword === 'key'
						) {
							lookup.push(
								...possibilities
									.map(p =>
										!Array.isArray(p.node) &&
											p.node?.key.inferredType.kind === 'literal' &&
											p.node.key.inferredType.value.kind === 'string'
											? p.node.key.inferredType.value.value
											: '%none'
									).filter((k, i, arr) => arr.indexOf(k) === i),
							)
							possibilities = []
							break
						} else if (typeof entry === 'string') {
							const possibleChildren: {
								parents: RuntimeUnion<T>[]
								node: RuntimeUnion<T> | undefined
							}[] = []
							for (const node of possibilities) {
								for (
									const value of Array.isArray(node.node)
										? node.node
										: node.node?.possibleValues ?? [undefined]
								) {
									const child = value
										? options.getChildren(
											value.originalNode,
											simplify(
												value.inferredType,
												options,
												node.parents,
											),
										).find(child => {
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
											return false
										})
										: undefined

									possibleChildren.push({
										parents: node.node
											? [...node.parents, node.node]
											: [],
										node: child,
									})
								}
							}
							possibilities = possibleChildren
						} else {
							lookup.push('%none')
							break
						}
					}
					for (
						const value of possibilities.flatMap(p =>
							Array.isArray(p.node) ? p.node : p.node?.possibleValues
						)
					) {
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
			return simplify({ kind: 'union', members: values }, options, parents)
		case 'union':
			const members: SimplifiedMcdocTypeNoUnion[] = []
			for (const member of typeDef.members) {
				const simplified = simplify(member, options, parents)

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
					key.members.forEach(m => addField(m, field))
				} else {
					complexFields = complexFields.filter(other =>
						!isAssignable(
							typeof other.key === 'string'
								? {
									kind: 'literal',
									value: { kind: 'string', value: other.key },
								}
								: other.key,
							key,
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
					const key = typeof field.key === 'string'
						? field.key
						: simplify(field.key, options, parents)
					addField(key, field)
				} else {
					const simplifiedSpreadType = simplify(
						field.type,
						options,
						parents,
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
			complexFields = complexFields.filter(other =>
				!isAssignable(
					typeof other.key === 'string'
						? {
							kind: 'literal',
							value: { kind: 'string', value: other.key },
						}
						: other.key,
					{
						kind: 'union',
						members: [...literalFields.keys()].map(k => ({
							kind: 'literal',
							value: { kind: 'string', value: k },
						})),
					},
					options.context,
					options.isEquivalent,
				)
			)
			return {
				kind: 'struct',
				fields: [
					...complexFields,
					...[...literalFields.entries()].map(([key, field]) =>
						({
							...field,
							key: {
								kind: 'literal',
								value: { kind: 'string', value: key },
							},
						}) satisfies SimplifiedStructTypePairField
					),
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
