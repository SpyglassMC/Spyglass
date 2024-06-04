import type { FullResourceLocation, ProcessorContext } from '@spyglassmc/core'
import { Arrayable, Dev } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { EnumKind } from '../node/index.js'
import { getRangeDelimiter, RangeKind } from '../node/index.js'

export interface Attribute {
	name: string
	value?: AttributeValue
}

export type AttributeValue = McdocType | { kind: 'tree'; values: AttributeTree }
export type AttributeTree = { [key: string | number]: AttributeValue }

export type NumericRange = {
	kind: RangeKind
	min?: number
	max?: number
}
export namespace NumericRange {
	export function isInRange(range: NumericRange, val: number): boolean {
		if (
			range.min !== undefined && (RangeKind.isLeftExclusive(range.kind)
				? val <= range.min
				: val < range.min)
		) {
			return false
		}
		if (
			range.max !== undefined && (RangeKind.isLeftExclusive(range.kind)
				? val <= range.max
				: val < range.max)
		) {
			return false
		}
		return true
	}
}

export const StaticIndexKeywords = Object.freeze(
	[
		'fallback',
		'none',
		'unknown',
		'spawnitem',
		'blockitem',
	] as const,
)
export type StaticIndexKeyword = (typeof StaticIndexKeywords)[number]
export interface StaticIndex {
	kind: 'static'
	value: string
}
export interface DynamicIndex {
	kind: 'dynamic'
	accessor: (string | { keyword: 'key' | 'parent' })[]
}
export type Index = StaticIndex | DynamicIndex

/**
 * Corresponds to the IndexBodyNode
 */
export type ParallelIndices = Index[]

export interface DispatcherData {
	registry: FullResourceLocation
	parallelIndices: ParallelIndices
}

export interface DispatcherType extends DispatcherData, McdocBaseType {
	kind: 'dispatcher'
}

export interface StructType extends McdocBaseType {
	kind: 'struct'
	fields: StructTypeField[]
}
export type StructTypeField = StructTypePairField | StructTypeSpreadField
export interface StructTypePairField extends McdocBaseType {
	kind: 'pair'
	key: string | McdocType
	type: McdocType
	optional?: boolean
}
export interface StructTypeSpreadField extends McdocBaseType {
	kind: 'spread'
	type: McdocType
}

export interface EnumType extends McdocBaseType {
	kind: 'enum'
	enumKind?: EnumKind
	values: EnumTypeField[]
}
export interface EnumTypeField extends McdocBaseType {
	identifier: string
	value: string | number
}

export interface ReferenceType extends McdocBaseType {
	kind: 'reference'
	path?: string
}

export interface UnionType<T extends McdocType = McdocType>
	extends McdocBaseType
{
	kind: 'union'
	members: T[]
}

export interface IndexedType extends McdocBaseType {
	kind: 'indexed'
	parallelIndices: Index[]
	child: McdocType
}

export interface TemplateType extends McdocBaseType {
	kind: 'template'
	child: McdocType
	typeParams: { path: string }[]
}

export interface ConcreteType extends McdocBaseType {
	kind: 'concrete'
	child: McdocType
	typeArgs: McdocType[]
}

export const EmptyUnion: UnionType<never> = Object.freeze({
	kind: 'union',
	members: [],
})
export function createEmptyUnion(
	attributes?: Attribute[],
): UnionType<never> {
	return {
		...EmptyUnion,
		// attributes,
	}
}

export interface KeywordType extends McdocBaseType {
	kind: 'any' | 'boolean' | 'unsafe'
}

export interface StringType extends McdocBaseType {
	kind: 'string'
	lengthRange?: NumericRange
}

export type LiteralValue =
	| LiteralBooleanValue
	| LiteralStringValue
	| LiteralNumericValue
export interface LiteralBooleanValue {
	kind: 'boolean'
	value: boolean
}
export interface LiteralStringValue {
	kind: 'string'
	value: string
}
export interface LiteralNumericValue {
	kind: NumericTypeKind
	value: number
}
export interface LiteralType extends McdocBaseType {
	kind: 'literal'
	value: LiteralValue
}

export interface NumericType extends McdocBaseType {
	kind: NumericTypeKind
	valueRange?: NumericRange
}
export const NumericTypeIntKinds = Object.freeze(
	[
		'byte',
		'short',
		'int',
		'long',
	] as const,
)
export type NumericTypeIntKind = (typeof NumericTypeIntKinds)[number]
export const NumericTypeFloatKinds = Object.freeze(['float', 'double'] as const)
export type NumericTypeFloatKind = (typeof NumericTypeFloatKinds)[number]
export const NumericTypeKinds = Object.freeze(
	[
		...NumericTypeIntKinds,
		...NumericTypeFloatKinds,
	] as const,
)
export type NumericTypeKind = (typeof NumericTypeKinds)[number]

