import { NumericRange } from '../../type/index.js'
import type {
	CheckerTreeDefinitionNode,
	RuntimeNode,
	RuntimeUnion,
	SimplifiedMcdocType,
} from './index.js'

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
		| 'internal'
	node: RuntimeNode<T>
}
export namespace SimpleError {
	export function is<T>(error: McdocCheckerError<T> | undefined): error is SimpleError<T> {
		return error?.kind === 'unknown_key'
			|| error?.kind === 'duplicate_key'
			|| error?.kind === 'some_missing_keys'
			|| error?.kind === 'sometimes_type_mismatch'
			|| error?.kind === 'expected_key_value_pair'
			|| error?.kind === 'internal'
	}
}

export interface UnknownVariantWithKeyCombinationError<T> {
	kind: 'invalid_key_combination'
	node: RuntimeNode<T>[]
}
export namespace UnknownVariantWithKeyCombinationError {
	export function is<T>(
		error: McdocCheckerError<T> | undefined,
	): error is UnknownVariantWithKeyCombinationError<T> {
		return error?.kind === 'invalid_key_combination'
	}
}

export interface UnknownTupleElementError<T> {
	kind: 'unknown_tuple_element'
	node: RuntimeUnion<T>
}
export namespace UnknownTupleElementError {
	export function is<T>(
		error: McdocCheckerError<T> | undefined,
	): error is UnknownTupleElementError<T> {
		return error?.kind === 'unknown_tuple_element'
	}
}

export interface RangeError<T> {
	kind:
		| 'invalid_collection_length'
		| 'invalid_string_length'
		| 'number_out_of_range'
	node: RuntimeNode<T>
	ranges: NumericRange[]
}
export namespace RangeError {
	export function is<T>(error: McdocCheckerError<T> | undefined): error is RangeError<T> {
		return error?.kind === 'invalid_collection_length'
			|| error?.kind === 'invalid_string_length'
			|| error?.kind === 'number_out_of_range'
	}
}

export interface MissingKeyError<T> {
	kind: 'missing_key'
	node: RuntimeNode<T>
	key: string
}
export namespace MissingKeyError {
	export function is<T>(error: McdocCheckerError<T> | undefined): error is MissingKeyError<T> {
		return error?.kind === 'missing_key'
	}
}

export interface TypeMismatchError<T> {
	node: RuntimeNode<T>
	kind: 'type_mismatch'
	expected: SimplifiedMcdocType
}
export namespace TypeMismatchError {
	export function is<T>(error: McdocCheckerError<T> | undefined): error is TypeMismatchError<T> {
		return error?.kind === 'type_mismatch'
	}
}

export interface ErrorCondensingDefinition<T> {
	definition: CheckerTreeDefinitionNode<T>
	errors: McdocCheckerError<T>[]
}

