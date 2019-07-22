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
