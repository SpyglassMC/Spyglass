import type { RangeLike } from '../source'
import { Range } from '../source'

export interface Hover {
	range: Range,
	markdown: string,
}
export namespace Hover {
	export function create(range:RangeLike, markdown:string):Hover {
		return {
			range: Range.get(range),
			markdown,
		}
	}
}
