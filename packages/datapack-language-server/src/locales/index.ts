import { Locale } from '../types/Locale'
import AmericanEnglish from './en.json'
import JsonAmericanEnglish from '@mcschema/locales/src/en.json'

const Locales: {
	en: Locale,
	[key: string]: Locale
} = {
	en: { ...addJsonPrefix(JsonAmericanEnglish), ...AmericanEnglish },
}

let language = ''
Locales[language] = Locales.en

/* istanbul ignore next */
export function locale(key: string, ...params: any[]) {
	const value: string | undefined = Locales[language][key] ?? Locales.en[key]

	return resolveLocalePlaceholders(value, params) ?? (
		console.error(new Error(`Unknown locale key “${key}”`)),
		''
	)
}

export function resolveLocalePlaceholders(val: string | undefined, params?: string[]) {
	return val?.replace(/%\d+%/g, match => {
		const index = parseInt(match.slice(1, -1))
		return params?.[index] !== undefined ? params[index] : match
	})
}

export function segmentedLocale(segments: string[], params?: string[], depth = 5, minDepth = 1): string | undefined {
	return [language, 'en'].reduce((prev: string | undefined, code) => {
		if (prev !== undefined) return prev

		const array = segments.slice(-depth)
		while (array.length >= minDepth) {
			const locale = resolveLocalePlaceholders(Locales[code][array.join('.')], params)
			if (locale !== undefined) return locale
			array.shift()
		}

		return undefined
	}, undefined)
}

async function setupLanguage(code: string) {
	const locale = await import(`./${code}.json`)
	const jsonLocale = await import(`@mcschema/locales/src/${code}.json`)
	Locales[code] = { ...addJsonPrefix(jsonLocale), ...locale }
	language = code

	console.info(`[I18N] Set to “${code}”.`)
}

function addJsonPrefix(jsonLocale: any) {
	const ans: any = {}
	for (const key of Object.keys(jsonLocale)) {
		ans[`json.${key}`] = jsonLocale[key]
	}
	return ans
}

/* istanbul ignore next */
export async function loadLocale(setting: string, defaultLocaleCode: string) {
	const specifiedLanguage = setting.toLowerCase() === 'default' ? defaultLocaleCode : setting
	if (language !== specifiedLanguage) {
		return setupLanguage(specifiedLanguage)
	}
}
