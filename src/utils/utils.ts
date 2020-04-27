import clone from 'clone'
import https from 'https'
import { EOL } from 'os'
import { CodeActionKind, CompletionItem, Diagnostic, TextEdit } from 'vscode-languageserver'
import { locale } from '../locales/Locales'
import { LintConfig } from '../types/Config'
import { GetFormattedString, isFormattable } from '../types/Formattable'
import IndexMapping, { getOuterIndex } from '../types/IndexMapping'
import { ToJsonString } from '../types/JsonConvertible'
import ParsingError, { ActionCode } from '../types/ParsingError'
import QuoteTypeConfig from '../types/QuoteTypeConfig'
import { DiagnosticConfig, getDiagnosticSeverity } from '../types/StylisticConfig'
import TextRange from '../types/TextRange'
import StringReader from './StringReader'

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
export function escapeString(str: string, quote: '"' | "'" | null = '"') {
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
 * @param forced Whether to quote regardless.
 */
export function quoteString(inner: string, quoteType: QuoteTypeConfig, forced: boolean) {
    const shouldQuote = forced ||
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

export function validateStringQuote(raw: string, value: string, range: TextRange, quoteConfig: DiagnosticConfig<boolean>, quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig>): ParsingError[] {
    const ans: ParsingError[] = []
    if (!quoteConfig && !quoteTypeConfig) {
        return ans
    }

    const firstChar = raw.charAt(0)
    const isQuoted = StringReader.isQuote(firstChar)

    const expectedChar = quoteString(value, quoteTypeConfig ? quoteTypeConfig[1] : 'prefer double', true).charAt(0)
    const specificQuoteCode = expectedChar === '"' ? ActionCode.StringDoubleQuote : ActionCode.StringSingleQuote

    if (quoteConfig) {
        const [severity, shouldQuoted] = quoteConfig
        if (shouldQuoted !== isQuoted) {
            ans.push(new ParsingError(
                range,
                locale('expected-got',
                    shouldQuoted ? locale('quote') : locale('string'),
                    locale('punc.quote', firstChar)
                ),
                true, getDiagnosticSeverity(severity),
                shouldQuoted ? specificQuoteCode : ActionCode.StringUnquote
            ))
        }
    }

    if (isQuoted && quoteTypeConfig) {
        const severity = quoteTypeConfig[0]
        if (firstChar !== expectedChar) {
            ans.push(new ParsingError(
                range,
                locale('expected-got',
                    locale('punc.quote', expectedChar),
                    locale('punc.quote', firstChar)
                ),
                true, getDiagnosticSeverity(severity),
                specificQuoteCode
            ))
        }
    }

    return ans
}

/**
 * Convert an array of any to an array of `CompletionItem`.
 * @param array An array
 */
export function arrayToCompletions(array: any[], cb = (c: CompletionItem) => c): CompletionItem[] {
    return array.map(v => cb({ label: v.toString() }))
}

/**
 * Convert specific value to a linted string.
 * @param value Any value.
 */
export function toFormattedString(value: unknown, lint: LintConfig): string {
    if (isFormattable(value)) {
        return value[GetFormattedString](lint)
    } else if (value === undefined || value === null) {
        return ''
    } else {
        return String(value)
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
        return toFormattedString(value, lint)
    }
}

/* istanbul ignore next */
export function requestText(uri: string) {
    return new Promise<string>((resolve, reject) => {
        https
            .get(uri, res => {
                let data: string = ''
                res.on('data', chunk => {
                    data += chunk
                })
                res.on('end', () => {
                    resolve(data)
                })
            })
            .on('error', e => {
                reject(e)
            })
            .end()
    })
}

/**
 * Get EOL from specific lint config.
 * @param param0 The lint config.
 */
export function getEol({ eol }: LintConfig) {
    switch (eol) {
        case 'CRLF':
            return '\r\n'
        case 'LF':
            return '\n'
        case 'auto':
        default:
            return EOL
    }
}

/**
 * @param titleLocaleKey The locale key of the code action title (without the `code-action.` part).
 */
/* istanbul ignore next */
export function getCodeAction(titleLocaleKey: string, diagnostics: Diagnostic[], uri: string, version: number | null, lineNumber: number, range: TextRange, newText: string, kind = CodeActionKind.QuickFix, isPreferred = true) {
    return {
        title: locale(`code-action.${titleLocaleKey}`),
        kind, diagnostics, isPreferred,
        edit: {
            documentChanges: [{
                textDocument: { uri, version },
                edits: [{
                    range: {
                        start: { line: lineNumber, character: range.start },
                        end: { line: lineNumber, character: range.end }
                    },
                    newText
                }]
            }]
        }
    }
}

/**
 * Remap all the indexes in the specific TextRange object by the specific mapping.
 * @param completion The specific TextRange object.
 * @param param1 The mapping used to offset.
 */
export function remapCompletionItem(completion: CompletionItem, mapping: IndexMapping): CompletionItem
export function remapCompletionItem(completion: CompletionItem, lineNumber: number): CompletionItem
export function remapCompletionItem(completion: CompletionItem, param1: IndexMapping | number) {
    const ans = clone(completion)
    if (ans.textEdit) {
        const range = ans.textEdit.range
        if (typeof param1 === 'number') {
            range.start.line = param1
            range.end.line = param1
        } else {
            range.start.character = getOuterIndex(param1, range.start.character)
            range.end.character = getOuterIndex(param1, range.end.character)
        }
    }
    return ans
}

/* istanbul ignore next */
export function handleCompletionText(origin: CompletionItem, cb: (str: string) => string) {
    let label = origin.label
    let insertText: string | undefined
    let textEdit: TextEdit | undefined
    if (origin.textEdit) {
        textEdit = {
            range: origin.textEdit.range,
            newText: cb(origin.textEdit.newText)
        }
    }
    if (origin.insertText) {
        insertText = cb(origin.insertText)
    }
    if (!origin.textEdit && !origin.insertText) {
        label = cb(origin.label)
    }
    return {
        ...origin,
        label,
        ...insertText ? { insertText } : {},
        ...textEdit ? { textEdit } : {}
    }
}
