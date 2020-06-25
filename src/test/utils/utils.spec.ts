import assert = require('power-assert')
import { describe, it } from 'mocha'
import os from 'os'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { constructConfig, LintConfig } from '../../types/Config'
import { Formattable, GetFormattedString } from '../../types/Formattable'
import { ErrorCode, ParsingError } from '../../types/ParsingError'
import { QuoteTypeConfig } from '../../types/QuoteTypeConfig'
import { DiagnosticConfig } from '../../types/StylisticConfig'
import { arrayToCompletions, arrayToMessage, escapeString, getEol, quoteString, remapCompletionItem, toFormattedString, validateStringQuote } from '../../utils'

describe('utils.ts Tests', () => {
    describe('arrayToMessage() Tests', () => {
        it('Should return message for an empty array', () => {
            const arr: string[] = []
            const actual = arrayToMessage(arr)
            assert(actual === 'nothing')
        })
        it('Should return message for a string', () => {
            const str = 'foo'
            const actual = arrayToMessage(str)
            assert(actual === '‘foo’')
        })
        it('Should return message for an one-element array', () => {
            const arr = ['foo']
            const actual = arrayToMessage(arr)
            assert(actual === '‘foo’')
        })
        it('Should return message for a two-element array', () => {
            const arr = ['bar', 'foo']
            const actual = arrayToMessage(arr)
            assert(actual === '‘bar’ and ‘foo’')
        })
        it('Should return message for a multi-element array', () => {
            const arr = ['bar', 'baz', 'foo']
            const actual = arrayToMessage(arr)
            assert(actual === '‘bar’, ‘baz’, and ‘foo’')
        })
        it('Should use another conjuction when specified', () => {
            const arr = ['bar', 'baz', 'foo']
            const actual = arrayToMessage(arr, undefined, 'or')
            assert(actual === '‘bar’, ‘baz’, or ‘foo’')
        })
        it('Should not quote when specified', () => {
            const arr = ['bar', 'baz', 'foo']
            const actual = arrayToMessage(arr, false)
            assert(actual === 'bar, baz, and foo')
        })
    })
    describe('escapeString() Tests', () => {
        it('Should escape string.', () => {
            const str = `{Text1:'{\\"text\\":\\"\\"}'}`
            const actual = escapeString(str)
            assert(actual === `{Text1:'{\\\\\\"text\\\\\\":\\\\\\"\\\\\\"}'}`)
        })
    })
    describe('quoteString() Tests', () => {
        it('Should always use single quotes.', () => {
            const inner = 'foo'
            const quoteType = 'always single'
            const force = true
            const actual = quoteString(inner, quoteType, force)
            assert(actual === "'foo'")
        })
        it('Should always use double quotes.', () => {
            const inner = 'foo'
            const quoteType = 'always double'
            const force = true
            const actual = quoteString(inner, quoteType, force)
            assert(actual === '"foo"')
        })
        it('Should use single quotes when prefers single quotes.', () => {
            const inner = 'foo'
            const quoteType = 'prefer single'
            const force = true
            const actual = quoteString(inner, quoteType, force)
            assert(actual === "'foo'")
        })
        it('Should use double quotes when prefers single quotes.', () => {
            const inner = "'foo'"
            const quoteType = 'prefer single'
            const force = true
            const actual = quoteString(inner, quoteType, force)
            assert(actual === `"'foo'"`)
        })
        it('Should use double quotes when prefers double quotes.', () => {
            const inner = 'foo'
            const quoteType = 'prefer double'
            const force = true
            const actual = quoteString(inner, quoteType, force)
            assert(actual === '"foo"')
        })
        it('Should use single quotes when prefers double quotes.', () => {
            const inner = '"foo"'
            const quoteType = 'prefer double'
            const force = true
            const actual = quoteString(inner, quoteType, force)
            assert(actual === `'"foo"'`)
        })
        it('Should not quote when not necessary.', () => {
            const inner = 'foo'
            const quoteType = 'prefer double'
            const force = false
            const actual = quoteString(inner, quoteType, force)
            assert(actual === 'foo')
        })
        it('Should quote when necessary.', () => {
            const inner = '!@#$%'
            const quoteType = 'prefer double'
            const force = false
            const actual = quoteString(inner, quoteType, force)
            assert(actual === '"!@#$%"')
        })
        it('Should quote boolean-like values regardless.', () => {
            const inner = 'tRuE'
            const quoteType = 'prefer double'
            const force = false
            const actual = quoteString(inner, quoteType, force)
            assert(actual === '"tRuE"')
        })
    })
    describe('arrayToCompletions() Tests', () => {
        it('Should escape string.', () => {
            const arr = ['a', 2, 'c']
            const actual = arrayToCompletions(arr)
            assert.deepStrictEqual(actual, [
                { label: 'a' },
                { label: '2' },
                { label: 'c' }
            ])
        })
    })
    describe('toLintedString() Tests', () => {
        it('Should return for Formattable', () => {
            const { lint } = constructConfig({})
            const object = new class implements Formattable {
                [GetFormattedString](_lint: LintConfig) {
                    return 'aaa'
                }
            }
            const actual = toFormattedString(object, lint)
            assert(actual === 'aaa')
        })
        it('Should return for non-Formattable', () => {
            const { lint } = constructConfig({})
            const actual = toFormattedString({}, lint)
            assert(actual === '[object Object]')
        })
        it('Should return for undefined', () => {
            const { lint } = constructConfig({})
            const actual = toFormattedString(undefined, lint)
            assert(actual === '')
        })
    })
    describe('getEol() Tests', () => {
        it('Should return CRLF', () => {
            const { lint } = constructConfig({ lint: { eol: 'CRLF' } })
            const actual = getEol(lint)
            assert(actual === '\r\n')
        })
        it('Should return LF', () => {
            const { lint } = constructConfig({ lint: { eol: 'LF' } })
            const actual = getEol(lint)
            assert(actual === '\n')
        })
        it('Should return system-specific eol', () => {
            const { lint } = constructConfig({ lint: { eol: 'auto' } })
            const actual = getEol(lint)
            assert(actual === os.EOL)
        })
    })
    describe('remapCompletionItem() Tests', () => {
        it('Should return as-is if the completion item does not contain any TextEdits', () => {
            const actual = remapCompletionItem({ label: 'foo' }, { start: 1 })
            assert.deepStrictEqual(actual, { label: 'foo' })
        })
        it('Should return remap the lineNumber as needed', () => {
            const actual = remapCompletionItem({
                label: 'foo',
                textEdit: {
                    range: { start: { line: 0, character: 12 }, end: { line: 0, character: 16 } },
                    newText: 'foo'
                }
            }, offset => ({ line: 42, character: offset }))
            assert.deepStrictEqual(actual, {
                label: 'foo',
                textEdit: {
                    range: { start: { line: 42, character: 12 }, end: { line: 42, character: 16 } },
                    newText: 'foo'
                }
            })
        })
        it('Should return remap the characters as needed', () => {
            const actual = remapCompletionItem({
                label: 'foo',
                textEdit: {
                    range: { start: { line: 0, character: 1 }, end: { line: 0, character: 3 } },
                    newText: 'foo'
                }
            }, { start: 1 })
            assert.deepStrictEqual(actual, {
                label: 'foo',
                textEdit: {
                    range: { start: { line: 0, character: 2 }, end: { line: 0, character: 4 } },
                    newText: 'foo'
                }
            })
        })
    })
    describe('validateStringQuote() Tests', () => {
        it('Should return nothing when there are no regulations', () => {
            const raw = '"foo"'
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = null
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = null
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [])
        })
        it('Should return nothing when should not quote', () => {
            const raw = 'foo'
            const value = 'foo'
            const range = { start: 0, end: 3 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', false]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = null
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [])
        })
        it('Should return errors when should not quote', () => {
            const raw = '"foo"'
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', false]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = null
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [new ParsingError(
                range,
                `Expected an unquoted string but got ‘"’ (rule: ‘stringQuote’)`,
                undefined, DiagnosticSeverity.Information,
                ErrorCode.StringUnquote
            )])
        })
        it('Should return errors when should not quote without rule name', () => {
            const raw = '"foo"'
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', false]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = null
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig)
            assert.deepStrictEqual(actual, [new ParsingError(
                range,
                `Expected an unquoted string but got ‘"’`,
                undefined, DiagnosticSeverity.Information,
                ErrorCode.StringUnquote
            )])
        })
        it('Should return nothing when should quote', () => {
            const raw = '"foo"'
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', true]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = null
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [])
        })
        it('Should return errors when should quote', () => {
            const raw = 'foo'
            const value = 'foo'
            const range = { start: 0, end: 3 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', true]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = null
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [new ParsingError(
                range,
                `Expected a quote (‘'’ or ‘"’) but got ‘f’ (rule: ‘stringQuote’)`,
                undefined, DiagnosticSeverity.Information,
                ErrorCode.StringDoubleQuote
            )])
        })
        it('Should return nothing when should quote with single quotation marks', () => {
            const raw = "'foo'"
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', true]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = ['information', 'always single']
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [])
        })
        it('Should return errors when should quote with single quotation marks', () => {
            const raw = '"foo"'
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', true]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = ['information', 'always single']
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [new ParsingError(
                range,
                `Expected ‘'’ but got ‘"’ (rule: ‘stringQuoteType’)`,
                undefined, DiagnosticSeverity.Information,
                ErrorCode.StringSingleQuote
            )])
        })
        it('Should return errors when should quote with single quotation marks without rule name', () => {
            const raw = '"foo"'
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', true]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = ['information', 'always single']
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig)
            assert.deepStrictEqual(actual, [new ParsingError(
                range,
                `Expected ‘'’ but got ‘"’`,
                undefined, DiagnosticSeverity.Information,
                ErrorCode.StringSingleQuote
            )])
        })
        it('Should return nothing when should quote with double quotation marks', () => {
            const raw = '"foo"'
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', true]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = ['information', 'always double']
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [])
        })
        it('Should return errors when should quote with double quotation marks', () => {
            const raw = "'foo'"
            const value = 'foo'
            const range = { start: 0, end: 5 }
            const quoteConfig: DiagnosticConfig<boolean> = ['information', true]
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = ['information', 'always double']
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [new ParsingError(
                range,
                `Expected ‘"’ but got ‘'’ (rule: ‘stringQuoteType’)`,
                undefined, DiagnosticSeverity.Information,
                ErrorCode.StringDoubleQuote
            )])
        })
        it('Should return nothing when may use double quotation marks', () => {
            const raw = 'foo'
            const value = 'foo'
            const range = { start: 0, end: 3 }
            const quoteConfig: DiagnosticConfig<boolean> = null
            const quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig> = ['information', 'always double']
            const actual = validateStringQuote(raw, value, range, quoteConfig, quoteTypeConfig, 'stringQuote', 'stringQuoteType')
            assert.deepStrictEqual(actual, [])
        })
    })
})
