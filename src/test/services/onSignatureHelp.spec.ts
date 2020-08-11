import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onSignatureHelp } from '../../services/onSignatureHelp'
import { Uri } from '../../types'
import { mockCommand, mockParsingContext } from '../utils.spec'

describe('onSignatureHelp() Tests', () => {
    const roots: Uri[] = []
    const uri = Uri.parse('file:///c:/foo')
    it('Should return signatures', async () => {
        const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: 0 }
        const offset = 12
        const ctx = mockParsingContext({
            content: 'advancement '
        })
        const node = mockCommand({
            range: { start: 0, end: 12 }
        })
        const service = new DatapackLanguageService({ roots, cacheFile })

        const signatures = await onSignatureHelp({ uri, textDoc: ctx.textDoc, service, offset, node })

        assert.deepStrictEqual(signatures, {
            signatures: [{
                label: 'advancement grant|revoke <targets: entity>',
                parameters: [
                    { label: [0, 11] },
                    { label: [12, 24] },
                    { label: [25, 42] }
                ]
            }],
            activeParameter: 1,
            activeSignature: 0
        })
    })
    it('Should return signatures when there are no options', async () => {
        const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: 0 }
        const offset = 4
        const ctx = mockParsingContext({
            content: 'say '
        })
        const node = mockCommand({
            range: { start: 0, end: 4 }
        })
        const service = new DatapackLanguageService({ roots, cacheFile })

        const signatures = await onSignatureHelp({ service, uri, textDoc: ctx.textDoc, offset, node })

        assert.deepStrictEqual(signatures, {
            signatures: [{
                label: 'say <message: message> ',
                parameters: [
                    { label: [0, 3] },
                    { label: [4, 22] },
                    { label: [23, 23] }
                ]
            }],
            activeParameter: 1,
            activeSignature: 0
        })
    })
})
