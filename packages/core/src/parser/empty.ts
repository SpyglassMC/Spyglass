import { InfallibleParser } from '..'

export function empty(): InfallibleParser<null> {
	return (): null => {
		return null
	}
}
