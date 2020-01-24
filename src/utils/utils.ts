import StringReader from './StringReader'
import { CompletionItem } from 'vscode-languageserver'
import { ToLintedString } from '../types/Lintable'
import { LintConfig } from '../types/Config'
import { ToJsonString } from '../types/JsonConvertible'
import { locale } from '../locales/Locales'

/**
 * Format input message.
 * @param msg Message.
 * @returns Formatted message.
 */
export function formatMessage(msg: string) {
    return `${msg[0].toUpperCase()}${msg.slice(1)}${locale('punc.period')}`
}

/**
 * Convert an array to human-readable message.
 * @param arr An array.
 * @param quoted Whether or not to quote the result. Defaults to `true`
 * @param conjunction The conjunction to use. Defaults to `and`.
 * @returns Human-readable message.
 * @example // Using English
 * arrayToMessage([]) // "nothing"
 * arrayToMessage('foo') // "‘foo’"
 * arrayToMessage(['foo']) // "‘foo’"
 * arrayToMessage(['bar', 'foo']) // "‘bar’ and ‘foo’"
 * arrayToMessage(['bar', 'baz', 'foo']) // "‘bar’, ‘baz’, and ‘foo’"
 * @example // Using Locale
 * arrayToMessage([], false) // "nothing"
 * arrayToMessage(['A'], false) // "A"
 * arrayToMessage(['A', 'B'], false) // "A{conjunction.and_2}B"
 * arrayToMessage(['A', 'B', 'C'], false) // "A{conjunction.and_3+_1}B{conjunction.and_3+_2}C"
 */
export function arrayToMessage(arr: string | string[], quoted = true, conjunction: 'and' | 'or' = 'and') {
    if (typeof arr === 'string') {
        arr = [arr]
    }
    const getPart = (str: string) => quoted ? locale('punc.quote', str) : str
    switch (arr.length) {
        case 0:
            return locale('nothing')
        case 1:
            return getPart(arr[0])
        case 2:
            return getPart(arr[0]) + locale(`conjunction.${conjunction}_2`) + getPart(arr[1])
        default:
            arr = arr.map(v => getPart(v))
            return `${arr.slice(0, -1).join(locale(`conjunction.${conjunction}_3+_1`))}${locale(`conjunction.${conjunction}_3+_2`)}${arr[arr.length - 1]}`
    }
}

/**
 * Escape characters in a string with `\`.
 * @param str A string.
 * @param quote A string indicating which type of quote should be escaped.
 */
export function escapeString(str: string, quote: '"' | "'" = '"') {
    let ans = ''
    for (const char of str) {
        if (char === '\\' || char === quote) {
            ans += `\\${char}`
        } else {
            ans += char
        }
    }
    return ans
}

/**
 * Quote a string.
 * @param inner The inner string.
 * @param quoteType Which quote to use.
 * @param force Whether to quote regardless.
 */
export function quoteString(inner: string, quoteType: 'always single' | 'always double' | 'prefer single' | 'prefer double', force: boolean) {
    const shouldQuote = force ||
        !StringReader.canInUnquotedString(inner) ||
        inner.toLowerCase() === 'false' ||
        inner.toLowerCase() === 'true'
    if (shouldQuote) {
        let quote: "'" | '"'
        switch (quoteType) {
            case 'always double':
                quote = '"'
                break
            case 'always single':
                quote = "'"
                break
            case 'prefer single':
                const containSingleQuote = inner.includes("'")
                if (containSingleQuote) {
                    quote = '"'
                } else {
                    quote = "'"
                }
                break
            case 'prefer double':
            default:
                const containDoubleQuote = inner.includes('"')
                if (containDoubleQuote) {
                    quote = "'"
                } else {
                    quote = '"'
                }
                break
        }
        return `${quote}${escapeString(inner, quote)}${quote}`
    } else {
        return inner
    }
}

/**
 * Convert an array of any to an array of `CompletionItem`.
 * @param array An array
 */
export function arrayToCompletions(array: any[]): CompletionItem[] {
    return array.map(v => ({ label: v.toString() }))
}

/**
 * Convert specific value to a linted string.
 * @param value Any value.
 */
export function toLintedString(value: any, lint: LintConfig): string {
    if (value && value[ToLintedString]) {
        return value[ToLintedString](lint)
    } else {
        return `${value}`
    }
}

/**
 * Convert specific value to a JSON string.
 * @param value Any value.
 */
/* istanbul ignore next */
export function toJsonString(value: any, lint: LintConfig): string {
    if (value && value[ToJsonString]) {
        return value[ToJsonString](lint)
    } else {
        return toLintedString(value, lint)
    }
}
