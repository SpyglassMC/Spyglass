import { Range } from './Range.js'

/**
 * The pairs should be in ascending order.
 */
export type IndexMap = { outer: Range; inner: Range }[]

export namespace IndexMap {
	function convertOffset(
		map: IndexMap,
		offset: number,
		from: 'inner' | 'outer',
		to: 'inner' | 'outer',
		isEndOffset: boolean,
	): number {
		let ans = offset

		for (const pair of map) {
			if (Range.contains(pair[from], offset, isEndOffset)) {
				return isEndOffset ? pair[to].end : pair[to].start
			} else if (Range.endsBefore(pair[from], offset)) {
				ans = offset - pair[from].end + pair[to].end
			} else {
				break
			}
		}

		return ans
	}

	export function toInnerOffset(map: IndexMap, offset: number): number {
		return convertOffset(map, offset, 'outer', 'inner', false)
	}

	export function toInnerRange(map: IndexMap, outer: Range): Range {
		return Range.create(
			toInnerOffset(map, outer.start),
			convertOffset(map, outer.end, 'outer', 'inner', true),
		)
	}

	export function toOuterOffset(map: IndexMap, offset: number): number {
		return convertOffset(map, offset, 'inner', 'outer', false)
	}

	export function toOuterRange(map: IndexMap, inner: Range): Range {
		return Range.create(
			toOuterOffset(map, inner.start),
			convertOffset(map, inner.end, 'inner', 'outer', true),
		)
	}

	export function merge(outerMap: IndexMap, innerMap: IndexMap): IndexMap {
		return innerMap.map((p) => ({
			inner: p.inner,
			outer: toOuterRange(outerMap, p.outer),
		}))
	}
}
