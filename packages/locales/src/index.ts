/* istanbul ignore file */

import Fallback from './en.json'

type Locale = Record<string, string>

const Locales: Record<string, Locale> = {
	en: Fallback,
}

let language = 'en'

export function localize(key: string, params?: any[]): string
export function localize(segments: string[], params?: any[], depth?: number, minDepth?: number): string
export function localize(param0: string | string[], params: any[] = [], depth = 5, minDepth = 1): string {
	if (typeof param0 === 'string') {
		return _localize(param0, params)
	}
	return _segmentedLocalize(param0, params, depth, minDepth)
}

export function localeQuote(content: string) {
	return localize('punc.quote', [content])
}

/**
 * @param locale An [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag). Defaults to `en`.
 */
export async function loadLocale(locale = 'en'): Promise<void> {
	if (locale !== language) {
		return _setupLanguage(locale)
	}
}

function _localize(key: string, params: any[]) {
	const value: string | undefined = Locales[language][key] ?? Locales.en[key]

	return _resolveLocalePlaceholders(value, params) ?? '' /* (
		console.error(new Error(`Unknown locale key “${key}”`)),
		''
	) */
}

function _resolveLocalePlaceholders(val: string | undefined, params: string[]) {
	return val?.replace(/%\d+%/g, match => {
		const index = parseInt(match.slice(1, -1))
		return params?.[index] !== undefined ? params[index] : match
	})
}

function _segmentedLocalize(segments: string[], params: string[], depth: number, minDepth: number): string {
	return [language, 'en'].reduce((prev: string | undefined, code: string) => {
		if (prev !== undefined) return prev

		const array = segments.slice(-depth)
		while (array.length >= minDepth) {
			const locale = _resolveLocalePlaceholders(Locales[code][array.join('.')], params)
			if (locale !== undefined) return locale
			array.shift()
		}

		return undefined
	}, undefined) ?? ''
}

async function _setupLanguage(code: string) {
	const locale = await import(`./${code}.json`)
	Locales[code] = locale
	language = code

	// console.info(`[I18N] Set to “${code}”.`)
}

function _addPrefix(locale: Locale, prefix: string) {
	const ans: Locale = {}
	for (const key of Object.keys(locale)) {
		ans[`${prefix}.${key}`] = locale[key]
	}
	return ans
}

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
	const getPart = (str: string) => quoted ? localeQuote(str) : str
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
