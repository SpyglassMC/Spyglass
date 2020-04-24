import assert = require('power-assert')
import { constructConfig } from '../../../../types/Config'
import FunctionInfo from '../../../../types/FunctionInfo'
import { GetCodeActions } from '../../../../types/nodes/ArgumentNode'
import { UnsortedKeys } from '../../../../types/nodes/map/MapNode'
import SelectorArgumentsNode from '../../../../types/nodes/map/SelectorArgumentsNode'
import { ActionCode } from '../../../../types/ParsingError'
import { getCodeAction } from '../../../../utils/utils'
import { $ } from '../../../utils.spec'

describe('SelectorArgumentsNode Tests', () => {
    describe('[GetCodeActions]() Tests', () => {
        const config = constructConfig({
            lint: {
                selectorBracketSpacing: { inside: 0 },
                selectorCommaSpacing: { before: 0, after: 1 },
                selectorEqualSpacing: { before: 0, after: 0 },
                selectorTrailingComma: false,
                selectorSortKeys: ['information', ['tag', 'tagNeg']]
            }
        })
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const lineNumber = 10
        const info: FunctionInfo = { config, lineBreak: '\n', lines: [], strings: [], version: null }
        const diags: any = [{ message: 'A diagnostic message' }]
        it('Should return empty actions', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {}
            const node = $(new SelectorArgumentsNode(), [0, 7], {
                tag: ['foo'],
                tagNeg: ['bar', 'baz'],
                [UnsortedKeys]: ['tagNeg', 'tag', 'tagNeg']
            })
            const actual = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)
            assert.deepStrictEqual(actual, [])
        })
        it('Should return sort actions', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {
                [ActionCode.SelectorSortKeys]: diags
            }
            const node = $(new SelectorArgumentsNode(), [0, 7], {
                tag: ['foo'],
                tagNeg: ['bar', 'baz'],
                [UnsortedKeys]: ['tagNeg', 'tag', 'tagNeg']
            })
            const actual = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'selector-sort-keys', diags, uri, info.version, lineNumber, { start: 0, end: 7 },
                '[tag=foo, tag=!bar, tag=!baz]'
            )])
        })
    })
})
