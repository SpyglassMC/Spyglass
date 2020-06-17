import assert = require('power-assert')
import { describe, it } from 'mocha'
import { onCompletion } from '../../../utils/handlers/onCompletion'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onCompletion() Tests', () => {
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

        const completions = await onCompletion({ info, node, cacheFile, offset })

        assert.deepStrictEqual(completions, [
            { label: 'grant' },
            { label: 'revoke' }
        ])
    })
})
