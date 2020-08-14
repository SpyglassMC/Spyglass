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
}

/* istanbul ignore next */
export async function loadLocale(setting: string, defauldLocaleCode: string) {
    if (setting.toLowerCase() === 'default') {
        if (!language) {
            await setupLanguage(defauldLocaleCode)
            console.info(`[I18N] Default: “${language}”.`)
        } else if (language !== defauldLocaleCode) {
            language = defauldLocaleCode
            await setupLanguage(defauldLocaleCode)
            console.info(`[I18N] Default: “${language}”.`)
        }
    } else if (language !== setting) {
        await setupLanguage(setting)
        console.info(`[I18N] Specified: “${setting}”.`)
    }
}
