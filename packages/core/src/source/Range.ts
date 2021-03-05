import { Offset, OffsetLike } from './Offset'

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

	export function contains(range: Range, offset: number): boolean {
		return range.start <= offset && offset < range.end
	}

	export function intersects(a: Range, b: Range): boolean {
		return Range.contains(a, b.start) || Range.contains(b, a.start)
	}

	export function endsBefore(range: Range, offset: number): boolean {
		return range.end <= offset
	}

	export function length(range: Range) {
		return range.end - range.start
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
