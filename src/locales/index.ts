import { Locale } from '../types/Locale'
import AmericanEnglish from './en.json'
import { Config } from '../types'

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
    language = code
    Locales[code] = locale
}

/* istanbul ignore next */
export async function loadLocale(console: Console, config: Config) {
    console.log(`Loading locale with setting ${config.env.language}`)
    if (config.env.language.toLowerCase() === 'default') {
        if (!language) {
            language = 'en'

            console.info('[I18N] Start.')

            if (process.env.VSCODE_NLS_CONFIG) {
                try {
                    const config = JSON.parse(process.env.VSCODE_NLS_CONFIG)
                    if (typeof config.locale === 'string') {
                        const code: string = config.locale
                        if (code !== 'en' && code !== 'en-us') {
                            try {
                                console.info(`[I18N] Try: ‘${code}’.`)
                                await setupLanguage(code)
                                console.info(`[I18N] Succeded: ‘${code}’.`)
                            } catch (e) {
                                console.warn(`[I18N] Faild: ‘${code}’.`)
                            }
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

            console.info(`[I18N] Final: ‘${language}’.`)
        }
    } else if (language !== config.env.language) {
        console.info('[I18N] Start.')
        await setupLanguage(config.env.language)
        console.info(`[I18N] Specified: ‘${config.env.language}’.`)
    }
}
