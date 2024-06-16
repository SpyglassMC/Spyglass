import type { TextDocument } from 'vscode-languageserver-textdocument'
import { Position } from './Position.js'
import type { RangeLike } from './Range.js'
import { Range } from './Range.js'

export interface PositionRange {
	start: Position
	end: Position
}

export namespace PositionRange {
	export function create(
		startLine: number,
		startCharacter: number,
		endLine: number,
		endCharacter: number,
	): PositionRange
	export function create(start: Position, end: Position): PositionRange
	export function create(partial: Partial<PositionRange>): PositionRange
	export function create(
		param1: number | Position | Partial<PositionRange>,
		param2?: number | Position,
		param3?: number,
		param4?: number,
	): PositionRange {
		if (typeof param1 === 'number') {
			return {
				start: Position.create(param1, param2 as number),
				end: Position.create(param3!, param4!),
			}
		} else if (param2 !== undefined) {
			return {
				start: Position.create(param1 as Position),
				end: Position.create(param2 as Position),
			}
		} else {
			const partial = param1 as Partial<PositionRange>
			return {
				start: Position.create(partial.start ?? {}),
				end: Position.create(partial.end ?? {}),
			}
		}
	}

	/**
	 * @returns A `PositionRange` converted from a `RangeLike`.
	 */
	export function from(rangeLike: RangeLike, doc: TextDocument) {
		const range = Range.get(rangeLike)
		const ans: PositionRange = {
			start: doc.positionAt(range.start),
			end: doc.positionAt(range.end),
		}
		return ans
	}

	/**
	 * ```typescript
	 * {
	 * 	start: { line: 0, character: 0 },
	 * 	end: { line: 0, character: 1 }
	 * }
	 * ```
	 */
	export const Beginning = Object.freeze(PositionRange.create(0, 0, 0, 1))

	/**
	 * ```typescript
	 * {
	 * 	start: { line: 0, character: 0 },
	 * 	end: { line: Infinity, character: Infinity }
	 * }
	 * ```
	 */
	export const Full = Object.freeze(
		PositionRange.create(Position.Beginning, Position.Infinity),
	)

	export function toString(range: PositionRange): string {
		return `[${Position.toString(range.start)}, ${
			Position.toString(
				range.end,
			)
		})`
	}

	export function contains(range: PositionRange, pos: Position): boolean {
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
			(pos.line === start.line ? pos.character >= start.character : true)
			&& (pos.line === end.line ? pos.character < end.character : true)
		)
	}

	export function endsBefore(range: PositionRange, pos: Position): boolean {
		return Position.isBefore(
			Position.create(range.end.line, range.end.character - 1),
			pos,
		)
	}
}
