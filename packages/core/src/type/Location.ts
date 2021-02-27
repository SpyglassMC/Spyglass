import { Range, RangeLike } from './Range'

export interface Location {
	uri: string,
	range: Range
}

export type LocationLike = Partial<{ uri: string, range: RangeLike }>

export namespace Location {
	export function get(partial: LocationLike): Location {
		return {
			uri: partial.uri ?? '',
			range: Range.get(partial.range ?? { start: 0, end: 0 }),
		}
	}

	export function create(uri: string, range: RangeLike): Location {
		return Location.get({ uri, range })
	}
}
