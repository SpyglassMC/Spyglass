import { Range } from './Range'

export interface IndexMap {
	outerRange: Range,
	innerRange: Range,
	pairs: { outer: Range, inner: Range }[]
}

export namespace IndexMap {
	export function create(partial: Partial<IndexMap> = {}): IndexMap {
		return {
			outerRange: partial.outerRange ?? Range.Beginning,
			innerRange: partial.innerRange ?? Range.Beginning,
			pairs: partial.pairs ?? []
		}
	}

	export function toInnerOffset(map: IndexMap, outer: number): number {
		const { innerRange, outerRange, pairs } = map
		if (!Range.contains(outerRange, outer)) {
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

	export function toOuterOffset(map: IndexMap, inner: number): number {
		const { innerRange, outerRange, pairs } = map
		if (!Range.contains(innerRange, inner)) {
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
}
