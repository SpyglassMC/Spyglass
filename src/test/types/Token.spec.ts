import assert = require('power-assert')
import Token from '../../types/Token'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { describe, it } from 'mocha'
import StringReader from '../../utils/StringReader'

describe('Token Tests', () => {
    Token.Types.set('comment', 0)
    describe('toArray() Tests', () => {
        it('Should calculate the deltas', () => {
            const token = new Token({ start: 3, end: 5 }, 'comment')
            const actual = token.toArray(2, 1, 0)
            assert.deepEqual(actual, [1, 3, 2, 0, 0])
        })
    })
    describe('static from() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('0123')
            reader.cursor = 3
            const actual = Token.from(0, reader, 'comment')
            assert.deepEqual(actual, new Token({ start: 0, end: 3 }, 'comment'))
        })
    })
})
