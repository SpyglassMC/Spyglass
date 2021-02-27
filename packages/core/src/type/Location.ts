import { Range } from './Range'

export interface Location {
	uri: string,
	range: Range
}

export namespace Location {
	export function create(partial: Partial<Location>): Location {
		return {
			uri: partial.uri ?? '',
			range: Range.get(partial.range ?? { start: 0, end: 0 }),
		}
	}
}
