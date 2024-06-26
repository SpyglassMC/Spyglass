import type { AstNode, CheckerContext, Range } from '@spyglassmc/core'
import { ErrorSeverity, ResourceLocation } from '@spyglassmc/core'
import { arrayToMessage, localeQuote, localize } from '@spyglassmc/locales'
import { RangeKind } from '../../node/index.js'
import { McdocType, NumericRange } from '../../type/index.js'
import type {
	CheckerTreeDefinitionGroupNode,
	CheckerTreeDefinitionNode,
	CheckerTreeNode,
	ErrorReporter,
	RuntimeNode,
	SimplifiedMcdocTypeNoUnion,
} from './index.js'

export type McdocRuntimeError<T> =
	| SimpleError<T>
	| UnknownKeyError<T>
	| RangeError<T>
	| TypeMismatchError<T>
	| MissingKeyError<T>

export interface McdocRuntimeBaseError<T> {
	node: RuntimeNode<T>
	/**
	 * This is set when this error may not need to be fixed if another error of the same kind is
	 * fixed instead. This contains a list of nodes with conflicting
	 */
	nodesWithConflictingErrors?: RuntimeNode<T>[]
}

export interface SimpleError<T> extends McdocRuntimeBaseError<T> {
	kind:
		| 'duplicate_key'
		| 'unknown_key'
		| 'expected_key_value_pair'
		| 'unknown_tuple_element'
		| 'internal'
}
export namespace SimpleError {
	export function is<T>(error: McdocRuntimeError<T> | undefined): error is SimpleError<T> {
		return error?.kind === 'duplicate_key'
			|| error?.kind === 'unknown_key'
			|| error?.kind === 'expected_key_value_pair'
			|| error?.kind === 'unknown_tuple_element'
			|| error?.kind === 'internal'
	}
}

export interface UnknownKeyError<T> extends McdocRuntimeBaseError<T> {
	kind: 'unknown_key'
}
export namespace UnknownKeyError {
	export function is<T>(
		error: McdocRuntimeError<T> | undefined,
	): error is UnknownKeyError<T> {
		return error?.kind === 'unknown_key'
	}
}

export interface RangeError<T> extends McdocRuntimeBaseError<T> {
	kind:
		| 'invalid_collection_length'
		| 'invalid_string_length'
		| 'number_out_of_range'
	/**
	 * A list of multiple mean the number (or length) has to be within one of these ranges. This is
	 * a result of merging errors from two conflicting definitions for the same value.
	 */
	ranges: NumericRange[]
}
export namespace RangeError {
	export function is<T>(error: McdocRuntimeError<T> | undefined): error is RangeError<T> {
		return error?.kind === 'invalid_collection_length'
			|| error?.kind === 'invalid_string_length'
			|| error?.kind === 'number_out_of_range'
	}
}

export interface MissingKeyError<T> extends McdocRuntimeBaseError<T> {
	kind: 'missing_key'
	/**
	 * A list of multiple are an alternative, and at least on e needs to be fixed, not neccessarily
	 * all of them.
	 *
	 * In case there are multiple non-conflicting missing keys, multiple errors will be reported on
	 * the same node instead.
	 *
	 * If this has a length > 1, there is at least one error that needs to be fixed, and at least one
	 * error that does not neccassarily need to be fixed.
	 */
	keys: string[]
}
export namespace MissingKeyError {
	export function is<T>(error: McdocRuntimeError<T> | undefined): error is MissingKeyError<T> {
		return error?.kind === 'missing_key'
	}
}

export interface TypeMismatchError<T> extends McdocRuntimeBaseError<T> {
	kind: 'type_mismatch'
	/**
	 * These are all valid definitions. The node needs to only fullfill one of them.
	 */
	expected: SimplifiedMcdocTypeNoUnion[]
}
export namespace TypeMismatchError {
	export function is<T>(error: McdocRuntimeError<T> | undefined): error is TypeMismatchError<T> {
		return error?.kind === 'type_mismatch'
	}
}

export interface ErrorCondensingDefinition<T> {
	definition: CheckerTreeDefinitionNode<T>
	errors: McdocRuntimeError<T>[]
}

