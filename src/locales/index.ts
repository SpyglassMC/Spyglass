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
    let value = Locales[language][key]
    if (value === undefined) {
        value = Locales.en[key]
    }

    if (!value) {
        console.error(new Error(`Unknown locale key ‘${key}’`))
        value = ''
    }

    value = value.replace(/%\d+%/g, match => {
        const index = parseInt(match.slice(1, -1))
        return params[index] !== undefined ? params[index] : match
    })

    return value
}

async function setupLanguage(code: string) {
    const locale = await import(`./${code}.json`)
    Locales[code] = locale
    language = code

    const jsonLocale = await import(`@mcschema/core/locales/${code}.json`)
    JsonLocales.register(code, jsonLocale)
    JsonLocales.language = code
}

/* istanbul ignore next */
export async function loadLocale(console: Console, setting: string) {
    if (setting.toLowerCase() === 'default') {
        if (!language) {
            await loadVscodeLanguage(console)
            console.info(`[I18N] VS Code: ‘${language}’.`)
        } else if (language !== vscodeLanguage) {
            language = vscodeLanguage
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
