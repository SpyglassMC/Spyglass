import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onCompletion } from '../../services/onCompletion'
import { Uri } from '../../types'
import { mockCommand, mockLanguageConfigs, mockParsingContext } from '../utils.spec'

describe('onCompletion() Tests', () => {
    const uri = Uri.parse('file:///c:/foo')
    it('Should return completions', async () => {
        const offset = 12
        const node = mockCommand({
            range: { start: 0, end: 12 }
        })
        const { textDoc } = mockParsingContext({
            content: 'advancement '
        })
        const service = new DatapackLanguageService()
        const languageConfigs = await mockLanguageConfigs()

        const completions = await onCompletion({ service, uri, textDoc, node, offset, languageConfigs })

        assert.deepStrictEqual(completions, [
            { label: 'grant', textEdit: { range: { start: { line: 0, character: 12 }, end: { line: 0, character: 12 } }, newText: 'grant' } },
            { label: 'revoke', textEdit: { range: { start: { line: 0, character: 12 }, end: { line: 0, character: 12 } }, newText: 'revoke' } }
        ])
    })
})
