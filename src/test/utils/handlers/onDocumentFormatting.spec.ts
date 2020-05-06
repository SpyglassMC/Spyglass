import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../types/Config'
import { FunctionInfo } from '../../../types/FunctionInfo'
import { IdentityNode } from '../../../types/nodes/IdentityNode'
import { ParsingError } from '../../../types/ParsingError'
import { onDocumentFormatting } from '../../../utils/handlers/onDocumentFormatting'

describe('onDocumentFormatting() Tests', () => {
    const config = constructConfig({})
    it('Should return correctly', () => {
        const info: FunctionInfo = {
            config, version: 0, lineBreak: '\n',
            lines: [{
                hint: { fix: [], options: [] }, tokens: [],
                args: [
                    { parser: 'literal', data: 'fake' },
                    { parser: 'identity', data: new IdentityNode('minecraft', ['stone']) }
                ]
            }],
            strings: [
                'fake minecraft:stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 20 } },
            newText: 'fake minecraft:stone'
        }])
    })
    it('Should keep leading spaces', () => {
        const info: FunctionInfo = {
            config, version: 0, lineBreak: '\n',
            lines: [{
                hint: { fix: [], options: [] }, tokens: [],
                args: [
                    { parser: 'literal', data: 'fake' },
                    { parser: 'identity', data: new IdentityNode('minecraft', ['stone']) }
                ]
            }],
            strings: [
                '     fake minecraft:stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 25 } },
            newText: '     fake minecraft:stone'
        }])
    })
    it('Should skip lines which have errors', () => {
        const info: FunctionInfo = {
            config, version: 0, lineBreak: '\n',
            lines: [
                {
                    hint: { fix: [], options: [] }, tokens: [],
                    args: [
                        { parser: 'literal', data: 'wrong' },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']) }
                    ],
                    errors: [
                        new ParsingError({ start: 0, end: 5 }, '')
                    ]
                },
                {
                    hint: { fix: [], options: [] }, tokens: [],
                    args: [
                        { parser: 'literal', data: 'fake' },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']) }
                    ]
                }
            ],
            strings: [
                'wrong minecraft:stone',
                'fake minecraft:stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 20 } },
            newText: 'fake minecraft:stone'
        }])
    })
})
