import assert = require('power-assert')
import dedent from 'dedent-js'
import { describe, it } from 'mocha'
import { NodeRange } from '../../nodes'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onDidChangeTextDocument } from '../../services/onDidChangeTextDocument'
import { McfunctionDocument } from '../../types'
import { VanillaConfig } from '../../types/Config'
import { Token, TokenType } from '../../types/Token'
import { mockLineNode, mockParsingContext } from '../utils.spec'

describe('onDidChangeTextDocument() Tests', () => {
    const config = VanillaConfig
    const version = 1
    it('Should handle with full update', async () => {
        const doc: McfunctionDocument = {
            type: 'mcfunction',
            nodes: [
                mockLineNode({
                    range: { start: 0, end: 8 },
                    args: [{ data: '# Test 0', parser: 'string' }],
                    tokens: [new Token({ start: 0, end: 8 }, TokenType.comment)]
                }),
                mockLineNode({
                    range: { start: 9, end: 16 },
                    args: [{ data: '# Test 1', parser: 'string' }],
                    tokens: [new Token({ start: 9, end: 16 }, TokenType.comment)]
                }),
                mockLineNode({
                    range: { start: 17, end: 25 },
                    args: [{ data: '# Test 2', parser: 'string' }],
                    tokens: [new Token({ start: 17, end: 25 }, TokenType.comment)]
                })
            ]
        }
        const { textDoc } = mockParsingContext({
            content: dedent`
            # Test 0
            # Test 1
            # Test 2`
        })
        const contentChanges = [{ text: '# Modified' }]
        const service = new DatapackLanguageService()
        const uri = service.parseUri('file:///c:/foo')

        await onDidChangeTextDocument({ service, uri, doc, textDoc, version, config, contentChanges })

        assert(textDoc.getText() === '# Modified')
        assert(textDoc.version === version)
        assert.deepStrictEqual(doc.nodes, [{
            [NodeRange]: { start: 0, end: 10 },
            args: [{ data: '# Modified', parser: 'string' }],
            tokens: [],
            hint: { fix: [], options: [] },
            completions: undefined
        }])
    })
})
