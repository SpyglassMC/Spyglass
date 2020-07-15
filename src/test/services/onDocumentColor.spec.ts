import assert = require('power-assert')
import { describe, it } from 'mocha'
import { onDocumentColor } from '../../services/onDocumentColor'
import { mockFunctionInfo, mockLineNode } from '../utils.spec'

describe('onDocumentColor() Tests', () => {
    const info = mockFunctionInfo({
        nodes: [
            mockLineNode({
                cache: {
                    color: {
                        '1 1 1 1': {
                            def: [],
                            ref: [{ start: 9, end: 21 }]
                        }
                    }
                }
            })
        ],
        content: 'particle dust 1 1 1 1'
    })
    it('Should return correctly', () => {
        const colors = onDocumentColor({ info })

        assert.deepStrictEqual(colors, [
            {
                range: {
                    start: { line: 0, character: 9 },
                    end: { line: 0, character: 21 }
                },
                color: { red: 1, green: 1, blue: 1, alpha: 1 }
            }
        ])
    })
})
