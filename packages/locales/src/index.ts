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

	return _resolveLocalePlaceholders(value, params) ?? key
}

export function localeQuote(content: string) {
	return localize('punc.quote', content)
}

/**
 * @param locale A case-insensitive language tag following the format of
 * `\w+(-\w+)*` that should ideally correspond to the file name of one of the
 * files under `locales/`. Defaults to `en`.
 * @param dry @internal Don't actually change the locale.
 *
 * @returns The locale loaded.
 */
export async function loadLocale(locale = 'en', dry = false): Promise<string> {
	locale = locale.toLowerCase()

	if (locale === language) {
		return locale
	}

	try {
		return await _setupLanguage(locale, dry)
	} catch (e) {
		// Most likely due to unknown locale.

		const lastDashIndex = locale.lastIndexOf('-')
		if (lastDashIndex === -1) {
			// The locale has no subtags. No more locales to try.
			throw e
		}

		// Try again with the rightmost subtag removed.
		return loadLocale(locale.slice(0, lastDashIndex), dry)
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

async function _setupLanguage(code: string, dry = false) {
	const locale = await import(`./locales/${code}.js`)
	if (!dry) {
		Locales[code] = locale
		language = code
	}
	return code
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
			return `${
				arr
					.slice(0, -1)
					.join(localize(`conjunction.${conjunction}_3+_1`))
			}${
				localize(
					`conjunction.${conjunction}_3+_2`,
				)
			}${arr[arr.length - 1]}`
	}
}
