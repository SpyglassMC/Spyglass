import type { FullResourceLocation, ProcessorContext } from '@spyglassmc/core'
import { Arrayable } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { EnumKind } from '../node/index.js'
import { getRangeDelimiter, RangeKind } from '../node/index.js'

export interface Attribute {
	name: string,
	value?: AttributeValue,
}

export type AttributeValue = McdocType | { kind: 'tree', values: AttributeTree }
export type AttributeTree = { [key: string | number]: AttributeValue }

export type NumericRange = {
	kind: RangeKind,
	min?: number,
	max?: number,
}

export const StaticIndexKeywords = Object.freeze(['fallback', 'none', 'unknown'] as const)
export type StaticIndexKeyword = typeof StaticIndexKeywords[number]
export interface StaticIndex {
	kind: 'static',
	value: string,
}
export interface DynamicIndex {
	kind: 'dynamic',
	accessor: (string | { keyword: 'key' | 'parent' })[]
}
export type Index = StaticIndex | DynamicIndex

/**
 * Corresponds to the IndexBodyNode
 */
export type ParallelIndices = Index[]

export interface DispatcherData {
	registry: FullResourceLocation,
	index: ParallelIndices,
}

export interface TypeBase {
	kind: string,
	attributes?: Attribute[],
	indices?: ParallelIndices[],
}

export interface DispatcherType extends TypeBase, DispatcherData {
	kind: 'dispatcher',
}

export interface StructType extends TypeBase {
	kind: 'struct',
	fields: StructTypeField[]
}
export type StructTypeField = StructTypePairField | StructTypeSpreadField
export interface StructTypePairField {
	kind: 'pair',
	key: string | McdocType,
	type: McdocType,
}
export interface StructTypeSpreadField {
	kind: 'spread',
	attributes?: Attribute[],
	type: McdocType,
}

export interface EnumType extends TypeBase {
	kind: 'enum',
	enumKind?: EnumKind,
	values: EnumTypeField[],
}
export interface EnumTypeField {
	attributes?: Attribute[],
	identifier: string,
	value: string | number | bigint,
}

export interface ReferenceType extends TypeBase {
	kind: 'reference',
	path?: string,
	typeParameters?: McdocType[],
}

export interface UnionType<T extends McdocType = McdocType> extends TypeBase {
	kind: 'union',
	members: T[],
}

export const EmptyUnion: UnionType<never> & NoIndices = Object.freeze({ kind: 'union', members: [] })
export function createEmptyUnion(attributes?: Attribute[]): UnionType<never> & NoIndices {
	return {
		...EmptyUnion,
		attributes,
	}
}

export interface KeywordType extends TypeBase {
	kind: 'any' | 'boolean',
}

export interface StringType extends TypeBase {
	kind: 'string',
	lengthRange?: NumericRange,
}

export type LiteralValue = {
	kind: 'boolean',
	value: boolean,
} | {
	kind: 'string',
	value: string,
} | {
	kind: 'number',
	value: number,
	suffix: 'b' | 's' | 'l' | 'f' | 'd' | undefined,
}
export interface LiteralType extends TypeBase {
	kind: 'literal',
	value: LiteralValue,
}
export const LiteralNumberSuffixes = Object.freeze(['b', 's', 'l', 'f', 'd'] as const)
export type LiteralNumberSuffix = typeof LiteralNumberSuffixes[number]
export const LiteralNumberCaseInsensitiveSuffixes = Object.freeze([...LiteralNumberSuffixes, 'B', 'S', 'L', 'F', 'D'] as const)
export type LiteralNumberCaseInsensitiveSuffix = typeof LiteralNumberCaseInsensitiveSuffixes[number]

export interface NumericType extends TypeBase {
	kind: NumericTypeKind,
	valueRange?: NumericRange,
}
export const NumericTypeIntKinds = Object.freeze(['byte', 'short', 'int', 'long'] as const)
export type NumericTypeIntKind = typeof NumericTypeIntKinds[number]
export const NumericTypeFloatKinds = Object.freeze(['float', 'double'] as const)
export type NumericTypeFloatKind = typeof NumericTypeFloatKinds[number]
export const NumericTypeKinds = Object.freeze([...NumericTypeIntKinds, ...NumericTypeFloatKinds] as const)
export type NumericTypeKind = typeof NumericTypeKinds[number]

