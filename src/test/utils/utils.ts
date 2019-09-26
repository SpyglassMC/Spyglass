import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { formatMessage, arrayToMessage, escapeString, quoteString } from '../../utils/utils'

describe('utils.ts Tests', () => {
    describe('formatMessage() Tests', () => {
        it('Should capitalize the first letter and append period', () => {
            const message = 'expected something'
            const actual = formatMessage(message)
            assert(actual === 'Expected something.')
        })
    })
    describe('arrayToMessage() Tests', () => {
        it('Should return message for empty array', () => {
            const arr: string[] = []
            const actual = arrayToMessage(arr)
            assert(actual === 'nothing')
        })
        it('Should return message for one-element array', () => {
            const arr = ['foo']
            const actual = arrayToMessage(arr)
            assert(actual === '‘foo’')
        })
        it('Should return message for two-element array', () => {
            const arr = ['bar', 'foo']
            const actual = arrayToMessage(arr)
            assert(actual === '‘bar’ and ‘foo’')
        })
        it('Should return message for multi-element array', () => {
            const arr = ['bar', 'baz', 'foo']
            const actual = arrayToMessage(arr)
            assert(actual, '‘bar’ === ‘baz’ and ‘foo’')
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
    })
})
