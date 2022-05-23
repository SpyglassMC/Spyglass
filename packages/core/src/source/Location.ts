import type { TextDocument } from 'vscode-languageserver-textdocument'
import { PositionRange } from './PositionRange.js'
import type { RangeLike } from './Range.js'
import { Range } from './Range.js'

export interface Location {
	uri: string,
	range: Range,
	posRange: PositionRange,
}

export type LocationLike = Partial<{ uri: string, range: RangeLike, posRange: PositionRange }>

export namespace Location {
	export function get(partial: LocationLike): Location {
		return {
			uri: partial.uri ?? '',
			range: Range.get(partial.range ?? { start: 0, end: 0 }),
			posRange: partial.posRange ?? { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
		}
	}

	export function create(doc: TextDocument, range: RangeLike): Location {
		return Location.get({
			uri: doc.uri,
			range,
			posRange: PositionRange.from(range, doc),
		})
	}
}
