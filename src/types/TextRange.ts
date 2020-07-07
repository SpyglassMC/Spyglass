import { getOuterIndex, IndexMapping } from './IndexMapping'

export interface TextRange {
    start: number,
    end: number
}

export const EmptyRange = { start: NaN, end: NaN }

/**
 * Remap all the indices in the specific TextRange object by the specific mapping.
 * @param range The specific TextRange object.
 * @param mapping The mapping used to offset.
 */
export function remapTextRange<T extends TextRange = TextRange>(range: T, mapping: IndexMapping): T {
    return { ...range, start: getOuterIndex(mapping, range.start), end: getOuterIndex(mapping, range.end) }
}

export function areOverlapped(a: TextRange, b: TextRange) {
    return a.start <= b.end && a.end >= b.start
}

export function isInRange(char: number, range: TextRange) {
    return range.start <= char && char <= range.end
}
