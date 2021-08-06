import { Range } from './Range'

/**
 * The pairs should be in ascending order.
 */
export type IndexMap = { outer: Range, inner: Range }[]

export namespace IndexMap {
	export const DEFAULT: IndexMap = []

	export function toInnerOffset(map: IndexMap, offset: number): number {
		let ans = offset

		for (const pair of map) {
			if (Range.endsBefore(pair.outer, offset)) {
				ans = offset - pair.outer.end + pair.inner.end
			} else if (Range.contains(pair.outer, offset)) {
				return pair.inner.end - 1
			} else {
				break
			}
		}

		return ans
	}

	export function toInnerRange(map: IndexMap, outer: Range): Range {
		return Range.create(
			toInnerOffset(map, outer.start),
			toInnerOffset(map, outer.end)
		)
	}

	export function toOuterOffset(map: IndexMap, offset: number): number {
		let ans = offset

		for (const pair of map) {
			if (Range.endsBefore(pair.inner, offset)) {
				ans = offset - pair.inner.end + pair.outer.end
			} else if (Range.contains(pair.inner, offset)) {
				return pair.outer.end - 1
			} else {
				break
			}
		}

		return ans
	}

	export function toOuterRange(map: IndexMap, inner: Range): Range {
		return Range.create(
			toOuterOffset(map, inner.start),
			toOuterOffset(map, inner.end)
		)
	}

	export function merge(outer: IndexMap, inner: IndexMap): IndexMap {
		return inner // FIXME: Make this work when outer has pairs.
	}
}