export function condenseAndPropagate<T>(
	definitionGroup: CheckerTreeDefinitionGroupNode<T>,
	definitionErrors: ErrorCondensingDefinition<T>[],
) {
	const queue = [{ node: definitionGroup, errorsOnLayer: definitionErrors, depth: 0 }]
	while (queue.length) {
		const { node, errorsOnLayer, depth } = queue.shift()!

		const stillValidDefinitions: CheckerTreeDefinitionNode<T>[] = []
		const { definitions, condensedErrors } = condenseErrorsAndFilterSiblings(
			errorsOnLayer,
		)

		stillValidDefintions.push(...definitions)

		node.condensedErrors.push(condensedErrors)

		if (node.validDefinitions.length !== stillValidDefintions.length) {
			filterChildDefinitions(
				node.validDefinitions.filter(d => !stillValidDefintions.includes(d)),
				node.runtimeNode.children,
			)
			node.validDefinitions = stillValidDefintions
		}

		const parents = node.parents
			.filter(parent => {
				const lastChild = parent.groupNode.validDefinitions
					.flatMap(d => d.children)
					.findLast(v => {
						if (v.condensedErrors.length > depth) {
							return true
						}

						let children = [v]
						for (let i = 0; i < depth; i++) {
							children = children.flatMap(v => v.validDefinitions).flatMap(v => v.children)
						}
						return children.length > 0
					})

				if (lastChild !== node) {
					// Wait for all siblings to be evaluated first
					return false
				}
				return true
			})
			.map(parent => ({
				node: parent.groupNode,
				depth: depth + 1,
				errorsOnLayer: parent.groupNode.validDefinitions
					.flatMap(d => ({
						definition: d,
						errors: d.children
							.flatMap(c =>
								c.condensedErrors.length > depth
									? c.condensedErrors[depth]
									: []
							),
					})),
			}))

		queue.push(...parents)
	}
}

function filterChildDefinitions<T>(
	removedDefs: CheckerTreeDefinitionNode<T>[],
	children: CheckerTreeNode<T>[],
) {
	for (const child of children) {
		for (const childValue of child.possibleValues) {
			const removedChildDefs: CheckerTreeDefinitionNode<T>[] = []

			for (let i = 0; i < childValue.definitionsByParent.length; i++) {
				const definitionGroup = childValue.definitionsByParent[i]
				definitionGroup.parents = definitionGroup.parents.filter(p => !removedDefs.includes(p))
				if (definitionGroup.parents.length === 0) {
					removedChildDefs.push(...definitionGroup.validDefinitions)
					childValue.definitionsByParent.splice(i, 1)
					i--
				}
			}

			if (removedChildDefs.length > 0) {
				filterChildDefinitions(
					removedChildDefs,
					childValue.children,
				)
			}
		}
	}
}

function condenseErrorsAndFilterSiblings<T>(definitions: ErrorCondensingDefinition<T>[]): {
	definitions: CheckerTreeDefinitionNode<T>[]
	condensedErrors: McdocRuntimeError<T>[]
} {
	if (definitions.length === 0) {
		return { definitions: [], condensedErrors: [] }
	}

	let validDefinitions = definitions
	const errors = []

	const typeMismatchResult = condense(
		validDefinitions,
		TypeMismatchError.is,
		(a, b) =>
			a.expected.length === b.expected.length
			&& !a.expected.some(d => !b.expected.some(od => McdocType.equals(d, od))),
		errors => ({
			kind: 'type_mismatch',
			node: errors[0].node,
			expected: deduplicateGroups(
				errors.map(e => e.expected),
				McdocType.equals,
			),
		}),
	)
	validDefinitions = typeMismatchResult.filteredDefinitions
	errors.push(...typeMismatchResult.condensedErrors)

	for (
		const kind of [
			'unknown_key',
			'expected_key_value_pair',
			'unknown_tuple_element',
		] as const
	) {
		const simpleErrorResult = condense(
			validDefinitions,
			(e): e is SimpleError<T> => e.kind === kind,
			_ => true,
		)
		validDefinitions = simpleErrorResult.filteredDefinitions
		errors.push(...simpleErrorResult.condensedErrors)
	}

	const missingKeyResult = condense(
		validDefinitions,
		MissingKeyError.is,
		(a, b) => !a.keys.some(k => !b.keys.includes(k)),
		errors => ({
			kind: 'missing_key',
			node: errors[0].node,
			keys: deduplicateGroups(errors.map(e => e.keys)),
		}),
	)
	validDefinitions = missingKeyResult.filteredDefinitions
	errors.push(...missingKeyResult.condensedErrors)

	for (
		const kind of [
			'invalid_collection_length',
			'invalid_string_length',
			'number_out_of_range',
		] as const
	) {
		const rangeErrorResult = condense(
			validDefinitions,
			(e): e is RangeError<T> => e.kind === kind,
			(a, b) =>
				a.ranges.length === b.ranges.length
				&& !a.ranges.some(r => !b.ranges.some(or => NumericRange.equals(r, or))),
			// TODO merge overlapping ranges better?
			errors => ({
				kind,
				node: errors[0].node,
				ranges: deduplicateGroups(errors.map(e => e.ranges), NumericRange.equals),
			}),
		)
		validDefinitions = rangeErrorResult.filteredDefinitions
		errors.push(...rangeErrorResult.condensedErrors)
	}

	// No condensing needed for duplicate key. If a key is a duplicate in one definition, it really
	// should have been reported by all of them
	validDefinitions[0].errors.filter(e => e.kind === 'duplicate_key')

	const internalErrorResult = condense(
		validDefinitions,
		(e): e is SimpleError<T> => e.kind === 'internal',
		_ => false,
	)
	validDefinitions = internalErrorResult.filteredDefinitions
	errors.push(...internalErrorResult.condensedErrors)

	return {
		definitions: validDefinitions.map(d => d.definition),
		condensedErrors: errors,
	}
}