export function condenseErrorsAndFilterSiblings<T>(
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
	const errors = validDefinitions[0].errors.filter(e => e.kind === 'duplicate_key')

	const alwaysMismatch: TypeMismatchError<T>[] = (validDefinitions[0].errors
		.filter(e =>
			e.kind === 'type_mismatch'
			&& !validDefinitions.some(d =>
				!d.errors.some(oe =>
					oe.kind === 'type_mismatch'
					&& e.node.originalNode === oe.node.originalNode
				)
			)
		) as TypeMismatchError<T>[])
		.map(e => {
			const expected = validDefinitions
				.map(d =>
					(d.errors.find(oe =>
						oe.kind === 'type_mismatch'
						&& oe.node.originalNode === e.node.originalNode
					) as TypeMismatchError<T>).expected
				)
				.flatMap(t => t.kind === 'union' ? t.members : [t])
				.filter((d, i, arr) => arr.findIndex(od => od.kind === d.kind) === i)
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
			e.kind === 'sometimes_type_mismatch'
			|| (e.kind === 'type_mismatch'
				&& !alwaysMismatch.some(oe => oe.node.originalNode === e.node.originalNode))
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
						e.kind === 'type_mismatch'
						&& !alwaysMismatch.some(oe => oe.node.originalNode === e.node.originalNode)
					)
			)
			.map(e => e.node as RuntimeNode<T>)
			.concat(
				validDefinitions.flatMap(d => d.errors).filter(e =>
					e.kind === 'sometimes_type_mismatch'
				).map(e => e.node as RuntimeNode<T>),
			)
			.filter((v, i, arr) => arr.findIndex(o => o.originalNode === v.originalNode) === i)
			.map(n => ({ kind: 'sometimes_type_mismatch', node: n }))

		errors.push(...typeMismatches)
	}

	const alwaysUnknown = validDefinitions[0].errors
		.filter(e =>
			e.kind === 'unknown_key'
			&& !validDefinitions.some(d =>
				!d.errors.some(oe =>
					oe.kind === 'unknown_key'
					&& e.node.originalNode === oe.node.originalNode
				)
			)
		) as SimpleError<T>[]
	errors.push(...alwaysUnknown)

	const onlyCommonUnknownKeys = validDefinitions
		.filter(d =>
			!d.errors.some(e =>
				e.kind === 'invalid_key_combination'
				|| (e.kind === 'unknown_key'
					&& !alwaysUnknown.some(oe => oe.node.originalNode === e.node.originalNode))
			)
		)
	if (onlyCommonUnknownKeys.length !== 0) {
		validDefinitions = onlyCommonUnknownKeys
	} else {
		const unknownKeys = validDefinitions
			.flatMap(d =>
				d.errors
					.filter(e =>
						e.kind === 'unknown_key'
						&& !alwaysUnknown.some(oe => oe.node.originalNode === e.node.originalNode)
					)
			)
			.map(e => e.node as RuntimeNode<T>)
			.concat(
				validDefinitions.flatMap(d => d.errors).filter(e =>
					e.kind === 'invalid_key_combination'
				).map(e => e.node as RuntimeNode<T>),
			)
			.filter((v, i, arr) => arr.findIndex(o => o.originalNode === v.originalNode) === i)

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
					e.kind === 'expected_key_value_pair'
					&& arr.findIndex(oe =>
							oe.kind === 'expected_key_value_pair'
							&& oe.node.originalNode === e.node.originalNode
						) === i
				),
		)
	}

	const noUnknownTupleElements = validDefinitions.filter(d =>
		!d.errors.some(e => e.kind === 'unknown_tuple_element')
	)
	if (noUnknownTupleElements.length !== 0) {
		validDefinitions = noUnknownTupleElements
	}

	const alwaysMissing = validDefinitions[0].errors.filter(e =>
		e.kind === 'missing_key'
		&& !validDefinitions.some(d =>
			!d.errors.some(oe =>
				oe.kind === 'missing_key'
				&& oe.node.originalNode === e.node.originalNode
				&& oe.key === e.key
			)
		)
	) as MissingKeyError<T>[]
	errors.push(...alwaysMissing)
	const onlyCommonMissing = validDefinitions
		.filter(d =>
			!d.errors.some(e =>
				e.kind === 'some_missing_keys'
				|| (e.kind === 'missing_key'
					&& !alwaysMissing.some(oe => oe.node.originalNode === e.node.originalNode))
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
							e.kind === 'missing_key'
							&& !alwaysMissing.some(oe => oe.node.originalNode === e.node.originalNode)
						)
				)
				.map(e => e.node as RuntimeNode<T>)
				.concat(
					validDefinitions.flatMap(d => d.errors).filter(e => e.kind === 'some_missing_keys')
						.map(e => e.node as RuntimeNode<T>),
				)
				.filter((v, i, arr) => arr.findIndex(o => o.originalNode === v.originalNode) === i)
				.map(n => ({
					kind: 'some_missing_keys' as 'some_missing_keys',
					node: n,
				})),
		)
	}

	for (
		const kind of [
			'invalid_collection_length',
			'invalid_string_length',
			'number_out_of_range',
		] as const
	) {
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

	errors.push(
		...validDefinitions.flatMap(d => d.errors.filter(e => e.kind === 'internal')),
	)

	return {
		definitions: validDefinitions.map(d => d.definition),
		condensedErrors: errors,
	}
}

function condense<T extends McdocCheckerError<T>>(
	validDefinitions: ErrorCondensingDefinition<T>[],
	is: (e: McdocCheckerError<T>) => e is T,
	equals: (a: T, b: T) => boolean,
	combine: (a: T, b: T) => T,
	combineAlternatives: (errors: T[]) => T,
): { condensedErrors: T[]; filteredDefinitions: ErrorCondensingDefinition<T>[] } {
	// TODO a lot of O(n^2) in this function, may need optimization
	const condensedPerDefinition = validDefinitions
		.map(def => {
			const errorsPerNode = def.errors
				.filter(is)
				.reduce((errors, error) => {
					const i = errors.findIndex(oe => oe.node === error.node)
					if (i >= 0) {
						const existingError = errors[i]
						errors[i] = combine(existingError, error)
					} else {
						errors.push(error)
					}
					return errors
				}, [] as T[])

			return { def, errors: errorsPerNode }
		})

	if (condensedPerDefinition.some(d => d.errors.length === 0)) {
		return {
			condensedErrors: [],
			filteredDefinitions: condensedPerDefinition
				.filter(d => d.errors.length === 0)
				.map(e => e.def),
		}
	}

	const distinctErrorsPerNode = condensedPerDefinition
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
		}, [] as { errors: { error: T; definitions: ErrorCondensingDefinition<T>[] }[] }[])

	const distinctErrors = distinctErrorsPerNode.flatMap(e => e.errors)
	const definitionsWithUncommonErrors = distinctErrors
		.filter(e => e.definitions.length < validDefinitions.length)
		.flatMap(e => e.definitions)

	const definitionsWithOnlyCommonErrors = validDefinitions
		.filter(d => !definitionsWithUncommonErrors.includes(d))

	if (definitionsWithOnlyCommonErrors.length > 0) {
		const commonErrors = distinctErrorsPerNode
			.map(e => {
				const commonErrorsOfNode = e.errors
					.filter(e => e.definitions.length === validDefinitions.length)
					.map(e => e.error)

				if (commonErrorsOfNode.length === 0) {
					return undefined
				}
				return (combineAlternatives(commonErrorsOfNode))
			})
			.filter((e): e is T => e !== undefined)
		return {
			filteredDefinitions: definitionsWithOnlyCommonErrors,
			condensedErrors: commonErrors,
		}
	}

	const combinedErrors = distinctErrorsPerNode
		// TODO The error needs to be marked as only sometimes applicable when there is a definition
		// That did not report an error on this node at all.
		.map(e => combineAlternatives(e.errors.map(err => err.error)))

	return { filteredDefinitions: validDefinitions, condensedErrors: combinedErrors }
}
