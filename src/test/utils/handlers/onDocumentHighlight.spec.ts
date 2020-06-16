import assert = require('power-assert')
import dedent from 'dedent-js'
import { describe, it } from 'mocha'
import { Position } from 'vscode-languageserver'
import { Token, TokenType } from '../../../types/Token'
import { onDocumentHighlight } from '../../../utils/handlers/onDocumentHighlight'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onDocumentHighlight() Tests', () => {
    const info = mockFunctionInfo({
        nodes: [
            mockLineNode({
                tokens: [
                    new Token({ start: 0, end: 4 }, TokenType.literal),
                    new Token({ start: 5, end: 13 }, TokenType.entity)
                ],
                cache: {
                    entities: {
                        SPGoding: {
                            def: [],
                            ref: [{ start: 5, end: 13 }]
                        }
                    }
                }
            }),
            mockLineNode({
                tokens: [
                    new Token({ start: 0, end: 4 }, TokenType.literal),
                    new Token({ start: 5, end: 13 }, TokenType.entity)
                ],
                cache: {
                    entities: {
                        SPGoding: {
                            def: [],
                            ref: [{ start: 5, end: 13 }]
                        }
                    }
                }
            })
        ],
        content: dedent`
        kill SPGoding
        kill SPGoding`
    })
    it('Should return ranges for all references of the selected cache stuff', () => {
        const position: Position = {
            line: 0,
            character: 8
        }

        const ranges = onDocumentHighlight({ info, position })

        assert.deepStrictEqual(ranges, [
            {
                range: {
                    start: { line: 0, character: 5 },
                    end: { line: 0, character: 13 }
                }
            },
            {
                range: {
                    start: { line: 1, character: 5 },
                    end: { line: 1, character: 13 }
                }
            }
        ])
    })
    it('Should return range for the selected token', () => {
        const position: Position = {
            line: 0,
            character: 2
        }

        const ranges = onDocumentHighlight({ info, position })

        assert.deepStrictEqual(ranges, [
            {
                range: {
                    start: { line: 0, character: 0 },
                    end: { line: 0, character: 4 }
                }
            }
        ])
    })
})
