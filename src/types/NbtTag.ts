import { LintConfig } from './Config'
import { quoteString, toLintedString, toJsonString } from '../utils/utils'
import BigNumber from 'bignumber.js'
import Lintable, { ToLintedString } from './Lintable'
import JsonConvertible, { ToJsonString } from './JsonConvertible'

export const NbtTagType = Symbol()
export const NbtContentTagType = Symbol()

export type NbtTagTypeName =
    'compound' | 'list' | 'byte_array' | 'int_array' | 'long_array' |
    'byte' | 'short' | 'int' | 'long' | 'string' | 'float' | 'double'

export type NbtTag = (number | BigNumber | string | object | any[]) & { [NbtTagType]: NbtTagTypeName } & Lintable
export type NbtByteTag = number & { [NbtTagType]: 'byte' } & Lintable & JsonConvertible
export type NbtShortTag = number & { [NbtTagType]: 'short' } & Lintable
export type NbtIntTag = number & { [NbtTagType]: 'int' } & Lintable
export type NbtLongTag = BigNumber & { [NbtTagType]: 'long' } & Lintable
export type NbtFloatTag = number & { [NbtTagType]: 'float' } & Lintable
export type NbtDoubleTag = number & { [NbtTagType]: 'double' } & Lintable & JsonConvertible
export type NbtStringTag = string & { [NbtTagType]: 'string' } & Lintable & JsonConvertible
export type NbtListTag = NbtTag[] & { [NbtTagType]: 'list', [NbtContentTagType]: NbtTagTypeName } & Lintable
export type NbtByteArrayTag = NbtByteTag[] & { [NbtTagType]: 'byte_array' } & Lintable
export type NbtIntArrayTag = NbtIntTag[] & { [NbtTagType]: 'int_array' } & Lintable
export type NbtLongArrayTag = NbtLongTag[] & { [NbtTagType]: 'long_array' } & Lintable
export type NbtCompoundTag = { [key: string]: NbtTag } & { [NbtTagType]: 'compound' } & Lintable & JsonConvertible

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

function getNbtPrimitiveArrayTag(
    val: (NbtByteTag | NbtIntTag | NbtLongTag)[], type: 'byte_array' | 'int_array' | 'long_array'
): NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagType]: type,
        [ToLintedString]: (lint: LintConfig) => {
            const body = `${getArrayPrefix(type, lint)}${val.map(v => v[ToLintedString](lint)).join(getComma(lint))}`
            return `${body[body.length - 1] !== ' ' ? body : body.slice(0, -1)}]`
        }
    }) as NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag
}


function getNbtNumberTag<T = number>(val: T, type: NbtTagTypeName, suffixParam?: string): T & Lintable & { [NbtTagType]: NbtTagTypeName } {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagType]: type,
        [ToLintedString]: (lint: LintConfig) => `${val}${suffixParam ? (lint as any)[suffixParam] : ''}`
    })
}

function getStringFromFloat(val: number, { snbtKeepDecimalPlace }: LintConfig) {
    const strValue = val.toString()
    if (snbtKeepDecimalPlace && strValue.indexOf('.') === -1) {
        return `${strValue}.0`
    } else {
        return strValue
    }
}

export function getNbtListTag(val: NbtTag[]): NbtListTag {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagType]: 'list',
        [ToLintedString]: (lint: LintConfig) => {
            const body = val.map(v => toLintedString(v, lint)).join(getComma(lint))
            return `[${body}]`
        }
    }) as NbtListTag
}

export function getNbtByteArrayTag(val: NbtByteTag[]) {
    return getNbtPrimitiveArrayTag(val, 'byte_array') as NbtByteArrayTag
}

export function getNbtIntArrayTag(val: NbtIntTag[]) {
    return getNbtPrimitiveArrayTag(val, 'int_array') as NbtIntArrayTag
}

export function getNbtLongArrayTag(val: NbtLongTag[]) {
    return getNbtPrimitiveArrayTag(val, 'long_array') as NbtLongArrayTag
}

export function getNbtByteTag(val: number) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagType]: 'byte' as 'byte',
        [ToLintedString]: (lint: LintConfig) => {
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

export function getNbtShortTag(val: number) {
    return getNbtNumberTag(val, 'short', 'snbtShortSuffix') as NbtShortTag
}

export function getNbtIntTag(val: number) {
    return getNbtNumberTag(val, 'int') as NbtIntTag
}

export function getNbtLongTag(val: BigNumber) {
    return getNbtNumberTag(val, 'long', 'snbtLongSuffix') as NbtLongTag
}

export function getNbtFloatTag(val: number) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagType]: 'float',
        [ToLintedString]: (lint: LintConfig) => `${getStringFromFloat(val, lint)}${lint.snbtFloatSuffix}`
    }) as NbtFloatTag
}

export function getNbtDoubleTag(val: number) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagType]: 'double',
        [ToLintedString]: (lint: LintConfig) => {
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

export function getNbtStringTag(val: string) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagType]: 'string',
        [ToLintedString]: (lint: LintConfig) => quoteString(val, lint.quoteType, lint.quoteSnbtStringValues),
        [ToJsonString]: (_lint: LintConfig) => val
    }) as NbtStringTag
}

export function getNbtCompoundTag(val: { [key: string]: NbtTag }) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagType]: 'compound',
        [ToLintedString]: (lint: LintConfig) => {
            const body = (lint.snbtSortKeys ? Object.keys(val).sort() : Object.keys(val))
                .map(v => `${quoteString(v, lint.quoteType, lint.quoteSnbtStringKeys)}${
                    getColon(lint)}${toLintedString(val[v], lint)}`)
                .join(getComma(lint))
            return `{${body}}`
        },
        [ToJsonString]: (lint: LintConfig) => {
            /* istanbul ignore next */
            const body = (lint.snbtSortKeys ? Object.keys(val).sort() : Object.keys(val))
                .map(v => `${v}${getColon(lint)}${toJsonString(val[v], lint)}`)
                .join(getComma(lint))
            return `{${body}}`
        }
    }) as NbtCompoundTag
}
