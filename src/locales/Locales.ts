import AmericanEnglish from './en.json'
import Locale from '../types/Locale'

const Locales: {
    en: Locale,
    [key: string]: Locale
} = {
    en: AmericanEnglish
}

let language = 'en'

/* istanbul ignore next */
export function locale(key: string, ...params: any[]) {
    let value = Locales[language][key] || Locales.en[key]
    
    if (!value) {
        console.error(`Unknown locale key ‘${key}’`)
        value = ''
    }

    value = value.replace(/%\d+%/g, match => {
        const index = parseInt(match.slice(1, -1))
        return params[index] !== undefined ? params[index] : match
    })

    return value
}

/* istanbul ignore next */
export async function loadLocale() {
    if (!language) {
        language = 'en'

        console.log('[I18N] Start.')

        if (process.env.VSCODE_NLS_CONFIG) {
            try {
                const config = JSON.parse(process.env.VSCODE_NLS_CONFIG)
                if (typeof config.locale === 'string') {
                    const code: string = config.locale
                    if (code !== 'en') {
                        try {
                            console.log(`[I18N] Try: ‘${code}’.`)
                            const locale = await import(`./${code}.json`)
                            language = code
                            Locales[code] = locale
                            console.log(`[I18N] Succeded: ‘${code}’.`)
                        } catch (e) {
                            console.error(`[I18N] Faild: ‘${code}’.`)
                        }
                    }
                } else {
                    console.error(`[I18N] Have issues parsing VSCODE_NLS_CONFIG: ‘${process.env.VSCODE_NLS_CONFIG}’`)
                }
            } catch (ignored) {
                console.error(`[I18N] Have issues parsing VSCODE_NLS_CONFIG: ‘${process.env.VSCODE_NLS_CONFIG}’`)
            }
        } else {
            console.error('[I18N] No VSCODE_NLS_CONFIG found.')
        }

        console.log(`[I18N] Final: ‘${language}’.`)
    }
}