export interface PrimitiveArrayType extends McdocBaseType {
	kind: 'byte_array' | 'int_array' | 'long_array'
	valueRange?: NumericRange
	lengthRange?: NumericRange
}
export const PrimitiveArrayValueKinds = Object.freeze(
	[
		'byte',
		'int',
		'long',
	] as const,
)
export type PrimitiveArrayValueKind = (typeof PrimitiveArrayValueKinds)[number]
export const PrimitiveArrayKinds = Object.freeze(
	PrimitiveArrayValueKinds.map((kind) => `${kind}_array` as const),
)
export type PrimitiveArrayKind = (typeof PrimitiveArrayKinds)[number]

export interface ListType extends McdocBaseType {
	kind: 'list'
	item: McdocType
	lengthRange?: NumericRange
}

export interface TupleType extends McdocBaseType {
	kind: 'tuple'
	items: McdocType[]
}

export interface McdocBaseType {
	attributes?: Attribute[]
}

export type McdocType =
	| DispatcherType
	| EnumType
	| KeywordType
	| ListType
	| LiteralType
	| NumericType
	| PrimitiveArrayType
	| ReferenceType
	| StringType
	| StructType
	| TupleType
	| UnionType
	| IndexedType
	| TemplateType
	| ConcreteType
export namespace McdocType {
	export function toString(type: McdocType | undefined): string {
		const rangeToString = (range: NumericRange | undefined): string => {
			if (!range) {
				return ''
			}
			const { kind, min, max } = range
			return min === max
				? ` @ ${min}`
				: ` @ ${min ?? ''}${getRangeDelimiter(kind)}${max ?? ''}`
		}

		const indicesToString = (
			indices: Arrayable<Index | undefined>,
		): string => {
			const strings: string[] = []
			for (const index of Arrayable.toArray(indices)) {
				if (index === undefined) {
					strings.push('()')
				} else {
					strings.push(
						index.kind === 'static'
							? `[${index.value}]`
							: `[[${
								index.accessor
									.map((v) => (typeof v === 'string' ? v : v.keyword))
									.join('.')
							}]]`,
					)
				}
			}
			return `[${strings.join(', ')}]`
		}

		if (type === undefined) {
			return '<unknown>'
		}
		let attributesString = ''
		if (type.attributes?.length) {
			for (const attribute of type.attributes) {
				attributesString += `#[${attribute.name}${
					attribute.value ? '=<value ...>' : ''
				}] `
			}
		}
		let typeString: string
		switch (type.kind) {
			case 'any':
			case 'boolean':
				typeString = type.kind
				break
			case 'byte':
				typeString = `byte${rangeToString(type.valueRange)}`
				break
			case 'byte_array':
				typeString = `byte${rangeToString(type.valueRange)}[]${
					rangeToString(
						type.lengthRange,
					)
				}`
				break
			case 'concrete':
				typeString = `${toString(type.child)}${
					type.typeArgs.length
						? `<${type.typeArgs.map(toString).join(', ')}>`
						: ''
				}`
				break
			case 'dispatcher':
				typeString = `${type.registry ?? 'spyglass:unknown'}[${
					indicesToString(
						type.parallelIndices,
					)
				}]`
				break
			case 'double':
				typeString = `double${rangeToString(type.valueRange)}`
				break
			case 'enum':
				typeString = '<enum ...>'
				break
			case 'float':
				typeString = `float${rangeToString(type.valueRange)}`
				break
			case 'indexed':
				typeString = `${toString(type.child)}${
					indicesToString(type.parallelIndices)
				}`
				break
			case 'int':
				typeString = `int${rangeToString(type.valueRange)}`
				break
			case 'int_array':
				typeString = `int${rangeToString(type.valueRange)}[]${
					rangeToString(
						type.lengthRange,
					)
				}`
				break
			case 'list':
				typeString = `[${toString(type.item)}]${
					rangeToString(type.lengthRange)
				}`
				break
			case 'literal':
				typeString = `${type.value}`
				break
			case 'long':
				typeString = `long${rangeToString(type.valueRange)}`
				break
			case 'long_array':
				typeString = `long${rangeToString(type.valueRange)}[]${
					rangeToString(
						type.lengthRange,
					)
				}`
				break
			case 'reference':
				typeString = type.path ?? '<unknown_reference>'
				break
			case 'short':
				typeString = `short${rangeToString(type.valueRange)}`
				break
			case 'string':
				typeString = `string${rangeToString(type.lengthRange)}`
				break
			case 'struct':
				typeString = '<struct ...>'
				break
			case 'template':
				typeString = `${toString(type.child)}${
					type.typeParams.length
						? `<${type.typeParams.map((v) => `?${v.path}`).join(', ')}>`
						: ''
				}`
				break
			case 'tuple':
				typeString = `[${type.items.map((v) => toString(v)).join(',')}${
					type.items.length === 1 ? ',' : ''
				}]`
				break
			case 'union':
				typeString = `(${type.members.map(toString).join(' | ')})`
				break
			case 'unsafe':
				typeString = 'unsafe'
				break
			default:
				Dev.assertNever(type)
		}
		return attributesString + typeString
	}
}

export interface UseStatementBindingData {
	target: readonly string[]
}
