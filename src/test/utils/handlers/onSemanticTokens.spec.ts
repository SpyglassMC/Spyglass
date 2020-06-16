import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Token, TokenType } from '../../../types/Token'
import { onSemanticTokens } from '../../../utils/handlers/onSemanticTokens'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onSemanticTokens() Tests', () => {
    it('Should return correctly', () => {
        const info = mockFunctionInfo({
            nodes: [
                mockLineNode({
                    tokens: [new Token({ start: 0, end: 8 }, TokenType.comment)]
                }),
                mockLineNode({
                    tokens: [new Token({ start: 9, end: 17 }, TokenType.comment)]
                })
            ],
            content: '# Test 0\n# Test 1'
        })

        const actual = onSemanticTokens({ info })

        assert.deepStrictEqual(actual.data, [
            0, 0, 8, TokenType.comment, 0,
            1, 0, 8, TokenType.comment, 0
        ])
    })
})
