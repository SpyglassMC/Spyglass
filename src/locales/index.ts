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
let vscodeLanguage = ''

/* istanbul ignore next */
export function locale(key: string, ...params: any[]) {
    const value: string | undefined = Locales[language][key] ?? Locales.en[key]

    return resolveLocalePlaceholders(value, params) ?? (
        console.error(new Error(`Unknown locale key ‘${key}’`)),
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
export async function loadLocale(console: Console, setting: string) {
    if (setting.toLowerCase() === 'default') {
        if (!language) {
            await loadVscodeLanguage(console)
            await setupLanguage(vscodeLanguage)
            console.info(`[I18N] VS Code: ‘${language}’.`)
        } else if (language !== vscodeLanguage) {
            language = vscodeLanguage
            await setupLanguage(vscodeLanguage)
            console.info(`[I18N] VS Code: ‘${language}’.`)
        }
    } else if (language !== setting) {
        await setupLanguage(setting)
        console.info(`[I18N] Specified: ‘${setting}’.`)
    }
}

/* istanbul ignore next */
async function loadVscodeLanguage(console: Console) {
    language = 'en'

    if (process.env.VSCODE_NLS_CONFIG) {
        try {
            const config = JSON.parse(process.env.VSCODE_NLS_CONFIG)
            if (typeof config.locale === 'string') {
                const code: string = config.locale
                try {
                    await setupLanguage(code)
                } catch (e) {
                    console.warn(`[I18N] Faild: ‘${code}’.`)
                }
            } else {
                console.warn(`[I18N] Have issues parsing VSCODE_NLS_CONFIG: ‘${process.env.VSCODE_NLS_CONFIG}’`)
            }
        } catch (ignored) {
            console.warn(`[I18N] Have issues parsing VSCODE_NLS_CONFIG: ‘${process.env.VSCODE_NLS_CONFIG}’`)
        }
    } else {
        console.warn('[I18N] No VSCODE_NLS_CONFIG found.')
    }

    vscodeLanguage = language
}
