import assert = require('power-assert')
import dedent from 'dedent-js'
import { describe, it } from 'mocha'
import { NodeRange } from '../../../nodes'
import { VanillaConfig } from '../../../types/Config'
import { Uri } from '../../../types/handlers'
import { Token, TokenType } from '../../../types/Token'
import { onDidChangeTextDocument } from '../../../utils/handlers/onDidChangeTextDocument'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onDidChangeTextDocument() Tests', () => {
    const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: NaN }
    const config = VanillaConfig
    const version = 1
    const uri = Uri.parse('file:///c:/foo')
    it('Should handle with full update', async () => {
        const info = mockFunctionInfo({
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
            ],
            content: dedent`
            # Test 0
            # Test 1
            # Test 2`
        })
        const contentChanges = [{ text: '# Modified' }]

        await onDidChangeTextDocument({ uri, info, version, cacheFile, config, contentChanges })

        assert(info.document.getText() === '# Modified')
        assert(info.document.version === version)
        assert.deepStrictEqual(info.nodes, [{
            [NodeRange]: { start: 0, end: 10 },
            args: [{ data: '# Modified', parser: 'string' }],
            tokens: [],
            hint: { fix: [], options: [] },
            completions: undefined
        }])
    })
})
