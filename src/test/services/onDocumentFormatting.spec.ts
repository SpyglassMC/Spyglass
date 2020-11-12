import assert = require('power-assert')
import dedent from 'dedent-js'
import { describe, it } from 'mocha'
import { IdentityNode } from '../../nodes/IdentityNode'
import { onDocumentFormatting } from '../../services/onDocumentFormatting'
import { McfunctionDocument } from '../../types'
import { VanillaConfig } from '../../types/Config'
import { ParsingError } from '../../types/ParsingError'
import { mockCommand, mockParsingContext } from '../utils.spec'

describe('onDocumentFormatting() Tests', () => {
    const config = VanillaConfig
    it('Should return correctly', () => {
        const doc: McfunctionDocument = {
            type: 'mcfunction',
            nodes: [
                mockCommand({
                    range: { start: 0, end: 20 },
                    data: [
                        { parser: 'literal', data: 'fake', range: { start: 0, end: 4 } },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']), range: { start: 5, end: 20 } }
                    ]
                })
            ]
        }
        const { textDoc } = mockParsingContext({
            content: 'fake minecraft:stone'
        })

        const edits = onDocumentFormatting({ textDoc, doc, config })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 0, character: 0 }, end: { line: 0, character: 20 } },
            newText: 'fake minecraft:stone'
        }])
    })
    it('Should keep leading spaces', () => {
        const doc: McfunctionDocument = {
            type: 'mcfunction',
            nodes: [
                mockCommand({
                    range: { start: 5, end: 25 },
                    data: [
                        { parser: 'literal', data: 'fake', range: { start: 0, end: 4 } },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']), range: { start: 5, end: 20 } }
                    ]
                })
            ]
        }
        const { textDoc } = mockParsingContext({
            content: '     fake minecraft:stone'
        })

        const edits = onDocumentFormatting({ textDoc, doc, config })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 0, character: 5 }, end: { line: 0, character: 25 } },
            newText: 'fake minecraft:stone'
        }])
    })
    it('Should skip lines which have errors', () => {
        const doc: McfunctionDocument = {
            type: 'mcfunction',
            nodes: [
                mockCommand({
                    range: { start: 0, end: 21 },
                    data: [
                        { parser: 'literal', data: 'wrong', range: { start: 0, end: 5 } },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']), range: { start: 6, end: 21 } }
                    ],
                    errors: [
                        new ParsingError({ start: 0, end: 5 }, '')
                    ]
                }),
                mockCommand({
                    range: { start: 22, end: 42 },
                    data: [
                        { parser: 'literal', data: 'fake', range: { start: 0, end: 4 } },
                        { parser: 'identity', data: new IdentityNode('minecraft', ['stone']), range: { start: 5, end: 20 } }
                    ]
                })
            ]
        }
        const { textDoc } = mockParsingContext({
            content: dedent`
            wrong minecraft:stone
            fake minecraft:stone`
        })

        const edits = onDocumentFormatting({ doc, textDoc, config })

        assert.deepStrictEqual(edits, [{
            range: { start: { line: 1, character: 0 }, end: { line: 1, character: 20 } },
            newText: 'fake minecraft:stone'
        }])
    })
})
