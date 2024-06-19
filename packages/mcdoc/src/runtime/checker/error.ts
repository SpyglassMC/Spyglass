import { boolean, type CheckerContext } from '@spyglassmc/core'
import { NumericRange } from '../../type/index.js'
import {
	type CheckerTreeDefinitionNode,
	isAssignable,
	McdocCheckerOptions,
	type RuntimeNode,
	type RuntimeUnion,
	type SimplifiedMcdocTypeNoUnion,
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

export function condenseErrorsAndFilterSiblings<T>(
	definitions: {
		definition: CheckerTreeDefinitionNode<T>
		errors: McdocRuntimeError<T>[]
	}[],
	context: CheckerContext,
): {
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
		context,
		TypeMismatchError.is,
		(a, b) =>
			a.expected.length === b.expected.length
			&& !a.expected.some(d =>
				!b.expected.some(od => isAssignable(d, od, context) && isAssignable(od, d, context))
			),
		errors => ({
			kind: 'type_mismatch',
			node: errors[0].node,
			expected: deduplicateGroups(
				errors.map(e => e.expected),
				(a, b) => isAssignable(a, b, context) && isAssignable(b, a, context),
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
			context,
			(e): e is SimpleError<T> => e.kind === kind,
			_ => true,
		)
		validDefinitions = simpleErrorResult.filteredDefinitions
		errors.push(...simpleErrorResult.condensedErrors)
	}

	const missingKeyResult = condense(
		validDefinitions,
		context,
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
			context,
			(e): e is RangeError<T> => e.kind === kind,
			(a, b) =>
				a.ranges.length === b.ranges.length
				&& !a.ranges.some(r => !b.ranges.some(or => NumericRange.equals(r, or))),
			errors => ({
				kind,
				node: errors[0].node,
				ranges: deduplicateGroups(errors.map(e => e.ranges), NumericRange.equals),
			}),
		)
		validDefinitions = rangeErrorResult.filteredDefinitions
		errors.push(...rangeErrorResult.condensedErrors)

		const noRangeError = validDefinitions.filter(d => !d.errors.some(e => e.kind === kind))
		if (noRangeError.length !== 0) {
			validDefinitions = noRangeError
		} else {
			const rangesErrors = validDefinitions.map(d => {
				return d.errors
					.filter((e): e is RangeError<T> => e.kind === kind)
					.reduce((a, b) => ({
						kind,
						node: a.node,
						ranges: [NumericRange.intersect(a.ranges[0], b.ranges[0])],
					}))
			})
			if (rangesErrors.length > 0) {
				errors.push({
					kind,
					node: rangesErrors[0].node,
					ranges: rangesErrors.flatMap(e => e.ranges),
				})
			}
		}
	}

	// No condensing needed for duplicate key. If a key is a duplicate in one definition, it really
	// should have been reported by all of them
	validDefinitions[0].errors.filter(e => e.kind === 'duplicate_key')

	const internalErrorResult = condense(
		validDefinitions,
		context,
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

function condense<T, E extends McdocRuntimeError<T>>(
	validDefinitions: ErrorCondensingDefinition<T>[],
	context: CheckerContext,
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
					(a, b) =>
						isAssignable(a.definition.typeDef, b.definition.typeDef, context)
						&& isAssignable(b.definition.typeDef, a.definition.typeDef, context),
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
