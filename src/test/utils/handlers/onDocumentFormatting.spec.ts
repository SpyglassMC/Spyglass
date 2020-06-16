import assert = require('power-assert')
import dedent from 'dedent-js'
import { describe, it } from 'mocha'
import { IdentityNode } from '../../../nodes/IdentityNode'
import { constructConfig } from '../../../types/Config'
import { ParsingError } from '../../../types/ParsingError'
import { onDocumentFormatting } from '../../../utils/handlers/onDocumentFormatting'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onDocumentFormatting() Tests', () => {
    const config = constructConfig({})
    it('Should return correctly', () => {
        const info = mockFunctionInfo({
            nodes: [
                mockLineNode({
                    range: { start: 0, end: 20 },
                    args: [
                        { parser: 'literal', data: 'fake' },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']) }
                    ]
                })
            ],
            content: 'fake minecraft:stone'
        })

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 20 } },
            newText: 'fake minecraft:stone'
        }])
    })
    it('Should keep leading spaces', () => {
        const info = mockFunctionInfo({
            nodes: [
                mockLineNode({
                    range: { start: 5, end: 25 },
                    args: [
                        { parser: 'literal', data: 'fake' },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']) }
                    ]
                })
            ],
            content: '     fake minecraft:stone'
        })

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 0, character: 5 }, end: { line: 0, character: 25 } },
            newText: 'fake minecraft:stone'
        }])
    })
    it('Should skip lines which have errors', () => {
        const info = mockFunctionInfo({
            nodes: [
                mockLineNode({
                    range: { start: 0, end: 21 },
                    args: [
                        { parser: 'literal', data: 'wrong' },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']) }
                    ],
                    errors: [
                        new ParsingError({ start: 0, end: 5 }, '')
                    ]
                }),
                mockLineNode({
                    range: { start: 22, end: 42 },
                    args: [
                        { parser: 'literal', data: 'fake' },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']) }
                    ]
                })
            ],
            content: dedent`
            wrong minecraft:stone
            fake minecraft:stone`
        })

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 20 } },
            newText: 'fake minecraft:stone'
        }])
    })
})
