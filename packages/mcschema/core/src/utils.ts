export function escapeString(str: string) {
    return str.replace(/(\\|")/g, '\\$1')
}

export function quoteString(str: string) {
    return `"${escapeString(str)}"`
}
