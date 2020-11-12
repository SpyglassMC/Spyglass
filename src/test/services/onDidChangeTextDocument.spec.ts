import assert = require('power-assert')
import dedent from 'dedent-js'
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onDidChangeTextDocument } from '../../services/onDidChangeTextDocument'
import { CommandComponent, McfunctionDocument } from '../../types'
import { VanillaConfig } from '../../types/Config'
import { Token, TokenType } from '../../types/Token'
import { mockCommand, mockLanguageConfigs, mockParsingContext } from '../utils.spec'

describe('onDidChangeTextDocument() Tests', () => {
    const config = VanillaConfig
    const version = 1
    it('Should handle with full update', async () => {
        const languageConfigs = await mockLanguageConfigs()
        const doc: McfunctionDocument = {
            type: 'mcfunction',
            nodes: [
                mockCommand({
                    range: { start: 0, end: 8 },
                    data: [{ data: '# Test 0', parser: 'string', range: { start: 0, end: 8 } }],
                    tokens: [new Token({ start: 0, end: 8 }, TokenType.comment)]
                }),
                mockCommand({
                    range: { start: 9, end: 16 },
                    data: [{ data: '# Test 1', parser: 'string', range: { start: 9, end: 16 } }],
                    tokens: [new Token({ start: 9, end: 16 }, TokenType.comment)]
                }),
                mockCommand({
                    range: { start: 17, end: 25 },
                    data: [{ data: '# Test 2', parser: 'string', range: { start: 17, end: 25 } }],
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

        await onDidChangeTextDocument({ service, uri, doc, textDoc, version, config, contentChanges, languageConfigs })
        assert(textDoc.getText() === '# Modified')
        assert(textDoc.version === version)
        assert.deepStrictEqual(doc.nodes, [
            CommandComponent.create(
                [{ data: '# Modified', parser: 'string', range: { start: 0, end: 10 } }],
                {
                    range: { start: 0, end: 10 },
                }
            )
        ])
    })
})
