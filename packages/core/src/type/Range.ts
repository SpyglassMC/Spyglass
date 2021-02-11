export interface Range {
	start: number,
	end: number
}

export namespace Range {
	export function create(start: number, end: number): Range
	export function create(partial: Partial<Range>): Range
	export function create(param1: number | Partial<Range>, param2?: number): Range {
		if (typeof param1 === 'number') {
			return {
				start: param1,
				end: param2 as number,
			}
		} else {
			return {
				start: param1.start ?? 0,
				end: param1.end ?? 0,
			}
		}
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
