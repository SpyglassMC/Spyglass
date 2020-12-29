export interface Position {
	line: number,
	character: number
}

export namespace Position {
	export function create(line: number, character: number): Position
	export function create(partial: Partial<Position>): Position
	export function create(param1: number | Partial<Position>, param2?: number): Position {
		if (typeof param1 === 'object') {
			return _createFromPartial(param1)
		} else {
			return _createFromNumbers(param1, param2!)
		}
	}

	function _createFromPartial(partial: Partial<Position>): Position {
		return { line: partial.line ?? 0, character: partial.character ?? 0 }
	}

	function _createFromNumbers(line: number, character: number): Position {
		return _createFromPartial({ line, character })
	}

	export const Zero = Position.create(0, 0)
	export const Infinity = Position.create(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
}
