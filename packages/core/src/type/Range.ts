import { AstNode, Source } from '..'


export type RangeLike = Range | AstNode | Source

export interface Range {
	start: number,
	end: number
}

export namespace Range {
	export function create(start: number | Source, end?: number | Source): Range
	export function create(partial: Partial<Range>): Range
	export function create(param1: Partial<Range> | number | Source, param2?: number | Source): Range {
		if (typeof param1 === 'number' || param1 instanceof Source) {
			const getOffset = (v: number | Source) => typeof v === 'number' ? v : v.cursor
			const start = getOffset(param1)
			return {
				start,
				end: param2 ? getOffset(param2) : start,
			}
		} else {
			const start = param1.start ?? 0
			return {
				start,
				end: param1.end ?? start,
			}
		}
	}

	/**
	 * Get a range from a `RangeLike`.
	 * 
	 * @returns
	 * - `Range`: a clone of it.
	 * - `AstNode`: a clone of its range.
	 * - `Source`: a range with both positions set to the its `cursor`.
	 */
	export function get(range: RangeLike): Range {
		if (range instanceof Source) {
			return Range.create(range.cursor)
		}
		return Range.create((range as AstNode).range ?? (range as Range))
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

	export function endsBefore(range: Range, offset: number): boolean {
		return range.end <= offset
	}

	export function length(range: Range) {
		return range.end - range.start
	}
}
