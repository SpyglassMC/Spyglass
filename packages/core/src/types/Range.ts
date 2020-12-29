import { Position } from './Position'

export interface Range {
	start: Position,
	end: Position
}

export namespace Range {
	export function create(startLine: number, startCharacter: number, endLine: number, endCharacter: number): Range
	export function create(start: Position, end: Position): Range
	export function create(partial: Partial<Range>): Range
	export function create(param1: number | Position | Partial<Range>, param2?: number | Position, param3?: number, param4?: number): Range {
		if (typeof param1 === 'number') {
			return {
				start: Position.create(param1, param2 as number),
				end: Position.create(param3!, param4!)
			}
		} else if (param2 !== undefined) {
			return {
				start: param1 as Position,
				end: param2 as Position
			}
		} else {
			const partial = param1 as Partial<Range>
			return {
				start: partial.start ?? Position.Beginning,
				end: partial.end ?? Position.Beginning
			}
		}
	}

	/**
	 * ```typescript
	 * {
	 * 	start: { line: 0, character: 0 },
	 * 	end: { line: 0, character: 1 }
	 * }
	 * ```
	 */
	export const Beginning = Object.freeze(Range.create(0, 0, 0, 1))

	/**
	 * ```typescript
	 * {
	 * 	start: { line: 0, character: 0 },
	 * 	end: { line: Infinity, character: Infinity }
	 * }
	 * ```
	 */
	export const Full = Object.freeze(Range.create(Position.Beginning, Position.Infinity))

	export function toString(range: Range): string {
		return `${Position.toString(range.start)}..${Position.toString(range.end)}`
	}

	export function isIn(range: Range, pos: Position): boolean {
		const { start, end } = range
		// Check range of line number.
		if (pos.line < start.line || pos.line > end.line) {
			return false
		}
		if (start.line < pos.line && pos.line < end.line) {
			return true
		}
		// Now `pos` is in the same line as `start` and/or `end`.
		return (
			(pos.line === start.line ? pos.character >= start.character : true) &&
			(pos.line === end.line ? pos.character < end.character : true)
		)
	}
}