function condense<T, E extends McdocRuntimeError<T>>(
	validDefinitions: ErrorCondensingDefinition<T>[],
	is: (e: McdocRuntimeError<T>) => e is E,
	equals: (a: E, b: E) => boolean,
	combineAlternatives?: (errors: E[]) => E,
): { condensedErrors: E[]; filteredDefinitions: ErrorCondensingDefinition<T>[] } {
	// TODO a lot of O(n^2) in this function, may need optimization
	const errorsOfType = validDefinitions
		.map(def => ({ def, errors: def.errors.filter(is) }))

	const definitionsWithoutError = errorsOfType
		.filter(d => d.errors.length === 0)
		.map(e => e.def)
	if (definitionsWithoutError.length > 0) {
		return { condensedErrors: [], filteredDefinitions: definitionsWithoutError }
	}

	const distinctErrorsPerNode = errorsOfType
		.flatMap(d => d.errors.map(e => ({ definition: d.def, error: e })))
		.reduce((entries, e) => {
			const entry = entries.find(oe => oe.errors[0].error.node === e.error.node)
			if (entry) {
				const error = entry.errors.find(oe => equals(e.error, oe.error))
				if (error) {
					error.definitions.push(e.definition)
				} else {
					entry.errors.push({ error: e.error, definitions: [e.definition] })
				}
			} else {
				entries.push({ errors: [{ error: e.error, definitions: [e.definition] }] })
			}

			return entries
		}, [] as { errors: { error: E; definitions: ErrorCondensingDefinition<T>[] }[] }[])

	const distinctErrors = distinctErrorsPerNode.flatMap(e => e.errors)
	const commonErrors = distinctErrors
		.filter(e => e.definitions.length == validDefinitions.length)
		.map(e => e.error)
	const definitionsWithUncommonErrors = distinctErrors
		.filter(e => e.definitions.length < validDefinitions.length)
		.flatMap(e => e.definitions)

	const definitionsWithOnlyCommonErrors = validDefinitions
		.filter(d => !definitionsWithUncommonErrors.includes(d))

	if (definitionsWithOnlyCommonErrors.length > 0) {
		return {
			filteredDefinitions: definitionsWithOnlyCommonErrors,
			condensedErrors: commonErrors,
		}
	}

	const combinedErrors = combineAlternatives
		? distinctErrorsPerNode
			.map(e => {
				const uniqueDefinitions = deduplicateGroups(
					e.errors.map(e => e.definitions),
					(a, b) => McdocType.equals(a.definition.typeDef, b.definition.typeDef),
				)
				const ans = {
					definitions: uniqueDefinitions,
					error: combineAlternatives(
						e.errors
							.filter(e => !commonErrors.includes(e.error))
							.map(e => e.error),
					),
				}
				ans.error.nodesWithConflictingErrors = deduplicateGroups(
					e.errors.map(e => e.error.nodesWithConflictingErrors ?? []),
				)
				if (ans.error.nodesWithConflictingErrors.length === 0) {
					ans.error.nodesWithConflictingErrors = undefined
				}

				return ans
			})
		: distinctErrorsPerNode.flatMap(e =>
			e.errors
				.map(ee => ({ definitions: ee.definitions, error: ee.error }))
		)

	const conflictingErrors = combinedErrors
		.filter(e => e.definitions.length < validDefinitions.length)

	const nodesWithConflictingErrors = conflictingErrors
		.map(e => e.error.node)
		.filter((n, i, arr) => arr.indexOf(n) === i)

	for (const error of conflictingErrors) {
		error.error.nodesWithConflictingErrors = nodesWithConflictingErrors
	}

	return {
		filteredDefinitions: validDefinitions,
		condensedErrors: [...commonErrors, ...combinedErrors.map(e => e.error)],
	}
}

