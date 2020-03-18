import { getOuterIndex } from './IndexMapping'

export default interface TextRange {
    start: number,
    end: number
}

/**
 * Remap all the indexes in the specific TextRange object by the specific mapping.
 * @param range The specific TextRange object.
 * @param mapping The mapping used to offset.
 */
export function remapTextRange<T extends TextRange = TextRange>(range: T, mapping: number[]): T {
    return { ...range, start: getOuterIndex(mapping, range.start), end: getOuterIndex(mapping, range.end) }
}
