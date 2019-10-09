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
 * @param arr An array.
 * @param quoted Whether or not to quote the result. Defaults to `true`
 * @param conjunction The conjunction to use. Defaults to `and`.
 * @returns Human-readable message.
 * @example
 * arrayToMessage([]) // "nothing"
 * arrayToMessage('foo') // "‘foo’"
 * arrayToMessage(['foo']) // "‘foo’"
 * arrayToMessage(['bar', 'foo']) // "‘bar’ and ‘foo’"
 * arrayToMessage(['bar', 'baz', 'foo']) // "‘bar’, ‘baz’ and ‘foo’"
 */
export function arrayToMessage(arr: string | string[], quoted = true, conjunction: 'and' | 'or' = 'and') {
    if (typeof arr === 'string') {
        arr = [arr]
    }
    const prefix = quoted ? '‘' : ''
    const suffix = quoted ? '’' : ''
    switch (arr.length) {
        case 0:
            return 'nothing'
        case 1:
            return `${prefix}${arr[0]}${suffix}`
        case 2:
            return `${prefix}${arr[0]}${suffix} ${conjunction} ${prefix}${arr[1]}${suffix}`
        default:
            return `${prefix}${arr.slice(0, -1).join(`${suffix}, ${prefix}`)}${suffix} ${conjunction} ${prefix}${arr.slice(-1)[0]}${suffix}`
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
                const containSingleQuote = inner.indexOf("'") !== -1
                if (containSingleQuote) {
                    quote = '"'
                } else {
                    quote = "'"
                }
                break
            case 'prefer double':
            default:
                const containDoubleQuote = inner.indexOf('"') !== -1
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
