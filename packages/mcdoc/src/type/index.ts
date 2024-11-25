import type { FullResourceLocation } from '@spyglassmc/core'
import { Arrayable, Dev } from '@spyglassmc/core'
import type { EnumKind } from '../node/index.js'
import { getRangeDelimiter, RangeKind } from '../node/index.js'

export type Attributes = Attribute[]
export namespace Attributes {
	export function equals(a: Attributes | undefined, b: Attributes | undefined): boolean {
		if (a?.length !== b?.length) {
			return false
		}

		if (!a || !b) {
			return true
		}

		for (let i = 0; i < a.length; i++) {
			if (!Attribute.equals(a[i], b[i])) {
				return false
			}
		}
		return true
	}
}

export interface Attribute {
	name: string
	value?: AttributeValue
}
export namespace Attribute {
	export function equals(a: Attribute, b: Attribute): boolean {
		if (a.name !== b.name) {
			return false
		}

		if (a.value && b.value) {
			return AttributeValue.equals(a.value, b.value)
		}
		return a.value === b.value
	}
}

export type AttributeValue = McdocType | AttributeTreeValue
export interface AttributeTreeValue {
	kind: 'tree'
	values: AttributeTree
}
export interface AttributeTree {
	[key: string | number]: AttributeValue
}
export namespace AttributeValue {
	export function equals(a: AttributeValue, b: AttributeValue): boolean {
		if (a.kind !== b.kind) {
			return false
		}

		if (a.kind === 'tree') {
			if (
				Object.keys(a.values).length !== Object.keys((b as AttributeTreeValue).values).length
			) {
				return false
			}
			for (const kvp of Object.entries(a.values)) {
				const other = (b as AttributeTreeValue).values[kvp[0]]
				if (!other) {
					return false
				}
				if (!equals(kvp[1], other)) {
					return false
				}
			}
			return true
		} else {
			return McdocType.equals(a, b as McdocType)
		}
	}
}

export interface NumericRange<T extends (number | bigint) = (number | bigint)> {
	kind: RangeKind
	min?: T
	max?: T
}
export namespace NumericRange {
	export function isInRange<T extends (number | bigint) = (number | bigint)>(
		range: NumericRange<T>,
		val: T,
	): boolean {
		const { min = -Infinity, max = Infinity } = range
		if (RangeKind.isLeftExclusive(range.kind) ? val <= min : val < min) {
			return false
		}
		if (RangeKind.isRightExclusive(range.kind) ? val >= max : val > max) {
			return false
		}
		return true
	}

	export function equals(a: NumericRange, b: NumericRange): boolean {
		return a.kind === b.kind
			&& a.min === b.min
			&& a.max === b.max
	}

	export function intersect<T extends (number | bigint) = number>(
		a: NumericRange<T>,
		b: NumericRange<T>,
	): NumericRange<T> {
		const min: T | undefined = a.min !== undefined && b.min !== undefined
			? (a.min > b.min ? a.min : b.min)
			: a.min !== undefined
			? a.min
			: b.min
		const max: T | undefined = a.max !== undefined && b.max !== undefined
			? (a.max < b.max ? a.max : b.max)
			: a.max !== undefined
			? a.max
			: b.max

		let kind: RangeKind = 0b00
		if (min === a.min && RangeKind.isLeftExclusive(a.kind)) {
			kind |= 0b10
		} else if (min === b.min && RangeKind.isLeftExclusive(b.kind)) {
			kind |= 0b10
		}
		if (max === a.max && RangeKind.isRightExclusive(a.kind)) {
			kind |= 0b01
		} else if (max === b.max && RangeKind.isRightExclusive(b.kind)) {
			kind |= 0b01
		}
		return { kind: kind as RangeKind, min, max }
	}

	export function toString({ kind, min, max }: NumericRange) {
		return min === max && kind === 0b00
			? min !== undefined ? `${min}` : getRangeDelimiter(kind)
			: `${min ?? ''}${getRangeDelimiter(kind)}${max ?? ''}`
	}
}

export const StaticIndexKeywords = Object.freeze(
	['fallback', 'none', 'unknown', 'spawnitem', 'blockitem'] as const,
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
export type Index =
	| StaticIndex
	| DynamicIndex

/**
 * Corresponds to the IndexBodyNode
 */
export type ParallelIndices = Index[]
export namespace ParallelIndices {
	export function equals(a: ParallelIndices, b: ParallelIndices): boolean {
		if (a.length !== b.length) {
			return false
		}
		for (let i = 0; i < a.length; i++) {
			const first = a[i]
			const second = b[i]
			if (first.kind !== second.kind) {
				return false
			}
			if (first.kind === 'static') {
				return first.value !== (second as StaticIndex).value
			}
			if (first.accessor.length !== (second as DynamicIndex).accessor.length) {
				return false
			}
			for (let j = 0; j < first.accessor.length; j++) {
				const firstAcc = first.accessor[j]
				const secondAcc = (second as DynamicIndex).accessor[j]

				if (typeof firstAcc === 'string' || typeof secondAcc === 'string') {
					if (firstAcc !== secondAcc) {
						return false
					}
				} else if (firstAcc.keyword !== secondAcc.keyword) {
					return false
				}
			}
		}
		return true
	}
}

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
	deprecated?: boolean
	desc?: string
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
	value: string | number | bigint
}

