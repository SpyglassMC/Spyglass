/* istanbul ignore file */

// @ts-expect-error
import Fallback from './locales/en.js'

type Locale = Record<string, string>

const Locales: Record<string, Locale> = {
	en: Fallback,
}

let language = 'en'

type Parameter =
	| string
	| number
	| boolean
	| bigint
	| RegExp
	| Date
	| Iterable<string>

/**
 * @param key The locale key.
 * @param params All parameters that will be filled into the locale string.
 * If a string array is provided as a parameter, it will be converted to
 * string by the `arrayToMessage` method with `quoted=true, conjunction='or'` arguments.
 */
export function localize(key: string, ...params: Parameter[]): string {
	const value: string | undefined = Locales[language][key] ?? Locales.en[key]

	return _resolveLocalePlaceholders(value, params) ?? ''
}

export function localeQuote(content: string) {
	return localize('punc.quote', content)
}

/**
 * @param locale An [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag). Defaults to `en`.
 */
export async function loadLocale(locale = 'en'): Promise<void> {
	if (locale !== language) {
		return _setupLanguage(locale)
	}
}

function _resolveLocalePlaceholders(
	val: string | undefined,
	params: Parameter[],
): string | undefined {
	return val?.replace(/%\d+%/g, (match) => {
		const index = parseInt(match.slice(1, -1))
		let param: Parameter | undefined = params[index]
		if (
			typeof param !== 'string' &&
			(param as Iterable<string>)?.[Symbol.iterator]
		) {
			param = arrayToMessage(param as Iterable<string>)
		}
		return `${param ?? match}`
	})
}

async function _setupLanguage(code: string) {
	const locale = await import(`./locales/${code}.js`)
	Locales[code] = locale
	language = code

	// console.info(`[I18N] Set to “${code}”.`)
}

/**
 * Convert an array to human-readable message.
 * @param quoted Whether or not to quote the parts. Defaults to `true`
 * @param conjunction The conjunction to use. Defaults to `or`.
 * @returns Human-readable message.
 * @example // Using English
 * arrayToMessage([]) // "nothing"
 * arrayToMessage('foo') // "“foo”"
 * arrayToMessage(['foo']) // "“foo”"
 * arrayToMessage(['bar', 'foo']) // "“bar” or “foo”"
 * arrayToMessage(['bar', 'baz', 'foo']) // "“bar”, “baz”, or “foo”"
 * @example // Using Locale
 * arrayToMessage([], false) // "nothing"
 * arrayToMessage(['A'], false) // "A"
 * arrayToMessage(['A', 'B'], false) // "A{conjunction.or_2}B"
 * arrayToMessage(['A', 'B', 'C'], false) // "A{conjunction.or_3+_1}B{conjunction.or_3+_2}C"
 */
export function arrayToMessage(
	param: string | Iterable<string>,
	quoted = true,
	conjunction: 'and' | 'or' = 'or',
) {
	const getPart = (str: string) => (quoted ? localeQuote(str) : str)
	const arr = (typeof param === 'string' ? [param] : Array.from(param)).map(
		getPart,
	)
	switch (arr.length) {
		case 0:
			return localize('nothing')
		case 1:
			return arr[0]
		case 2:
			return arr[0] + localize(`conjunction.${conjunction}_2`) + arr[1]
		default:
			return `${arr
				.slice(0, -1)
				.join(localize(`conjunction.${conjunction}_3+_1`))}${localize(
				`conjunction.${conjunction}_3+_2`,
			)}${arr[arr.length - 1]}`
	}
}
