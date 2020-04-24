import assert = require('power-assert')
import { describe, it } from 'mocha'
import { VanillaConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'
import FunctionInfo from '../../../types/FunctionInfo'
import ArgumentNode, { GetCodeActions, GetHoverInformation, NodeDescription, NodeType } from '../../../types/nodes/ArgumentNode'
import { $ } from '../../utils.spec'

class TestArgumentNode extends ArgumentNode {
    readonly [NodeType] = 'Test'
}

describe('ArgumentNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return the same value as toString()', () => {
            const node = new TestArgumentNode()

            const actual = node[GetFormattedString]()

            assert(actual === node.toString())
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const lineNumber = 10
        const info: FunctionInfo = { config: VanillaConfig, lineBreak: '\n', lines: [], strings: [], version: null }
        it('Should return empty code actions', () => {
            const range = { start: 0, end: 7 }
            const diagnostics = {}
            const node = new TestArgumentNode()

            const actual = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)

            assert.deepStrictEqual(actual, [])
        })
    })
    describe('[GetHoverInformation]() Tests', () => {
        const char = 42
        const lineNumber = 10
        it('Should return null when there is no description', () => {
            const node = new TestArgumentNode()

            const actual = node[GetHoverInformation](lineNumber, char)

            assert(actual === null)
        })
        it('Should return hover when there is description', () => {
            const node = $(new TestArgumentNode(), [38, 45])
            node[NodeDescription] = 'This is the description for the TestArgumentNode'

            const actual = node[GetHoverInformation](lineNumber, char)

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
