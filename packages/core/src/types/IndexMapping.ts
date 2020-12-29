import { Position } from './Position'
import { Range } from './Range'

export type IndexMapping = {
	outerRange: Range,
	innerRange: Range,
	mapping: { from: Range, to: Range }[]
}

export namespace IndexMapping {
	export function create(partial: Partial<IndexMapping> = {}): IndexMapping {
		return {
			outerRange: partial.outerRange ?? Range.Beginning,
			innerRange: partial.innerRange ?? Range.Beginning,
			mapping: partial.mapping ?? []
		}
	}

	export function toInnerPos(mapping: IndexMapping, outer: Position): Position {
		throw ''
	}

	export function toOuterPos(mapping: IndexMapping, inner: Position): Position {
		throw ''
	}
}
