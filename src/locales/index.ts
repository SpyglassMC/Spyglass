import { LOCALES as JsonLocales } from '@mcschema/core'
import { Locale } from '../types/Locale'
import AmericanEnglish from './en.json'

const Locales: {
    en: Locale,
    [key: string]: Locale
} = {
    '': AmericanEnglish,
    en: AmericanEnglish
}

let language = ''

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

async function setupLanguage(code: string) {
    const locale = await import(`./${code}.json`)
    Locales[code] = locale
    language = code

    const jsonLocale = await import(`@mcschema/locales/src/${code}.json`)
    JsonLocales.register(code, jsonLocale)
    JsonLocales.language = code

    console.info(`[I18N] Set to “${code}”.`)
}

/* istanbul ignore next */
export async function loadLocale(setting: string, defaultLocaleCode: string) {
    const specifiedLanguage = setting.toLowerCase() === 'default' ? defaultLocaleCode : setting
    if (language !== specifiedLanguage) {
        return setupLanguage(specifiedLanguage)
    }
}
