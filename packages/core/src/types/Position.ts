export interface Position {
	line: number,
	character: number
}

export namespace Position {
	export const Zero: Position = { line: 0, character: 0 }
	export const Infinity: Position = { line: Number.POSITIVE_INFINITY, character: Number.POSITIVE_INFINITY }

	export function create(partial: Partial<Position> = {}): Position {
		return { line: partial.line ?? 0, character: partial.character ?? 0 }
	}
}
