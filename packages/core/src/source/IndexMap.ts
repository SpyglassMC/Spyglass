import { Range } from './Range'

export interface IndexMap {
	outerRange: Range,
	innerRange: Range,
	pairs: { outer: Range, inner: Range }[]
}

export namespace IndexMap {
	export const DEFAULT: IndexMap = {
		outerRange: Range.create(0, Number.MAX_VALUE),
		innerRange: Range.create(0, Number.MAX_VALUE),
		pairs: [],
	}

	export function create(partial: Partial<IndexMap> = {}): IndexMap {
		return {
			outerRange: partial.outerRange ?? Range.Beginning,
			innerRange: partial.innerRange ?? Range.Beginning,
			pairs: partial.pairs ?? [],
		}
	}

	export function toInnerOffset(map: IndexMap, outer: number): number {
		const { innerRange, outerRange, pairs } = map
		if (!Range.containsInclusive(outerRange, outer)) {
			throw new Error(`Offset ${outer} is not in range ${Range.toString(outerRange)}`)
		}

		let ans = outer
		ans += innerRange.start - outerRange.start

		for (const pair of pairs) {
			if (Range.contains(pair.outer, outer)) {
				return pair.inner.end - 1
			} else if (Range.endsBefore(pair.outer, outer)) {
				ans += Range.length(pair.inner) - Range.length(pair.outer)
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

	export function toOuterOffset(map: IndexMap, inner: number): number {
		const { innerRange, outerRange, pairs } = map
		if (!Range.containsInclusive(innerRange, inner)) {
			throw new Error(`Offset ${inner} is not in range ${Range.toString(innerRange)}`)
		}

		let ans = inner
		ans += outerRange.start - innerRange.start

		for (const pair of pairs) {
			if (Range.contains(pair.inner, inner)) {
				return pair.outer.end - 1
			} else if (Range.endsBefore(pair.inner, inner)) {
				ans += Range.length(pair.outer) - Range.length(pair.inner)
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
		return {
			outerRange: IndexMap.toOuterRange(outer, inner.outerRange),
			innerRange: inner.innerRange,
			pairs: inner.pairs, // FIXME: Make this work when outer has pairs.
		}
	}
}
