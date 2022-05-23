import type { RangeLike } from '../source/index.mjs'
import { Range } from '../source/index.mjs'

export interface Hover {
	range: Range,
	markdown: string,
}
export namespace Hover {
	/* istanbul ignore next */
	export function create(range:RangeLike, markdown:string):Hover {
		return {
			range: Range.get(range),
			markdown,
		}
	}
}
