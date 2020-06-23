import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Uri } from '../../../types'
import { onSignatureHelp } from '../../../utils/handlers/onSignatureHelp'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onSignatureHelp() Tests', () => {
    const roots: Uri[] = []
    const uri = Uri.parse('file:///c:/foo')
    it('Should return signatures', async () => {
        const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: 0 }
        const offset = 12
        const info = mockFunctionInfo({
            content: 'advancement '
        })
        const node = mockLineNode({
            range: { start: 0, end: 12 }
        })

        const signatures = await onSignatureHelp({ roots, uri, info, cacheFile, offset, node })

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
        const info = mockFunctionInfo({
            content: 'say '
        })
        const node = mockLineNode({
            range: { start: 0, end: 4 }
        })

        const signatures = await onSignatureHelp({ roots, uri, info, cacheFile, offset, node })

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