export interface ReferenceType extends McdocBaseType {
	kind: 'reference'
	path?: string
}

export interface UnionType<T extends McdocType = McdocType> extends McdocBaseType {
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

export interface MappedType extends McdocBaseType {
	kind: 'mapped'
	child: McdocType
	mapping: { [path: string]: McdocType }
}

export const EmptyUnion: UnionType<never> = Object.freeze({ kind: 'union', members: [] })
export function createEmptyUnion(attributes?: Attributes): UnionType<never> {
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
	lengthRange?: NumericRange<number>
}

export type LiteralValue =
	| LiteralBooleanValue
	| LiteralStringValue
	| LiteralNumericValue
	| LiteralLongNumberValue
export interface LiteralBooleanValue {
	kind: 'boolean'
	value: boolean
}
export interface LiteralStringValue {
	kind: 'string'
	value: string
}
export interface LiteralNumericValue {
	kind: Exclude<NumericTypeKind, 'long'>
	value: number
}
export interface LiteralLongNumberValue {
	kind: 'long'
	value: bigint
}
export interface LiteralType extends McdocBaseType {
	kind: 'literal'
	value: LiteralValue
}

export interface NumericType extends McdocBaseType {
	kind: Exclude<NumericTypeKind, 'long'>
	valueRange?: NumericRange<number>
}
export interface LongType extends McdocBaseType {
	kind: 'long'
	valueRange?: NumericRange<bigint>
}
export const NumericTypeIntKinds = Object.freeze(['byte', 'short', 'int', 'long'] as const)
export type NumericTypeIntKind = (typeof NumericTypeIntKinds)[number]
export const NumericTypeFloatKinds = Object.freeze(['float', 'double'] as const)
export type NumericTypeFloatKind = (typeof NumericTypeFloatKinds)[number]
export const NumericTypeKinds = Object.freeze(
	[...NumericTypeIntKinds, ...NumericTypeFloatKinds] as const,
)
export type NumericTypeKind = (typeof NumericTypeKinds)[number]

export type PrimitiveArrayType = SmallIntArrayType | LongArrayType
export interface SmallIntArrayType extends McdocBaseType {
	kind: 'byte_array' | 'int_array'
	valueRange?: NumericRange<number>
	lengthRange?: NumericRange<number>
}
export interface LongArrayType extends McdocBaseType {
	kind: 'long_array'
	valueRange?: NumericRange<bigint>
	lengthRange?: NumericRange<number>
}
export const PrimitiveArrayValueKinds = Object.freeze(['byte', 'int', 'long'] as const)
export type PrimitiveArrayValueKind = (typeof PrimitiveArrayValueKinds)[number]
export const PrimitiveArrayKinds = Object.freeze(
	PrimitiveArrayValueKinds.map((kind) => `${kind}_array` as const),
)
export type PrimitiveArrayKind = (typeof PrimitiveArrayKinds)[number]

export interface ListType extends McdocBaseType {
	kind: 'list'
	item: McdocType
	lengthRange?: NumericRange<number>
}

export interface TupleType extends McdocBaseType {
	kind: 'tuple'
	items: McdocType[]
}

export interface McdocBaseType {
	attributes?: Attributes
}

export type McdocType =
	| DispatcherType
	| EnumType
	| KeywordType
	| ListType
	| LiteralType
	| NumericType
	| LongType
	| PrimitiveArrayType
	| ReferenceType
	| StringType
	| StructType
	| TupleType
	| UnionType
	| IndexedType
	| TemplateType
	| ConcreteType
	| MappedType
export namespace McdocType {
	export function equals(a: McdocType, b: McdocType): boolean {
		if (a.kind !== b.kind) {
			return false
		}

		if (!Attributes.equals(a.attributes, b.attributes)) {
			return false
		}

		switch (a.kind) {
			case 'literal':
				return a.value.kind === (b as LiteralType).value.kind
					&& a.value.value === (b as LiteralType).value.value
			case 'byte':
			case 'short':
			case 'int':
			case 'long':
			case 'float':
			case 'double':
				return a.valueRange === (b as NumericType).valueRange
			case 'string':
				return a.lengthRange === (b as StringType).lengthRange
			case 'byte_array':
			case 'int_array':
			case 'long_array':
				return a.lengthRange === (b as PrimitiveArrayType).lengthRange
					&& a.valueRange === (b as PrimitiveArrayType).valueRange
			case 'list':
				return a.lengthRange === (b as ListType).lengthRange
					&& equals(a.item, (b as ListType).item)
			case 'tuple':
				if (a.items.length !== (b as TupleType).items.length) {
					return false
				}
				for (let i = 0; i < a.items.length; i++) {
					if (!equals(a.items[i], (b as TupleType).items[i])) {
						return false
					}
				}
				return true
			case 'struct':
				return a.fields.length === (b as StructType).fields.length && !a.fields.some(f => {
					if (f.kind === 'pair') {
						return !(b as StructType).fields.some(of =>
							of.kind === 'pair'
							&& f.optional === of.optional
							&& f.deprecated === of.deprecated
							&& Attributes.equals(f.attributes, of.attributes)
							&& (typeof f.key === 'string' || typeof of.key === 'string'
								? f.key === of.key
								: equals(f.key, of.key))
							&& equals(f.type, of.type)
						)
					}
					return !(b as StructType).fields.some(of =>
						of.kind === 'spread'
						&& Attributes.equals(f.attributes, of.attributes)
						&& equals(f.type, of.type)
					)
				})
			case 'union':
				if (a.members.length !== (b as UnionType).members.length) {
					return false
				}
				for (let i = 0; i < a.members.length; i++) {
					if (!equals(a.members[i], (b as UnionType).members[i])) {
						return false
					}
				}
				return true
			case 'enum':
				if (
					a.enumKind !== (b as EnumType).enumKind
					|| a.values.length !== (b as EnumType).values.length
				) {
					return false
				}
				for (let i = 0; i < a.values.length; i++) {
					const first = a.values[i]
					const second = (b as EnumType).values[i]

					if (
						first.identifier !== second.identifier || first.value !== second.value
						|| !Attributes.equals(first.attributes, second.attributes)
					) {
						return false
					}
				}
				return true
			case 'reference':
				return a.path === (b as ReferenceType).path
			case 'template':
				if (a.typeParams.length !== (b as TemplateType).typeParams.length) {
					return false
				}
				for (let i = 0; i < a.typeParams.length; i++) {
					if (a.typeParams[i].path !== (b as TemplateType).typeParams[i].path) {
						return false
					}
				}
				return equals(a.child, (b as TemplateType).child)
			case 'concrete':
				if (a.typeArgs.length !== (b as ConcreteType).typeArgs.length) {
					return false
				}
				for (let i = 0; i < a.typeArgs.length; i++) {
					if (!equals(a.typeArgs[i], (b as ConcreteType).typeArgs[i])) {
						return false
					}
				}
				return equals(a.child, (b as ConcreteType).child)
			case 'indexed':
				if (ParallelIndices.equals(a.parallelIndices, (b as IndexedType).parallelIndices)) {
					return false
				}
				return equals(a.child, (b as IndexedType).child)
			case 'dispatcher':
				if (a.registry !== (b as DispatcherType).registry) {
					return false
				}
				return ParallelIndices.equals(a.parallelIndices, (b as IndexedType).parallelIndices)
			case 'mapped':
				if (
					Object.keys(a.mapping).length !== Object.keys((b as MappedType).mapping).length
				) {
					return false
				}
				for (const kvp of Object.entries(a.mapping)) {
					const other = (b as MappedType).mapping[kvp[0]]
					if (!other) {
						return false
					}
					if (!equals(kvp[1], other)) {
						return false
					}
				}
				return equals(a.child, (b as MappedType).child)
			default:
				return true
		}
	}

