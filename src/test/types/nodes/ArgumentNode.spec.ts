import assert = require('power-assert')
import { describe, it } from 'mocha'
import { ArgumentNode, GetCodeActions, GetHoverInformation, NodeDescription, NodeType } from '../../../nodes/ArgumentNode'
import { GetFormattedString } from '../../../types/Formattable'
import { $, mockFunctionInfo } from '../../utils.spec'

class TestArgumentNode extends ArgumentNode {
    readonly [NodeType] = 'Test'
}

describe('ArgumentNode Tests', () => {
    const info = mockFunctionInfo()
    describe('[GetFormattedString]() Tests', () => {
        it('Should return the same value as toString()', () => {
            const node = new TestArgumentNode()

            const actual = node[GetFormattedString]()

            assert(actual === node.toString())
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        it('Should return empty code actions', () => {
            const range = { start: 0, end: 7 }
            const diagnostics = {}
            const node = new TestArgumentNode()

            const actual = node[GetCodeActions](uri, info, range, diagnostics)

            assert.deepStrictEqual(actual, [])
        })
    })
    describe('[GetHoverInformation]() Tests', () => {
        const offset = 42
        it('Should return null when there is no description', () => {
            const node = new TestArgumentNode()

            const actual = node[GetHoverInformation](info.document, offset)

            assert(actual === null)
        })
        it('Should return hover when there is description', () => {
            const node = $(new TestArgumentNode(), [38, 45])
            node[NodeDescription] = 'This is the description for the TestArgumentNode'

            const actual = node[GetHoverInformation](info.document, offset)

            assert.deepStrictEqual(actual, {
                contents: { kind: 'markdown', value: 'This is the description for the TestArgumentNode' },
                range: {
                    start: { line: 10, character: 38 },
                    end: { line: 10, character: 45 }
                }
            })
        })
    })
})
