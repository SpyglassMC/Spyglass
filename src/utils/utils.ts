import Config from '../types/Config'

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

export function quoteString(str: string, config: Config) {

}
