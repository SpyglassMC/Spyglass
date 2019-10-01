import { LintConfig } from './Config'
import { quoteString } from '../utils/utils'
import BigNumber from 'bignumber.js'

export const NbtTagTypeSymbol = Symbol()
export const NbtContentTagTypeSymbol = Symbol()
export const NbtToStringSymbol = Symbol()

export type NbtTagTypeName =
    'compound' | 'list' | 'byte_array' | 'int_array' | 'long_array' |
    'byte' | 'short' | 'int' | 'long' | 'string' | 'float' | 'double'

export type NbtTag = (number | BigNumber | string | object | any[]) & NbtTagSymbolCollection
export type NbtByteTag = number & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'byte' }
export type NbtShortTag = number & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'short' }
export type NbtIntTag = number & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'int' }
export type NbtLongTag = BigNumber & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'long' }
export type NbtFloatTag = number & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'float' }
export type NbtDoubleTag = number & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'double' }
export type NbtStringTag = string & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'string' }
export type NbtListTag = NbtTag[] & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'list', [NbtContentTagTypeSymbol]: NbtTagTypeName }
export type NbtByteArrayTag = NbtByteTag[] & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'byte_array' }
export type NbtIntArrayTag = NbtIntTag[] & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'int_array' }
export type NbtLongArrayTag = NbtLongTag[] & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'long_array' }
export type NbtCompoundTag = { [key: string]: NbtTag } & NbtTagSymbolCollection & { [NbtTagTypeSymbol]: 'compound' }

export const isNbtByteTag = (val: any): val is NbtByteTag => val[NbtTagTypeSymbol] === 'byte'
export const isNbtShortTag = (val: any): val is NbtShortTag => val[NbtTagTypeSymbol] === 'short'
export const isNbtIntTag = (val: any): val is NbtIntTag => val[NbtTagTypeSymbol] === 'int'
export const isNbtLongTag = (val: any): val is NbtLongTag => val[NbtTagTypeSymbol] === 'long'
export const isNbtFloatTag = (val: any): val is NbtFloatTag => val[NbtTagTypeSymbol] === 'float'
export const isNbtDoubleTag = (val: any): val is NbtDoubleTag => val[NbtTagTypeSymbol] === 'double'
export const isNbtStringTag = (val: any): val is NbtStringTag => val[NbtTagTypeSymbol] === 'string'
export const isNbtByteArrayTag = (val: any): val is NbtByteArrayTag => val[NbtTagTypeSymbol] === 'byte_array'
export const isNbtIntArrayTag = (val: any): val is NbtIntArrayTag => val[NbtTagTypeSymbol] === 'int_array'
export const isNbtLongArrayTag = (val: any): val is NbtLongArrayTag => val[NbtTagTypeSymbol] === 'long_array'
export const isNbtListTag = (val: any): val is NbtListTag => val[NbtTagTypeSymbol] === 'list'
export const isNbtCompoundTag = (val: any): val is NbtCompoundTag => val[NbtTagTypeSymbol] === 'compound'

export interface NbtTagSymbolCollection {
    [NbtTagTypeSymbol]: NbtTagTypeName,
    [NbtToStringSymbol](lint: LintConfig): string
}

function getArrayPrefix(type: 'byte_array' | 'int_array' | 'long_array', lint: LintConfig) {
    const prefix = type[0].toUpperCase()
    return `[${prefix}${getSemicolon(lint)}`
}

function getSemicolon(lint: LintConfig) {
    return `;${lint.snbtAppendSpaceAfterSemicolon ? ' ' : ''}`
}

function getComma(lint: LintConfig) {
    return `,${lint.snbtAppendSpaceAfterComma ? ' ' : ''}`
}

function getColon(lint: LintConfig) {
    return `:${lint.snbtAppendSpaceAfterComma ? ' ' : ''}`
}

function getNbtPrimitiveArrayTag(
    val: (NbtByteTag | NbtIntTag | NbtLongTag)[], type: 'byte_array' | 'int_array' | 'long_array'
): NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagTypeSymbol]: type,
        [NbtToStringSymbol]: (lint: LintConfig) => {
            const body = `${getArrayPrefix(type, lint)}${val.map(v => v[NbtToStringSymbol](lint)).join(getComma(lint))}`
            return `${body[body.length - 1] !== ' ' ? body : body.slice(0, -1)}]`
        }
    }) as NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag
}


function getNbtNumberTag<T = number>(val: T, type: NbtTagTypeName, suffixParam?: string): T & NbtTagSymbolCollection {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagTypeSymbol]: type,
        [NbtToStringSymbol]: (lint: LintConfig) => `${val}${suffixParam ? (lint as any)[suffixParam] : ''}`
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
        [NbtTagTypeSymbol]: 'list',
        [NbtToStringSymbol]: (lint: LintConfig) => {
            const body = val.map(v => v[NbtToStringSymbol](lint)).join(getComma(lint))
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
    return getNbtNumberTag(val, 'byte', 'snbtByteSuffix') as NbtByteTag
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
        [NbtTagTypeSymbol]: 'float',
        [NbtToStringSymbol]: (lint: LintConfig) => `${getStringFromFloat(val, lint)}${lint.snbtFloatSuffix}`
    }) as NbtFloatTag
}

export function getNbtDoubleTag(val: number) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagTypeSymbol]: 'double',
        [NbtToStringSymbol]: (lint: LintConfig) => {
            const strValue = getStringFromFloat(val, lint)
            if (lint.snbtOmitDoubleSuffix && strValue.indexOf('.') !== -1) {
                return strValue
            } else {
                return `${strValue}${lint.snbtDoubleSuffix}`
            }
        }
    }) as NbtDoubleTag
}

export function getNbtStringTag(val: string) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagTypeSymbol]: 'string',
        [NbtToStringSymbol]: (lint: LintConfig) => quoteString(val, lint.quoteType, lint.quoteSnbtStringValues)
    }) as NbtStringTag
}

export function getNbtCompoundTag(val: { [key: string]: NbtTag }) {
    // tslint:disable-next-line: prefer-object-spread
    return Object.assign(val, {
        [NbtTagTypeSymbol]: 'compound',
        [NbtToStringSymbol]: (lint: LintConfig) => {
            const body = (lint.snbtSortKeys ? Object.keys(val).sort() : Object.keys(val))
                .map(v => `${quoteString(v, lint.quoteType, lint.quoteSnbtStringKeys)}${
                    getColon(lint)}${val[v][NbtToStringSymbol](lint)}`)
                .join(getComma(lint))
            return `{${body}}`
        }
    }) as NbtCompoundTag
}