	export function toString(type: McdocType | undefined): string {
		const rangeToString = (range: NumericRange<any> | undefined): string => {
			return range ? ` @ ${NumericRange.toString(range)}` : ''
		}

		const indicesToString = (indices: Arrayable<Index | undefined>): string => {
			const strings: string[] = []
			for (const index of Arrayable.toArray(indices)) {
				if (index === undefined) {
					strings.push('()')
				} else {
					strings.push(
						index.kind === 'static'
							? `[${index.value}]`
							: `[[${
								index.accessor.map((v) => (typeof v === 'string' ? v : v.keyword)).join('.')
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
				attributesString += `#[${attribute.name}${attribute.value ? '=<value ...>' : ''}] `
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
				typeString = `byte${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
				break
			case 'concrete':
				typeString = `${toString(type.child)}${
					type.typeArgs.length ? `<${type.typeArgs.map(toString).join(', ')}>` : ''
				}`
				break
			case 'dispatcher':
				typeString = `${type.registry ?? 'spyglass:unknown'}[${
					indicesToString(type.parallelIndices)
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
				typeString = `${toString(type.child)}${indicesToString(type.parallelIndices)}`
				break
			case 'int':
				typeString = `int${rangeToString(type.valueRange)}`
				break
			case 'int_array':
				typeString = `int${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
				break
			case 'list':
				typeString = `[${toString(type.item)}]${rangeToString(type.lengthRange)}`
				break
			case 'literal':
				typeString = `${type.value.value}`
				break
			case 'long':
				typeString = `long${rangeToString(type.valueRange)}`
				break
			case 'long_array':
				typeString = `long${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
				break
			case 'mapped':
				typeString = toString(type.child)
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
