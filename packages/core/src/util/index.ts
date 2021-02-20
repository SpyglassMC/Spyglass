import { localize } from '@spyglassmc/locales'

/**
 * Convert an array to human-readable message.
 * @param arr An array.
 * @param quoted Whether or not to quote the parts. Defaults to `true`
 * @param conjunction The conjunction to use. Defaults to `or`.
 * @returns Human-readable message.
 * @example // Using English
 * arrayToMessage([]) // "nothing"
 * arrayToMessage('foo') // "“foo”"
 * arrayToMessage(['foo']) // "“foo”"
 * arrayToMessage(['bar', 'foo']) // "“bar” and “foo”"
 * arrayToMessage(['bar', 'baz', 'foo']) // "“bar”, “baz”, and “foo”"
 * @example // Using Locale
 * arrayToMessage([], false) // "nothing"
 * arrayToMessage(['A'], false) // "A"
 * arrayToMessage(['A', 'B'], false) // "A{conjunction.and_2}B"
 * arrayToMessage(['A', 'B', 'C'], false) // "A{conjunction.and_3+_1}B{conjunction.and_3+_2}C"
 */
export function arrayToMessage(param: string | Iterable<string>, quoted = true, conjunction: 'and' | 'or' = 'or') {
	const getPart = (str: string) => quoted ? localize('punc.quote', [str]) : str
	const arr = (typeof param === 'string' ? [param] : Array.from(param))
		.map(getPart)
	switch (arr.length) {
		case 0:
			return localize('nothing')
		case 1:
			return arr[0]
		case 2:
			return arr[0] + localize(`conjunction.${conjunction}_2`) + arr[1]
		default:
			return `${arr.slice(0, -1).join(localize(`conjunction.${conjunction}_3+_1`))}${localize(`conjunction.${conjunction}_3+_2`)}${arr[arr.length - 1]}`
	}
}
