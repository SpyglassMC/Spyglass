import type { RangeLike } from '../source/index.js'
import { Range } from '../source/index.js'
import type { SymbolLocation } from '../symbol/index.js'

export interface SymbolLocations {
	/**
	 * The range of the currently selected symbol.
	 */
	range: Range
	/**
	 * All locations of the symbol for the specific usage, or `undefined` if this symbol doesn't have the said usage.
	 */
	locations: SymbolLocation[] | undefined
}
export namespace SymbolLocations {
	/* istanbul ignore next */
	export function create(
		range: RangeLike,
		locations: SymbolLocation[] | undefined,
	): SymbolLocations {
		return { range: Range.get(range), locations }
	}
}
