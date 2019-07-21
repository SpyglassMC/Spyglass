import * as assert from 'power-assert'
import { formatMessage, arrayToMessage } from '../../utils/utils'

describe('utils.ts Tests', () => {
    describe('formatMessage() Tests', () => {
        it('Should capitalize the first letter and append period', () => {
            const message = 'expected something'
            const actual = formatMessage(message)
            assert.strictEqual(actual, 'Expected something.')
        })
        it("Should replace quotes with '`'", () => {
            const message = 'expected "something"'
            const actual = formatMessage(message)
            assert.strictEqual(actual, 'Expected `something`.')
        })
    })
    describe('arrayToMessage() Tests', () => {
        it('Should return message for empty array', () => {
            const arr: string[] = []
            const actual = arrayToMessage(arr)
            assert.strictEqual(actual, 'nothing')
        })
        it('Should return message for one-element array', () => {
            const arr = ['foo']
            const actual = arrayToMessage(arr)
            assert.strictEqual(actual, '`foo`')
        })
        it('Should return message for two-element array', () => {
            const arr = ['bar', 'foo']
            const actual = arrayToMessage(arr)
            assert.strictEqual(actual, '`bar` and `foo`')
        })
        it('Should return message for multi-element array', () => {
            const arr = ['bar', 'baz', 'foo']
            const actual = arrayToMessage(arr)
            assert.strictEqual(actual, '`bar`, `baz` and `foo`')
        })
    })
})
