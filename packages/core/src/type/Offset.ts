import { Source } from '../util'

export type OffsetLike =
	| number | Source
	| ((this: void) => number | Source)

export namespace Offset {
	/**
	 * Get an offset from a `OffsetLike`.
	 * 
	 * @returns
	 * - `number`: itself.
	 * - `Source`: its `cursor`.
	 */
	export function get(offset: OffsetLike): number {
		if (typeof offset === 'function') {
			offset = offset()
		}
		if (offset instanceof Source) {
			offset = offset.cursor
		}
		return offset
	}
}
