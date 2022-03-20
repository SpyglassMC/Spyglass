import type { SymbolPath } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { EnumType, ResolvedIdRegistry, ResolvedRootRegistry } from '../node'

export type ValueRange = [number | undefined, number | undefined]

export interface RegistryIndexData {
	registry: ResolvedRootRegistry | undefined,
	path: (string | { special: 'super' })[],
}

export interface CompoundType {
	type: 'compound',
	symbol: SymbolPath | undefined,
}
export interface RegistryIndexType {
	type: 'index',
	index: RegistryIndexData,
}
export interface ListType {
	type: 'list',
	item: NbtdocType,
	lengthRange?: ValueRange,
}
export interface UnionType {
	type: 'union',
	members: NbtdocType[],
}

export type NbtdocType = {
	type: 'boolean',
} | {
	type: 'string',
} | {
	type: 'byte_array',
	valueRange?: ValueRange,
	lengthRange?: ValueRange,
} | {
	type: 'int_array',
	valueRange?: ValueRange,
	lengthRange?: ValueRange,
} | {
	type: 'long_array',
	valueRange?: ValueRange,
	lengthRange?: ValueRange,
} | {
	type: 'byte',
	valueRange?: ValueRange,
} | {
	type: 'short',
	valueRange?: ValueRange,
} | {
	type: 'int',
	valueRange?: ValueRange,
} | {
	type: 'long',
	valueRange?: ValueRange,
} | {
	type: 'float',
	valueRange?: ValueRange,
} | {
	type: 'double',
	valueRange?: ValueRange,
} | {
	type: 'id',
	registry?: ResolvedIdRegistry,
} | {
	type: 'enum',
	enumType: EnumType | undefined,
	symbol: SymbolPath | undefined,
} | CompoundType | ListType | RegistryIndexType | UnionType
export namespace NbtdocType {
	export function toString(type: NbtdocType | undefined): string {
		const rangeToString = (range: ValueRange | undefined): string => {
			if (!range) {
				return ''
			}
			const [min, max] = range
			return min === max ? ` @ ${min}` : ` @ ${min ?? ''}..${max ?? ''}`
		}

		if (type === undefined) {
			return 'any'
		}
		switch (type.type) {
			case 'boolean':
				return 'boolean'
			case 'byte':
				return `byte${rangeToString(type.valueRange)}`
			case 'byte_array':
				return `byte${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
			case 'compound':
				return type.symbol?.path.join('::') ?? 'compound'
			case 'double':
				return `double${rangeToString(type.valueRange)}`
			case 'enum':
				return type.symbol?.path.join('::') ?? 'enum'
			case 'float':
				return `float${rangeToString(type.valueRange)}`
			case 'id':
				return `id(${type.registry ?? 'spyglassmc:any'})`
			case 'index':
				return `${type.index.registry ?? 'spyglassmc:any'}[]`
			case 'int':
				return `int${rangeToString(type.valueRange)}`
			case 'int_array':
				return `int${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
			case 'list':
				return `[${toString(type.item)}]${rangeToString(type.lengthRange)}`
			case 'long':
				return `long${rangeToString(type.valueRange)}`
			case 'long_array':
				return `long${rangeToString(type.valueRange)}[]${rangeToString(type.lengthRange)}`
			case 'short':
				return `short${rangeToString(type.valueRange)}`
			case 'string':
				return 'string'
			case 'union':
				return `(${type.members.map(toString).join(' | ')})`
		}
	}
}

enum CheckResult {
	Nah = 0b00,
	Assignable = 0b01,
	StrictlyAssignable = 0b11,
}

const areRangesMatch = (s: ValueRange | undefined, t: ValueRange | undefined): boolean => {
	if (!t) {
		return true
	}
	if (!s) {
		return false
	}
	const [sMin, sMax] = s
	const [tMin, tMax] = t
	return (tMin === undefined || (sMin !== undefined && sMin >= tMin)) &&
		(tMax === undefined || (sMax !== undefined && sMax <= tMax))
}

export const flattenUnionType = (union: UnionType): UnionType => {
	const set = new Set<NbtdocType>()
	const add = (data: NbtdocType): void => {
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
		if (member.type === 'union') {
			flattenUnionType(member).members.forEach(add)
		} else {
			add(member)
		}
	}
	return {
		type: 'union',
		members: [...set],
	}
}

export const simplifyUnionType = (union: UnionType): NbtdocType => {
	union = flattenUnionType(union)
	if (union.members.length === 1) {
		return union.members[0]
	}
	return union
}

export const simplifyListType = (list: ListType): ListType => ({
	type: 'list',
	item: simplifyType(list.item),
	...list.lengthRange ? { lengthRange: [...list.lengthRange] } : {},
})

export const simplifyType = (data: NbtdocType): NbtdocType => {
	if (data.type === 'union') {
		data = simplifyUnionType(data)
	} else if (data.type === 'list') {
		data = simplifyListType(data)
	}
	return data
}

const check = (s: NbtdocType, t: NbtdocType, errors: string[] = []): CheckResult => {
	const strictlyAssignableIfTrue = (value: boolean): CheckResult => value ? CheckResult.StrictlyAssignable : CheckResult.Nah
	const assignableIfTrue = (value: boolean): CheckResult => value ? CheckResult.Assignable : CheckResult.Nah
	let ans: CheckResult
	s = simplifyType(s)
	t = simplifyType(t)
	if (s.type === 'union') {
		ans = assignableIfTrue(s.members.every(v => check(v, t, errors)))
	} else if (t.type === 'union') {
		ans = assignableIfTrue(t.members.some(v => check(s, v)))
	} else if (s.type === 'boolean') {
		ans = strictlyAssignableIfTrue(t.type === 'boolean' || t.type === 'byte')
	} else if (s.type === 'byte') {
		if (t.type === 'boolean') {
			ans = check(s, { type: 'byte', valueRange: [0, 1] }, errors)
		} else if (t.type === 'byte') {
			ans = strictlyAssignableIfTrue(areRangesMatch(s.valueRange, t.valueRange))
		} else if (t.type === 'enum') {
			ans = assignableIfTrue(!t.enumType || t.enumType === 'byte')
		} else {
			ans = CheckResult.Nah
		}
	} else if (s.type === 'byte_array' || s.type === 'int_array' || s.type === 'long_array') {
		if (t.type === s.type) {
			ans = strictlyAssignableIfTrue(areRangesMatch(s.lengthRange, t.lengthRange) && areRangesMatch(s.valueRange, t.valueRange))
		} else {
			ans = CheckResult.Nah
		}
	} else if (s.type === 'compound' || s.type === 'index') {
		ans = assignableIfTrue(t.type === 'compound' || t.type === 'index')
	} else if (s.type === 'enum') {
		ans = assignableIfTrue((t.type === 'byte' || t.type === 'float' || t.type === 'double' || t.type === 'int' || t.type === 'long' || t.type === 'short' || t.type === 'string') && (!s.enumType || s.enumType === t.type))
	} else if (s.type === 'float' || s.type === 'double' || s.type === 'int' || s.type === 'long' || s.type === 'short') {
		if (t.type === s.type) {
			ans = strictlyAssignableIfTrue(areRangesMatch(s.valueRange, t.valueRange))
		} else if (t.type === 'enum') {
			ans = assignableIfTrue(!t.enumType || t.enumType === s.type)
		} else {
			ans = CheckResult.Nah
		}
	} else if (s.type === 'id') {
		if (t.type === 'id' && s.registry === t.registry) {
			ans = CheckResult.StrictlyAssignable
		} else {
			ans = assignableIfTrue(t.type === 'id' || t.type === 'string')
		}
	} else if (s.type === 'list') {
		if (t.type === 'list' && areRangesMatch(s.lengthRange, t.lengthRange)) {
			ans = check(s.item, t.item, errors)
		} else {
			ans = CheckResult.Nah
		}
	} else if (s.type === 'string') {
		if (t.type === 'string') {
			ans = CheckResult.StrictlyAssignable
		} else {
			ans = assignableIfTrue(t.type === 'enum' && (!t.enumType || t.enumType === 'string'))
		}
	} else {
		ans = CheckResult.Nah
	}

	if (!ans) {
		errors.push(localize('nbtdoc.checker.type-not-assignable',
			localeQuote(NbtdocType.toString(s)),
			localeQuote(NbtdocType.toString(t))
		))
	}
	return ans
}

export const checkAssignability = ({ source, target }: { source: NbtdocType | undefined, target: NbtdocType | undefined }): {
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
