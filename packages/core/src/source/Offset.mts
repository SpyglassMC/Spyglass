import { ReadonlySource } from './Source.mjs'

export type OffsetLike =
	| number | ReadonlySource
	| ((this: void) => number | ReadonlySource)

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
		if (offset instanceof ReadonlySource) {
			offset = offset.cursor
		}
		return offset
	}
}
