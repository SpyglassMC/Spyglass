import assert = require('power-assert')
import os from 'os'
import Formattable, { GetFormattedString } from '../../types/Formattable'
import { describe, it } from 'mocha'
import { arrayToMessage, escapeString, quoteString, arrayToCompletions, toFormattedString, getEol } from '../../utils/utils'
import { constructConfig, LintConfig } from '../../types/Config'

describe('utils.ts Tests', () => {
    describe('arrayToMessage() Tests', () => {
        it('Should return message for an empty array', () => {
            const arr: string[] = []
            const actual = arrayToMessage(arr)
            assert(actual === 'nothing')
        })
        it('Should return message for a string', () => {
            const arr = 'foo'
            const actual = arrayToMessage(arr)
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
})
