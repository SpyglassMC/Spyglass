import { Position } from './Position'
import { Range } from './Range'

export interface IndexMapping {
	start: Position,
	merges: Range[]
}

export namespace IndexMapping {
	export function create(partial: Partial<IndexMapping> = {}): IndexMapping {
		return {
			start: partial.start ?? Position.Zero,
			merges: partial.merges ?? []
		}
	}

	export function toInnerPos(mapping: IndexMapping, outer: Position): Position {
		throw ''
	}

	export function toOuterPos(mapping: IndexMapping, inner: Position): Position {
		throw ''
	}
}
