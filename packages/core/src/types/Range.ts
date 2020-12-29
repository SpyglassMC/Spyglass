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
				start: partial.start ?? Position.Zero,
				end: partial.end ?? Position.Zero
			}
		}
	}

	export const Beginning = Range.create(0, 0, 0, 1)
	export const Full = Range.create(Position.Zero, Position.Infinity)
}
