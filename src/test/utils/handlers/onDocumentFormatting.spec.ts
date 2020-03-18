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
                    { parser: 'namespacedID', data: new IdentityNode(undefined, ['stone']) }
                ]
            }],
            strings: [
                'fake stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepEqual(edits, [{
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
                    { parser: 'namespacedID', data: new IdentityNode(undefined, ['stone']) }
                ]
            }],
            strings: [
                '     fake stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepEqual(edits, [{
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
                        { parser: 'namespacedID', data: new IdentityNode(undefined, ['stone']) }
                    ],
                    errors: [
                        new ParsingError({ start: 0, end: 5 }, '')
                    ]
                },
                {
                    hint: { fix: [], options: [] }, tokens: [],
                    args: [
                        { parser: 'literal', data: 'fake' },
                        { parser: 'namespacedID', data: new IdentityNode(undefined, ['stone']) }
                    ]
                }
            ],
            strings: [
                'wrong stone',
                'fake stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert.deepEqual(edits, [{
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 10 } },
            newText: 'fake minecraft:stone'
        }])
    })
    it('Should return null when the feature is disabled', () => {
        const info: FunctionInfo = {
            version: 0, lineBreak: '\n',
            config: VanillaConfig,
            lines: [{
                hint: { fix: [], options: [] }, tokens: [],
                args: [
                    { parser: 'literal', data: 'fake' },
                    { parser: 'namespacedID', data: new IdentityNode(undefined, ['stone']) }
                ]
            }],
            strings: [
                'fake stone'
            ]
        }

        const edits = onDocumentFormatting({ info })

        assert(edits === null)
    })
})
