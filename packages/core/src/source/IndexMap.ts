import { Range } from './Range'

/**
 * The pairs should be in ascending order.
 */
export type IndexMap = { outer: Range, inner: Range }[]

export namespace IndexMap {
	function convertOffset(map: IndexMap, offset: number, from: 'inner' | 'outer', to: 'inner' | 'outer', isEndOffset: boolean): number {
		let ans = offset

		const comparableOffset = isEndOffset ? offset - 1 : offset

		for (const pair of map) {
			if (Range.endsBefore(pair[from], comparableOffset)) {
				ans = offset - pair[from].end + pair[to].end
			} else if (Range.contains(pair[from], comparableOffset)) {
				return isEndOffset ? pair[to].end : pair[to].start
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
			convertOffset(map, outer.end, 'outer', 'inner', true)
		)
	}

	export function toOuterOffset(map: IndexMap, offset: number): number {
		return convertOffset(map, offset, 'inner', 'outer', false)
	}

	export function toOuterRange(map: IndexMap, inner: Range): Range {
		return Range.create(
			toOuterOffset(map, inner.start),
			convertOffset(map, inner.end, 'inner', 'outer', true)
		)
	}

	export function merge(outerMap: IndexMap, innerMap: IndexMap): IndexMap {
		return innerMap.map(p => ({
			inner: p.inner,
			outer: toOuterRange(outerMap, p.outer),
		}))
	}
}
