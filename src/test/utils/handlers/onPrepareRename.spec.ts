import assert = require('power-assert')
import { describe, it } from 'mocha'
import { onPrepareRename } from '../../../utils/handlers/onPrepareRename'
import { mockFunctionInfo, mockLineNode } from '../../utils.spec'

describe('onPrepareRename() Tests', () => {
    it('Should return the range of the cache stuff', () => {
        const node = mockLineNode({
            cache: {
                entity: {
                    SPGoding: {
                        def: [],
                        ref: [{ start: 0, end: 8 }]
                    }
                }
            }
        })
        const info = mockFunctionInfo({
            nodes: [node]
        })
        const offset = 4

        const range = onPrepareRename({ info, node, offset })

        assert.deepStrictEqual(range, {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 8 }
        })
    })
    it('Should return null for renaming colors', () => {
        const node = mockLineNode({
            cache: {
                color: {
                    '1 1 1 1': {
                        def: [],
                        ref: [{ start: 9, end: 21 }]
                    }
                }
            }
        })
        const info = mockFunctionInfo({
            nodes: [node],
            content: 'particle dust 1 1 1 1'
        })
        const offset = 16

        const range = onPrepareRename({ info, node, offset })

        assert.deepStrictEqual(range, null)
    })
})
