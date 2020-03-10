import { LintConfig } from './Config'
import { quoteString, toLintedString, toJsonString } from '../utils/utils'
import Formattable, { ToFormattedString } from './Formattable'
import JsonConvertible, { ToJsonString } from './JsonConvertible'

export const NbtTagType = Symbol()
export const NbtContentTagType = Symbol()
export const NbtEnclosingCompound = Symbol()

export type NbtTagTypeName =
    'compound' | 'list' | 'byte_array' | 'int_array' | 'long_array' |
    'byte' | 'short' | 'int' | 'long' | 'string' | 'float' | 'double'

export type NbtTag = (number | BigInt | string | object | any[]) & { [NbtTagType]: NbtTagTypeName, [NbtEnclosingCompound]: NbtCompoundTag | null } & Formattable
export type NbtByteTag = NbtTag & number & { [NbtTagType]: 'byte' } & Formattable & JsonConvertible
export type NbtShortTag = NbtTag & number & { [NbtTagType]: 'short' } & Formattable
export type NbtIntTag = NbtTag & number & { [NbtTagType]: 'int' } & Formattable
export type NbtLongTag = NbtTag & BigInt & { [NbtTagType]: 'long' } & Formattable
export type NbtFloatTag = NbtTag & number & { [NbtTagType]: 'float' } & Formattable
export type NbtDoubleTag = NbtTag & number & { [NbtTagType]: 'double' } & Formattable & JsonConvertible
export type NbtStringTag = NbtTag & string & { [NbtTagType]: 'string' } & Formattable & JsonConvertible
export type NbtListTag = NbtTag & NbtTag[] & { [NbtTagType]: 'list', [NbtContentTagType]: NbtTagTypeName } & Formattable
export type NbtByteArrayTag = NbtTag & NbtByteTag[] & { [NbtTagType]: 'byte_array' } & Formattable
export type NbtIntArrayTag = NbtTag & NbtIntTag[] & { [NbtTagType]: 'int_array' } & Formattable
export type NbtLongArrayTag = NbtTag & NbtLongTag[] & { [NbtTagType]: 'long_array' } & Formattable
export type NbtCompoundTag = NbtTag & { [key: string]: NbtTag, [NbtTagType]: 'compound' } & Formattable & JsonConvertible

export const isNbtByteTag = (val: any): val is NbtByteTag => val[NbtTagType] === 'byte'
export const isNbtShortTag = (val: any): val is NbtShortTag => val[NbtTagType] === 'short'
export const isNbtIntTag = (val: any): val is NbtIntTag => val[NbtTagType] === 'int'
export const isNbtLongTag = (val: any): val is NbtLongTag => val[NbtTagType] === 'long'
export const isNbtFloatTag = (val: any): val is NbtFloatTag => val[NbtTagType] === 'float'
export const isNbtDoubleTag = (val: any): val is NbtDoubleTag => val[NbtTagType] === 'double'
export const isNbtStringTag = (val: any): val is NbtStringTag => val[NbtTagType] === 'string'
export const isNbtByteArrayTag = (val: any): val is NbtByteArrayTag => val[NbtTagType] === 'byte_array'
export const isNbtIntArrayTag = (val: any): val is NbtIntArrayTag => val[NbtTagType] === 'int_array'
export const isNbtLongArrayTag = (val: any): val is NbtLongArrayTag => val[NbtTagType] === 'long_array'
export const isNbtListTag = (val: any): val is NbtListTag => val[NbtTagType] === 'list'
export const isNbtCompoundTag = (val: any): val is NbtCompoundTag => val[NbtTagType] === 'compound'

function getArrayPrefix(type: 'byte_array' | 'int_array' | 'long_array', lint: LintConfig) {
    const prefix = type[0].toUpperCase()
    return `[${prefix}${getSemicolon(lint)}`
}

function getSemicolon({ snbtAppendSpaceAfterSemicolon }: LintConfig) {
    return `;${snbtAppendSpaceAfterSemicolon ? ' ' : ''}`
}

export function getComma({ snbtAppendSpaceAfterComma }: LintConfig) {
    return `,${snbtAppendSpaceAfterComma ? ' ' : ''}`
}

function getColon({ snbtAppendSpaceAfterComma }: LintConfig) {
    return `:${snbtAppendSpaceAfterComma ? ' ' : ''}`
}

function getNbtPrimitiveArrayTag(val: (NbtByteTag | NbtIntTag | NbtLongTag)[], type: 'byte_array' | 'int_array' | 'long_array', enclosingCompound: NbtCompoundTag | null = null): NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtEnclosingCompound]: enclosingCompound,
        [NbtTagType]: type,
        [ToFormattedString]: (lint: LintConfig) => {
            const body = `${getArrayPrefix(type, lint)}${val.map(v => v[ToFormattedString](lint)).join(getComma(lint))}`
            return `${body[body.length - 1] !== ' ' ? body : body.slice(0, -1)}]`
        }
    }) as NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag
}


function getNbtNumberTag<T = number>(val: T, type: NbtTagTypeName, suffixParam?: string, enclosingCompound: NbtCompoundTag | null = null): T & Formattable & { [NbtTagType]: NbtTagTypeName } {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtEnclosingCompound]: enclosingCompound,
        [NbtTagType]: type,
        [ToFormattedString]: (lint: LintConfig) => `${val}${suffixParam ? (lint as any)[suffixParam] : ''}`
    })
}

