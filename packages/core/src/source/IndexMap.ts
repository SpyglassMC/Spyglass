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
	): number {
		let ans = offset

		for (const pair of map) {
			if (Range.contains(pair[from], offset)) {
				return pair[to].start
			} else if (Range.endsBefore(pair[from], offset)) {
				ans = offset - pair[from].end + pair[to].end
			} else {
				break
			}
		}

		return ans
	}

	export function toInnerOffset(map: IndexMap, offset: number): number {
		return convertOffset(map, offset, 'outer', 'inner')
	}

	export function toInnerRange(map: IndexMap, outer: Range): Range {
		return Range.create(
			toInnerOffset(map, outer.start),
			toInnerOffset(map, outer.end),
		)
	}

	export function toOuterOffset(map: IndexMap, offset: number): number {
		return convertOffset(map, offset, 'inner', 'outer')
	}

	export function toOuterRange(map: IndexMap, inner: Range): Range {
		return Range.create(
			toOuterOffset(map, inner.start),
			toOuterOffset(map, inner.end),
		)
	}

	export function merge(outerMap: IndexMap, innerMap: IndexMap): IndexMap {
		return innerMap.map((p) => ({
			inner: p.inner,
			outer: toOuterRange(outerMap, p.outer),
		}))
	}
}
