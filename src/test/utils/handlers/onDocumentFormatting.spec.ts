import assert = require('power-assert')
import { describe, it } from 'mocha'
import FunctionInfo from '../../../types/FunctionInfo'
import onDocumentFormatting from '../../../utils/handlers/onDocumentFormatting'
import { VanillaConfig, constructConfig } from '../../../types/Config'
import IdentityNode from '../../../types/nodes/IdentityNode'
import ParsingError from '../../../types/ParsingError'

describe('onDocumentFormatting() Tests', () => {
    const config = constructConfig({ lint: { enableFormatting: true } })
    it('Should return correctly', () => {
        const info: FunctionInfo = {
            config, version: 0, lineBreak: '\n',
            lines: [{
                hint: { fix: [], options: [] }, tokens: [],
                args: [
                    { parser: 'literal', data: 'fake' },
                    { parser: 'namespacedID', data: new IdentityNode('minecraft', ['stone']) }
                ]
            }],
            strings: [
                'fake stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 10 } },
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
                    { parser: 'namespacedID', data: new IdentityNode('minecraft', ['stone']) }
                ]
            }],
            strings: [
                '     fake stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 15 } },
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
                        { parser: 'namespacedID', data: new IdentityNode('minecraft', ['stone']) }
                    ],
                    errors: [
                        new ParsingError({ start: 0, end: 5 }, '')
                    ]
                },
                {
                    hint: { fix: [], options: [] }, tokens: [],
                    args: [
                        { parser: 'literal', data: 'fake' },
                        { parser: 'namespacedID', data: new IdentityNode('minecraft', ['stone']) }
                    ]
                }
            ],
            strings: [
                'wrong stone',
                'fake stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 10 } },
            newText: 'fake minecraft:stone'
        }])
    })
})