function getStringFromFloat(val: number, { snbtKeepDecimalPlace }: LintConfig) {
    const strValue = val.toString()
    if (snbtKeepDecimalPlace && !strValue.includes('.')) {
        return `${strValue}.0`
    } else {
        return strValue
    }
}

export function getNbtListTag(val: NbtTag[], enclosingCompound: NbtCompoundTag | null = null): NbtListTag {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtEnclosingCompound]: enclosingCompound,
        [NbtTagType]: 'list',
        [ToFormattedString]: (lint: LintConfig) => {
            const body = val.map(v => toLintedString(v, lint)).join(getComma(lint))
            return `[${body}]`
        }
    }) as NbtListTag
}

export function getNbtByteArrayTag(val: NbtByteTag[], enclosingCompound: NbtCompoundTag | null = null) {
    return getNbtPrimitiveArrayTag(val, 'byte_array', enclosingCompound) as NbtByteArrayTag
}

export function getNbtIntArrayTag(val: NbtIntTag[], enclosingCompound: NbtCompoundTag | null = null) {
    return getNbtPrimitiveArrayTag(val, 'int_array', enclosingCompound) as NbtIntArrayTag
}

export function getNbtLongArrayTag(val: NbtLongTag[], enclosingCompound: NbtCompoundTag | null = null) {
    return getNbtPrimitiveArrayTag(val, 'long_array', enclosingCompound) as NbtLongArrayTag
}

export function getNbtByteTag(val: number, enclosingCompound: NbtCompoundTag | null = null) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtEnclosingCompound]: enclosingCompound,
        [NbtTagType]: 'byte' as 'byte',
        [ToFormattedString]: (lint: LintConfig) => {
            if (lint.snbtUseBooleans) {
                if (val === 0) {
                    return 'false'
                } else if (val === 1) {
                    return 'true'
                }
            }
            return `${val}${lint.snbtByteSuffix}`
        },
        [ToJsonString]: (_lint: LintConfig) => val === 0 ? 'false' : 'true'
    })
}

export function getNbtShortTag(val: number, enclosingCompound: NbtCompoundTag | null = null) {
    return getNbtNumberTag(val, 'short', 'snbtShortSuffix', enclosingCompound) as NbtShortTag
}

export function getNbtIntTag(val: number, enclosingCompound: NbtCompoundTag | null = null) {
    return getNbtNumberTag(val, 'int', undefined, enclosingCompound) as NbtIntTag
}

export function getNbtLongTag(val: BigInt, enclosingCompound: NbtCompoundTag | null = null) {
    return getNbtNumberTag(val, 'long', 'snbtLongSuffix', enclosingCompound) as NbtLongTag
}

export function getNbtFloatTag(val: number, enclosingCompound: NbtCompoundTag | null = null) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtEnclosingCompound]: enclosingCompound,
        [NbtTagType]: 'float',
        [ToFormattedString]: (lint: LintConfig) => `${getStringFromFloat(val, lint)}${lint.snbtFloatSuffix}`
    }) as NbtFloatTag
}

export function getNbtDoubleTag(val: number, enclosingCompound: NbtCompoundTag | null = null) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtEnclosingCompound]: enclosingCompound,
        [NbtTagType]: 'double',
        [ToFormattedString]: (lint: LintConfig) => {
            const strValue = getStringFromFloat(val, lint)
            if (lint.snbtOmitDoubleSuffix && strValue.includes('.')) {
                return strValue
            } else {
                return `${strValue}${lint.snbtDoubleSuffix}`
            }
        },
        [ToJsonString]: (lint: LintConfig) => {
            const strValue = getStringFromFloat(val, lint)
            return strValue
        }
    }) as NbtDoubleTag
}

export function getNbtStringTag(val: string, enclosingCompound: NbtCompoundTag | null = null) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtEnclosingCompound]: enclosingCompound,
        [NbtTagType]: 'string',
        [ToFormattedString]: (lint: LintConfig) => quoteString(val, lint.quoteType, lint.quoteSnbtStringValues),
        [ToJsonString]: (_lint: LintConfig) => val
    }) as NbtStringTag
}

export function getNbtCompoundTag(val: { [key: string]: NbtTag }, enclosingCompound: NbtCompoundTag | null = null) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtEnclosingCompound]: enclosingCompound,
        [NbtTagType]: 'compound',
        [ToFormattedString]: (lint: LintConfig) => {
            const body = (lint.snbtSortKeys ? Object.keys(val).sort() : Object.keys(val))
                .map(v => `${quoteString(v, lint.quoteType, lint.quoteSnbtStringKeys)}${
                    getColon(lint)}${toLintedString(val[v], lint)}`)
                .join(getComma(lint))
            return `{${body}}`
        },
        [ToJsonString]: (lint: LintConfig) => {
            /* istanbul ignore next */
            const body = (lint.snbtSortKeys ? Object.keys(val).sort() : Object.keys(val))
                .map(v => `${quoteString(v, 'always double', true)}${
                    getColon(lint)}${toJsonString(val[v], lint)}`)
                .join(getComma(lint))
            return `{${body}}`
        }
    }) as NbtCompoundTag
}
