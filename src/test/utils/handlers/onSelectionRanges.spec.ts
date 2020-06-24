import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Position } from 'vscode-languageserver'
import { Token, TokenType } from '../../../types/Token'
import { onSelectionRanges } from '../../../utils/handlers/onSelectionRanges'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onSelectionRanges() Tests', () => {
    it('Should return selection ranges', () => {
        const positions: Position[] = [{
            line: 0,
            character: 4
        }]
        const info = mockFunctionInfo({
            nodes: [
                mockLineNode({
                    range: { start: 0, end: 8 },
                    tokens: [
                        new Token({ start: 0, end: 2 }, TokenType.literal),
                        new Token({ start: 3, end: 8 }, TokenType.literal)
                    ]
                })
            ],
            content: 'tp ~ ~ ~'
        })

        const ranges = onSelectionRanges({ info, positions })

        assert.deepStrictEqual(ranges, [
            {
                range: {
                    start: { line: 0, character: 3 },
                    end: { line: 0, character: 8 }
                }
            }
        ])
    })
})
