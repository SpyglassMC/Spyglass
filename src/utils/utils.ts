import Config from '../types/Config'
import StringReader from './StringReader'

/**
 * Format input message.
 * @param msg Message.
 * @returns Formatted message.
 */
export function formatMessage(msg: string) {
    return `${msg[0].toUpperCase()}${msg.slice(1)}.`
}

/**
 * Convert an array to human-readable message.
 * @param arr Array.
 * @returns Human-readable message.
 * @example
 * arrayToMessage([]) // "nothing"
 * arrayToMessage(['foo']) // "`foo`"
 * arrayToMessage(['bar', 'foo']) // "`bar` and `foo`"
 * arrayToMessage(['bar', 'baz', 'foo']) // "`bar`, `baz` and `foo`"
 */
export function arrayToMessage(arr: string[]) {
    switch (arr.length) {
        case 0:
            return 'nothing'
        case 1:
            return `\`${arr[0]}\``
        case 2:
            return `\`${arr[0]}\` and \`${arr[1]}\``
        default:
            return `\`${arr.slice(0, -1).join('`, `')}\` and \`${arr.slice(-1)[0]}\``
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
    const shouldQuote = force || !StringReader.canInUnquotedString(inner)
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
                const containSingle = inner.indexOf("'") !== -1
                if (containSingle) {
                    quote = '"'
                } else {
                    quote = "'"
                }
                break
            case 'prefer double':
            default:
                const containDouble = inner.indexOf('"') !== -1
                if (containDouble) {
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
