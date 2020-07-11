import assert = require('power-assert')
import { describe, it } from 'mocha'
import { Uri } from '../../../types'
import { onCompletion } from '../../../utils/handlers/onCompletion'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onCompletion() Tests', () => {
    const roots: Uri[] = []
    const uri = Uri.parse('file:///c:/foo')
    it('Should return completions', async () => {
        const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: 0 }
        const offset = 12
        const node = mockLineNode({
            range: { start: 0, end: 12 }
        })
        const info = mockFunctionInfo({
            nodes: [node],
            content: 'advancement '
        })

        const completions = await onCompletion({ roots, uri, info, node, cacheFile, offset })

        assert.deepStrictEqual(completions, [
            { label: 'grant' /* , textEdit: { range: { start: { line: 0, character: 12 }, end: { line: 0, character: 12 } }, newText: 'grant' }  */ },
            { label: 'revoke'/* , textEdit: { range: { start: { line: 0, character: 12 }, end: { line: 0, character: 12 } }, newText: 'revoke' } */ }
        ])
    })
})
