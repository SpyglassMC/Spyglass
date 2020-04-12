import assert = require('power-assert')
import Token, { TokenType } from '../../types/Token'
import { describe, it } from 'mocha'
import StringReader from '../../utils/StringReader'

describe('Token Tests', () => {
    describe('toArray() Tests', () => {
        it('Should calculate the deltas', () => {
            const token = new Token({ start: 3, end: 5 }, 0, new Set([0]))
            const actual = token.toArray(2)
            assert.deepStrictEqual(actual, [2, 3, 2, 0, 1])
        })
    })
    describe('static from() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('0123')
            reader.cursor = 3
            const actual = Token.from(0, reader, TokenType.comment)
            assert.deepStrictEqual(actual, new Token({ start: 0, end: 3 }, TokenType.comment))
        })
    })
})
