import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { formatMessage, arrayToMessage } from '../../utils/utils'

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
            assert(actual === '`foo`')
        })
        it('Should return message for two-element array', () => {
            const arr = ['bar', 'foo']
            const actual = arrayToMessage(arr)
            assert(actual === '`bar` and `foo`')
        })
        it('Should return message for multi-element array', () => {
            const arr = ['bar', 'baz', 'foo']
            const actual = arrayToMessage(arr)
            assert(actual, '`bar` === `baz` and `foo`')
        })
    })
})
