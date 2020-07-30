import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onCompletion } from '../../services/onCompletion'
import { Uri, VanillaConfig } from '../../types'
import { mockLineNode, mockParsingContext } from '../utils.spec'

describe('onCompletion() Tests', () => {
    const uri = Uri.parse('file:///c:/foo')
    it('Should return completions', async () => {
        const offset = 12
        const node = mockLineNode({
            range: { start: 0, end: 12 }
        })
        const { textDoc } = mockParsingContext({
            content: 'advancement '
        })
        const config = VanillaConfig
        const service = new DatapackLanguageService()

        const completions = await onCompletion({ service, uri, textDoc, node, config, offset })

        assert.deepStrictEqual(completions, [
            { label: 'grant', textEdit: { range: { start: { line: 0, character: 12 }, end: { line: 0, character: 12 } }, newText: 'grant' } },
            { label: 'revoke', textEdit: { range: { start: { line: 0, character: 12 }, end: { line: 0, character: 12 } }, newText: 'revoke' } }
        ])
    })
})