export interface PrimitiveArrayType extends TypeBase {
	kind: 'byte_array' | 'int_array' | 'long_array',
	valueRange?: NumericRange,
	lengthRange?: NumericRange,
}
export const PrimitiveArrayValueKinds = Object.freeze(['byte', 'int', 'long'] as const)
export type PrimitiveArrayValueKind = typeof PrimitiveArrayValueKinds[number]
export const PrimitiveArrayKinds = Object.freeze(PrimitiveArrayValueKinds.map(kind => `${kind}_array` as const))
export type PrimitiveArrayKind = typeof PrimitiveArrayKinds[number]

export interface ListType extends TypeBase {
	kind: 'list',
	item: McdocType,
	lengthRange?: NumericRange,
}

export interface TupleType extends TypeBase {
	kind: 'tuple',
	items: McdocType[],
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
export namespace McdocType {
	export function toString(type: McdocType | undefined): string {
		const rangeToString = (range: NumericRange | undefined): string => {
			if (!range) {
				return ''
			}
			const { kind, min, max } = range
			return min === max ? ` @ ${min}` : ` @ ${min ?? ''}${getRangeDelimiter(kind)}${max ?? ''}`
		}

		const indicesToString = (indices: Arrayable<Index | undefined>): string => {
			const strings: string[] = []
			for (const index of Arrayable.toArray(indices)) {
				if (index === undefined) {
					strings.push('()')
				} else {
					strings.push(index.kind === 'static'
						? `[${index.value}]`
						: `[[${index.accessor.map(v => typeof v === 'string' ? v : v.keyword).join('.')}]]`
					)
				}
			}
			return `[${strings.join(', ')}]`
		}

		if (type === undefined) {
			return '<unknown>'
		}
		switch (type.kind) {
			case 'any':
			case 'boolean':
				return type.kind
			case 'byte':
				return `byte${rangeToString(type.valueRange)}`
			case 'byte_array':
				return `byte${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
			case 'dispatcher':
				return `${type.registry ?? 'spyglass:unknown'}[${indicesToString(type.index)}]`
			case 'double':
				return `double${rangeToString(type.valueRange)}`
			case 'enum':
				return '<anonymous_enum>'
			case 'float':
				return `float${rangeToString(type.valueRange)}`
			case 'int':
				return `int${rangeToString(type.valueRange)}`
			case 'int_array':
				return `int${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
			case 'list':
				return `[${toString(type.item)}]${rangeToString(type.lengthRange)}`
			case 'literal':
				return `${type.value}`
			case 'long':
				return `long${rangeToString(type.valueRange)}`
			case 'long_array':
				return `long${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
			case 'reference':
				return type.path ?? '<unknown_reference>'
			case 'short':
				return `short${rangeToString(type.valueRange)}`
			case 'string':
				return `string${rangeToString(type.lengthRange)}`
			case 'struct':
				return '<anonymous_compound>'
			case 'tuple':
				return `[${type.items.map(v => toString(v)).join(',')}${type.items.length === 1 ? ',' : ''}]`
			case 'union':
				return `(${type.members.map(toString).join(' | ')})`
		}
	}
}

/**
 * A type that doesn't include a dispatcher type.
 */
export type DispatchedType = Exclude<McdocType, DispatcherType | UnionType> | UnionType<DispatchedType>
/**
 * A type that doesn't include a reference type.
 */
export type DereferencedType = Exclude<McdocType, ReferenceType | UnionType> | UnionType<DereferencedType>
/**
 * A type that doesn't include a dispatcher type or a reference type.
 */
export type TangibleType = Exclude<McdocType, DispatcherType | ReferenceType | UnionType> | UnionType<TangibleType>
/**
 * A type that is {@link TangibleType} and doesn't have any indices.
 */
export type ResolvedType = (Exclude<McdocType, DispatcherType | ReferenceType | UnionType> | UnionType<ResolvedType>) & NoIndices
type NoIndices = { indices?: undefined }

export interface FlatStructType extends TypeBase {
	kind: 'flat_struct',
	fields: Record<string, McdocType>,
}

enum CheckResult {
	Nah = 0b00,
	Assignable = 0b01,
	StrictlyAssignable = 0b11,
}

const areRangesMatch = (s: NumericRange | undefined, t: NumericRange | undefined): boolean => {
	if (!t) {
		return true
	}
	if (!s) {
		return false
	}
	const { min: sMin, max: sMax } = s
	const { min: tMin, max: tMax } = t
	return (tMin === undefined || (sMin !== undefined && sMin >= tMin)) &&
		(tMax === undefined || (sMax !== undefined && sMax <= tMax))
}

export const flattenUnionType = (union: UnionType): UnionType => {
	const set = new Set<McdocType>()
	const add = (data: McdocType): void => {
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
		if (member.kind === 'union') {
			flattenUnionType(member).members.forEach(add)
		} else {
			add(member)
		}
	}
	return {
		kind: 'union',
		members: [...set],
	}
}

export const unionTypes = (a: McdocType, b: McdocType): McdocType => {
	if ((check(a, b) & CheckResult.StrictlyAssignable) === CheckResult.StrictlyAssignable) {
		return b
	}
	if ((check(b, a) & CheckResult.StrictlyAssignable) === CheckResult.StrictlyAssignable) {
		return a
	}

	const ans: UnionType = {
		kind: 'union',
		members: [
			...a.kind === 'union' ? a.members : [a],
			...b.kind === 'union' ? b.members : [b],
		],
	}
	return ans
}

export const simplifyUnionType = (union: UnionType): McdocType => {
	union = flattenUnionType(union)
	if (union.members.length === 1) {
		return union.members[0]
	}
	return union
}

export const simplifyListType = (list: ListType): ListType => ({
	kind: 'list',
	item: simplifyType(list.item),
	...list.lengthRange ? { lengthRange: { ...list.lengthRange } } : {},
})

export const simplifyType = (data: McdocType): McdocType => {
	if (data.kind === 'union') {
		data = simplifyUnionType(data)
	} else if (data.kind === 'list') {
		data = simplifyListType(data)
	}
	return data
}

const check = (s: McdocType, t: McdocType, errors: string[] = []): CheckResult => {
	const strictlyAssignableIfTrue = (value: boolean): CheckResult => value ? CheckResult.StrictlyAssignable : CheckResult.Nah
	const assignableIfTrue = (value: boolean): CheckResult => value ? CheckResult.Assignable : CheckResult.Nah
	let ans: CheckResult
	s = simplifyType(s)
	t = simplifyType(t)
	if (s.kind === 'any' || s.kind === 'reference' || t.kind === 'reference') {
		// Reference types are treated as any for now.
		ans = CheckResult.Assignable
	} else if (t.kind === 'any') {
		ans = CheckResult.StrictlyAssignable
	} else if (s.kind === 'union') {
		ans = assignableIfTrue(s.members.every(v => check(v, t, errors)))
	} else if (t.kind === 'union') {
		ans = assignableIfTrue(t.members.some(v => check(s, v)))
	} else if (s.kind === 'boolean') {
		ans = strictlyAssignableIfTrue(t.kind === 'boolean' || t.kind === 'byte')
	} else if (s.kind === 'byte') {
		if (t.kind === 'boolean') {
			ans = check(s, { kind: 'byte', valueRange: { kind: RangeKind.II, min: 0, max: 1 } }, errors)
		} else if (t.kind === 'byte') {
			ans = strictlyAssignableIfTrue(areRangesMatch(s.valueRange, t.valueRange))
		} else if (t.kind === 'enum') {
			ans = assignableIfTrue(!t.enumKind || t.enumKind === 'byte')
		} else {
			ans = CheckResult.Nah
		}
	} else if (s.kind === 'byte_array' || s.kind === 'int_array' || s.kind === 'long_array') {
		ans = strictlyAssignableIfTrue(t.kind === s.kind && areRangesMatch(s.lengthRange, t.lengthRange) && areRangesMatch(s.valueRange, t.valueRange))
	} else if (s.kind === 'struct' || s.kind === 'dispatcher') {
		ans = assignableIfTrue(t.kind === 'struct' || t.kind === 'dispatcher')
	} else if (s.kind === 'enum') {
		ans = assignableIfTrue((t.kind === 'byte' || t.kind === 'float' || t.kind === 'double' || t.kind === 'int' || t.kind === 'long' || t.kind === 'short' || t.kind === 'string') && (!s.enumKind || s.enumKind === t.kind))
	} else if (s.kind === 'float' || s.kind === 'double' || s.kind === 'int' || s.kind === 'long' || s.kind === 'short') {
		if (t.kind === s.kind) {
			ans = strictlyAssignableIfTrue(areRangesMatch(s.valueRange, t.valueRange))
		} else if (t.kind === 'enum') {
			ans = assignableIfTrue(!t.enumKind || t.enumKind === s.kind)
		} else {
			ans = CheckResult.Nah
		}
	} else if (s.kind === 'list') {
		if (t.kind === 'list' && areRangesMatch(s.lengthRange, t.lengthRange)) {
			ans = check(s.item, t.item, errors)
		} else {
			ans = CheckResult.Nah
		}
	} else if (s.kind === 'string') {
		if (t.kind === 'string') {
			ans = CheckResult.StrictlyAssignable
		} else {
			ans = assignableIfTrue(t.kind === 'enum' && (!t.enumKind || t.enumKind === 'string'))
		}
	} else {
		ans = CheckResult.Nah
	}

	if (!ans) {
		errors.push(localize('mcdoc.checker.type-not-assignable',
			localeQuote(McdocType.toString(s)),
			localeQuote(McdocType.toString(t))
		))
	}
	return ans
}

export const checkAssignability = ({ source, target }: { source: McdocType | undefined, target: McdocType | undefined }): {
	isAssignable: boolean,
	errorMessage?: string,
} => {
	if (source === undefined || target === undefined) {
		return { isAssignable: true }
	}

	const errors: string[] = []

	check(source, target, errors)

	return {
		isAssignable: errors.length === 0,
		...errors.length ? { errorMessage: errors.reverse().map((m, i) => `${'  '.repeat(i)}${m}`).join('\n') } : {},
	}
}

/**
 * https://spyglassmc.com/user/mcdoc/#p-RuntimeValue
 */
export interface RuntimeValue {
	asString(): string | undefined
	getKeyOnParent(): RuntimeValue | undefined
	getParent(): RuntimeValue | undefined
	getValue(key: string): RuntimeValue | undefined
}

export function resolveType(inputType: McdocType, ctx: ProcessorContext, value: RuntimeValue | undefined): ResolvedType {
	const type = getTangibleType(inputType, ctx, value)

	let ans: ResolvedType = ((): ResolvedType => {
		if (type.kind === 'union') {
			return {
				kind: 'union',
				members: type.members.map(t => resolveType(t, ctx, value)),
				attributes: type.attributes,
			}
		} else {
			return {
				...type,
				indices: undefined,
			}
		}
	})()

	for (const parallelIndices of type.indices ?? []) {
		ans = navigateParallelIndices(ans, parallelIndices, ctx, value)
	}

	return ans
}

function dispatchType(type: DispatcherType, ctx: ProcessorContext): DispatchedType {
	throw '// TODO'
}

function dereferenceType(type: ReferenceType, ctx: ProcessorContext): DereferencedType {
	throw '// TODO'
}

function getTangibleType(type: McdocType, ctx: ProcessorContext, value: RuntimeValue | undefined): TangibleType {
	let ans: TangibleType
	if (type.kind === 'dispatcher') {
		const dispatchedType = dispatchType(type, ctx)
		return getTangibleType(dispatchedType, ctx, value)
	} else if (type.kind === 'reference') {
		const dereferencedType = dereferenceType(type, ctx)
		return getTangibleType(dereferencedType, ctx, value)
	} else if (type.kind === 'union') {
		ans = mapUnion(type, t => getTangibleType(t, ctx, value))
	} else {
		ans = type
	}
	return ans
}

function navigateParallelIndices(type: ResolvedType, indices: ParallelIndices, ctx: ProcessorContext, value: RuntimeValue | undefined): ResolvedType {
	if (indices.length === 1) {
		return navigateIndex(type, indices[0], ctx, value)
	} else {
		return {
			kind: 'union',
			members: indices.map(i => navigateIndex(type, i, ctx, value)),
			attributes: type.attributes,
		}
	}
}

function navigateIndex(type: ResolvedType, index: Index, ctx: ProcessorContext, value: RuntimeValue | undefined): ResolvedType {
	if (type.kind === 'struct') {
		const key = index.kind === 'static'
			? typeof index.value === 'string' ? index.value : undefined // Special static indices have no meaning on structs.
			: resolveDynamicIndex(index, value)
		if (key === undefined) {
			return createEmptyUnion(type.attributes)
		}
		const flatStruct = flattenStruct(type, ctx, value)
		return resolveType(flatStruct.fields[key], ctx, value)
	} else if (type.kind === 'union') {
		return mapUnion(type, t => navigateIndex(t, index, ctx, value))
	} else {
		return createEmptyUnion(type.attributes)
	}
}

function resolveDynamicIndex(index: DynamicIndex, value: RuntimeValue | undefined): string | undefined {
	for (const key of index.accessor) {
		if (value === undefined) {
			break
		}
		if (typeof key === 'string') {
			value = value.getValue(key)
		} else if (key.keyword === 'key') {
			value = value.getKeyOnParent()
		} else if (key.keyword === 'parent') {
			value = value.getParent()
		}
	}
	return value?.asString()
}

function mapUnion<T extends McdocType, U extends McdocType>(type: UnionType<T> & NoIndices, mapper: (this: void, t: T) => U): UnionType<U> & NoIndices
function mapUnion<T extends McdocType, U extends McdocType>(type: UnionType<T>, mapper: (this: void, t: T) => U): UnionType<U>
function mapUnion<T extends McdocType, U extends McdocType>(type: UnionType<T>, mapper: (this: void, t: T) => U): UnionType<U> {
	const ans: UnionType<U> = {
		kind: 'union',
		members: type.members.map(mapper),
		attributes: type.attributes,
		indices: type.indices,
	}
	return ans
}

function flattenStruct(type: StructType & NoIndices, ctx: ProcessorContext, value: RuntimeValue | undefined): FlatStructType & NoIndices
function flattenStruct(type: StructType, ctx: ProcessorContext, value: RuntimeValue | undefined): FlatStructType
function flattenStruct(type: StructType, ctx: ProcessorContext, value: RuntimeValue | undefined): FlatStructType {
	const ans: FlatStructType = {
		kind: 'flat_struct',
		fields: Object.create(null),
		attributes: type.attributes,
		indices: type.indices,
	}
	for (const field of type.fields) {
		if (field.kind === 'spread') {
			const target = resolveType(field.type, ctx, value)
			addAttributes(ans, ...target.attributes ?? [])
			if (target.kind === 'struct') {
				const flatTarget = flattenStruct(target, ctx, value)
				for (const [key, value] of Object.entries(flatTarget)) {
					ans.fields[key] = value
				}
			}
		} else {
			if (typeof field.key === 'string') {
				ans.fields[field.key] = field.type
			} else {
				// TODO: Handle map keys
			}
		}
	}
	return ans
}

function addAttributes(type: TypeBase, ...attributes: Attribute[]): void {
	for (const attr of attributes) {
		type.attributes ??= []
		if (!type.attributes.some(a => a.name === attr.name)) {
			type.attributes.push(attr)
		}
	}
}
