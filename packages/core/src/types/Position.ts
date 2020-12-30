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

	/**
	 * ```typescript
	 * { line: 0, character: 0 }
	 * ```
	 */
	export const Beginning = Position.create(0, 0)

	/**
	 * ```typescript
	 * { line: Infinity, character: Infinity }
	 * ```
	 */
	export const Infinity = Position.create(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)

	export function toString(pos: Position): string {
		return `<${pos.line}, ${pos.character}>`
	}

	export function isBefore(pos1: Position, pos2: Position): boolean {
		return (
			pos1.line < pos2.line ||
			(pos1.line === pos2.line && pos1.character < pos2.character)
		)
	}
}
