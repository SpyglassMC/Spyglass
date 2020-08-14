import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Token, TokenType } from '../../types/Token'
import { StringReader } from '../../utils/StringReader'
import { mockParsingContext } from '../utils.spec'

describe('Token Tests', () => {
    describe('toArray() Tests', () => {
        it('Should calculate the deltas', () => {
            const info = mockParsingContext({
                content: '\n\n23456789'
            })
            const token = new Token({ start: 5, end: 9 }, 0, new Set([0]))
            const actual = token.toArray(info.textDoc)
            assert.deepStrictEqual(actual, [2, 3, 4, 0, 1])
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
