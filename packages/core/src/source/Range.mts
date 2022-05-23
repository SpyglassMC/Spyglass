import type { OffsetLike } from './Offset.mjs'
import { Offset } from './Offset.mjs'

export type RangeLike =
	| Range | RangeContainer | OffsetLike
	| ((this: void) => Range | RangeContainer | OffsetLike)

export interface Range {
	start: number,
	end: number
}

export namespace Range {
	/**
	 * Gets a range from `RangeLike`.
	 * 
	 * @returns
	 * - `Range`: a clone of it.
	 * - `RangeContainer`: a clone of its range.
	 * - `OffsetLike`: a range with both positions set to the offset.
	 */
	export function get(range: RangeLike): Range {
		const evaluated = typeof range === 'function' ? range() : range
		if (Range.is(evaluated)) {
			return Range.create(evaluated.start, evaluated.end)
		} if (RangeContainer.is(evaluated)) {
			return Range.create(evaluated.range.start, evaluated.range.end)
		}
		return Range.create(evaluated)
	}

	/**
	 * Creates a range from `OffsetLike`. If only `start` is passed in, `end` will be the same value as `start`.
	 */
	export function create(start: OffsetLike, end?: OffsetLike): Range {
		start = Offset.get(start)
		return {
			start,
			end: end !== undefined ? Offset.get(end) : start,
		}
	}

	/**
	 * Creates a range that covers the area between `from.start` and `to.end`.
	 */
	export function span(from: RangeLike, to: RangeLike): Range {
		return {
			start: Range.get(from).start,
			end: Range.get(to).end,
		}
	}

	export function is(obj: unknown): obj is Range {
		return (
			!!obj && typeof obj === 'object' &&
			typeof (obj as Range).start === 'number' &&
			typeof (obj as Range).end === 'number'
		)
	}

	/**
	 * ```typescript
	 * { start: 0, end: 1 }
	 * ```
	 */
	export const Beginning = Object.freeze(Range.create(0, 1))

	/**
	 * ```typescript
	 * { start: 0, end: Infinity }
	 * ```
	 */
	export const Full = Object.freeze(Range.create(0, Number.POSITIVE_INFINITY))

	export function toString(range: Range): string {
		return `[${range.start}, ${range.end})`
	}

	export function contains(range: RangeLike, offset: number, endInclusive = false): boolean {
		range = get(range)
		return range.start <= offset && (endInclusive ? offset <= range.end : offset < range.end)
	}

	export function containsRange(a: RangeLike, b: RangeLike, endInclusive = false): boolean {
		a = get(a)
		b = get(b)
		return contains(a, b.start, endInclusive) && contains(a, b.end, true)
	}

	export function intersects(a: Range, b: Range): boolean {
		return Range.contains(a, b.start) || Range.contains(b, a.start)
	}

	export function equals(a: Range, b: Range): boolean {
		return a.start === b.start && a.end === b.end
	}

	export function endsBefore(range: Range, target: RangeLike, endInclusive = false): boolean {
		return endInclusive
			? range.end < Range.get(target).start
			: range.end <= Range.get(target).start
	}

	export function isEmpty(range: RangeLike): boolean {
		range = get(range)
		return range.start === range.end
	}

	export function length(range: Range) {
		return range.end - range.start
	}

	/**
	 * @returns Negative when `a` is before `b`, `0` if they intersect, and positive if it's after.
	 */
	export function compare(a: Range, b: Range, endInclusive = false): number {
		if (endInclusive ? a.end < b.start : a.end <= b.start) {
			return -1
		} else if (endInclusive ? a.start > b.end : a.start >= b.end) {
			return 1
		} else {
			return 0
		}
	}

	/**
	 * @returns Negative when `range` is before `offset`, `0` if it {@link contains} `offset`, and positive if it's after.
	 */
	export function compareOffset(range: Range, offset: number, endInclusive = false): number {
		if (endInclusive ? range.end < offset : range.end <= offset) {
			return -1
		} else if (range.start > offset) {
			return 1
		} else {
			return 0
		}
	}

	/**
	 * @param startOffset The number to offset the start of the `range`.
	 * @param endOffset The number to offset the end of the `range`. Default: `startOffset`.
	 * @returns A copy of `range`.
	 */
	export function translate(range: RangeLike, startOffset: number, endOffset = startOffset): Range {
		range = get(range)
		return {
			start: range.start + startOffset,
			end: range.end + endOffset,
		}
	}
}

export interface RangeContainer {
	range: Range,
	[key: string]: any,
}
export namespace RangeContainer {
	export function is(obj: unknown): obj is RangeContainer {
		return (
			!!obj && typeof obj === 'object' &&
			Range.is((obj as RangeContainer).range)
		)
	}
}
