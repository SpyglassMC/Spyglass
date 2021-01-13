import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Position } from 'vscode-languageserver/node'
import { onSelectionRanges } from '../../services/onSelectionRanges'
import { McfunctionDocument } from '../../types'
import { Token, TokenType } from '../../types/Token'
import { mockCommand, mockParsingContext } from '../utils.spec'

describe('onSelectionRanges() Tests', () => {
    it('Should return selection ranges', () => {
        const positions: Position[] = [{
            line: 0,
            character: 4
        }]
        const ctx = mockParsingContext({
            content: 'tp ~ ~ ~'
        })
        const doc: McfunctionDocument = {
            type: 'mcfunction',
            nodes: [
                mockCommand({
                    range: { start: 0, end: 8 },
                    tokens: [
                        new Token({ start: 0, end: 2 }, TokenType.literal),
                        new Token({ start: 3, end: 8 }, TokenType.literal)
                    ]
                })
            ],
        }

        const ranges = onSelectionRanges({ doc, textDoc: ctx.textDoc, positions })

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
