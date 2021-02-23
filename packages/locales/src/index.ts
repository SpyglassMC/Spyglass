import McschemaFallback from '@mcschema/locales/src/en.json'
import Fallback from './en.json'

type Locale = Record<string, string>

const Locales: Record<string, Locale> = {
	en: { ..._addPrefix(McschemaFallback, 'json'), ...Fallback },
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

export async function loadLocale(
	setting: string,
	defaultLocaleCode = 'en'
) {
	const specifiedLanguage = setting.toLowerCase() === 'default' ? defaultLocaleCode : setting
	if (specifiedLanguage !== language) {
		return _setupLanguage(specifiedLanguage)
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
	const jsonLocale = await import(`@mcschema/locales/src/${code}.json`)
	Locales[code] = { ..._addPrefix(jsonLocale, 'mcschema'), ...locale }
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
