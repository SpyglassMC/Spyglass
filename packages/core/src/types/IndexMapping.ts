import { Position } from './Position'

interface IndexMerge {
	from: Position,
	to: Position
}

export interface IndexMapping {
	start: Position,
	merges: IndexMerge[]
}

export namespace IndexMapping {
	export function create(partial: Partial<IndexMapping> = {}): IndexMapping {
		return {
			start: partial.start ?? Position.Zero,
			merges: partial.merges ?? []
		}
	}
}