/**
 * Deduplicates groups assuming:
 * - There are no duplicates within a group
 * - A group with 1 element implies there is no duplicated group of length 1 with the same element
 *
 * When calling {@link condense}, if a group stems from an error, this should automatically be the
 * case.
 */
function deduplicateGroups<T>(
	definitionGroups: T[][],
	predicate?: (a: T, b: T) => boolean,
): T[] {
	const definitions: T[] = []
	for (let i = 0; i < definitionGroups.length; i++) {
		const group = definitionGroups[i]
		if (group.length === 1) {
			definitions.push(group[0])
			continue
		}
		definitions.push(
			...group
				.filter(v =>
					!definitionGroups.some((og, oi) =>
						(oi > i || og.length === 1)
							&& predicate
							? og.some(ov => predicate(v, ov))
							: og.includes(v)
					)
				),
		)
	}
	return definitions
}

export function getDefaultErrorRange<T extends AstNode>(
	node: RuntimeNode<T>,
	error: McdocRuntimeError<T>['kind'],
): Range {
	const { range } = node.originalNode
	if (error === 'missing_key' || error === 'invalid_collection_length') {
		return { start: range.start, end: range.start + 1 }
	}
	return range
}

export function getDefaultErrorReporter<T>(
	ctx: CheckerContext,
	getErrorRange: (node: RuntimeNode<T>, error: McdocRuntimeError<T>['kind']) => Range,
): ErrorReporter<T> {
	return (error: McdocRuntimeError<T>) => {
		const defaultTranslationKey = error.kind.replaceAll('_', '-')
		let localizedText: string
		let severity = ErrorSeverity.Error
		switch (error.kind) {
			case 'unknown_tuple_element':
				localizedText = localize('expected', localize('nothing'))
				break
			case 'unknown_key':
				if (error.nodesWithConflictingErrors) {
					localizedText = localize(
						'invalid-key-combination',
						arrayToMessage(
							error.nodesWithConflictingErrors.map(n => McdocType.toString(n.inferredType)),
							true,
							'and',
						),
					)
				} else {
					localizedText = localize(
						defaultTranslationKey,
						error.node.inferredType.kind === 'literal'
							? localeQuote(error.node.inferredType.value.value.toString())
							: `<${localize(`mcdoc.type.${error.node.inferredType.kind}`)}>`,
					)
					severity = ErrorSeverity.Warning
				}
				break
			case 'missing_key':
				if (error.keys.length === 1) {
					localizedText = localize(defaultTranslationKey, localeQuote(error.keys[0]))
				} else {
					localizedText = localize(
						'mcdoc.runtime.checker.some-missing-keys',
						arrayToMessage(error.keys),
					)
				}
				break
			case 'invalid_collection_length':
			case 'invalid_string_length':
			case 'number_out_of_range':
				const baseKey = error.kind === 'invalid_collection_length'
					? 'mcdoc.runtime.checker.range.collection'
					: error.kind === 'invalid_string_length'
					? 'mcdoc.runtime.checker.range.string'
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
						return localize('mcdoc.runtime.checker.range.concat', left, right)
					}
					return left ?? right
				}).filter(r => r !== undefined) as string[]
				localizedText = localize(
					'expected',
					localize(baseKey, arrayToMessage(rangeMessages, false)),
				)
				break
			case 'type_mismatch':
				localizedText = localize(
					'expected',
					arrayToMessage(
						error.expected.map(e =>
							e.kind === 'enum'
								? arrayToMessage(
									e.values.map(v => ResourceLocation.shorten(v.value.toString())),
								)
								: e.kind === 'literal'
								? localeQuote(e.value.value.toString())
								: localize(`mcdoc.type.${e.kind}`)
						),
						false,
					),
				)
				break
			case 'expected_key_value_pair':
				localizedText = localize(`mcdoc.runtime.checker.${defaultTranslationKey}`)
				break
			case 'internal':
				break
			default:
				localizedText = localize(defaultTranslationKey)
		}
		ctx.err.report(localizedText!, getErrorRange(error.node, error.kind), severity)
	}
}
