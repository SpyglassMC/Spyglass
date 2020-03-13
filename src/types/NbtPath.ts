import Formattable, { ToFormattedString } from './Formattable'
import { LintConfig } from './Config'
import { toFormattedString, quoteString } from '../utils/utils'
import { NbtCompoundTag, isNbtCompoundTag } from './NbtTag'

export const NbtPathIndexBegin = Symbol('[')
export const NbtPathIndexEnd = Symbol(']')
export const NbtPathSep = Symbol('.')
type NbtPathIndex = number
type NbtPathCompoundFilter = NbtCompoundTag
type NbtPathKey = string

export default class NbtPath implements Formattable {
    constructor(
        readonly value: (
            | typeof NbtPathIndexBegin
            | typeof NbtPathIndexEnd
            | typeof NbtPathSep
            | NbtPathIndex
            | NbtPathCompoundFilter
            | NbtPathKey
        )[]
    ) { }

    [ToFormattedString](lint: LintConfig): string {
        let ans = ''
        for (const value of this.value) {
            if (value === NbtPathIndexBegin) {
                ans += '['
            } else if (value === NbtPathIndexEnd) {
                ans += ']'
            } else if (value === NbtPathSep) {
                ans += '.'
            } else if (isNbtPathCompoundFilter(value) || isNbtPathIndex(value)) {
                ans += toFormattedString(value, lint)
            } else {
                ans += quoteString(value as string, 'always double', false)
            }
        }
        return ans
    }
}

export function isNbtPathIndex(value: any): value is NbtPathIndex {
    return typeof value === 'number'
}

export function isNbtPathCompoundFilter(value: any): value is NbtPathCompoundFilter {
    return isNbtCompoundTag(value)
}

export function isNbtPathKey(value: any): value is NbtPathKey {
    return typeof value === 'string'
}
