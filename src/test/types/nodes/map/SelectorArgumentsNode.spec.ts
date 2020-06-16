import assert = require('power-assert')
import { GetCodeActions } from '../../../../nodes/ArgumentNode'
import { UnsortedKeys } from '../../../../nodes/MapNode'
import { SelectorArgumentsNode } from '../../../../nodes/SelectorArgumentsNode'
import { constructConfig } from '../../../../types/Config'
import { ErrorCode } from '../../../../types/ParsingError'
import { getCodeAction } from '../../../../utils'
import { $, mockFunctionInfo } from '../../../utils.spec'

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
        const info = mockFunctionInfo({ config })
        const diags: any = [{ message: 'A diagnostic message' }]
        it('Should return empty actions', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {}
            const node = $(new SelectorArgumentsNode(), [0, 7], {
                tag: ['foo'],
                tagNeg: ['bar', 'baz'],
                [UnsortedKeys]: ['tagNeg', 'tag', 'tagNeg']
            })
            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [])
        })
        it('Should return sort actions', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {
                [ErrorCode.SelectorSortKeys]: diags
            }
            const node = $(new SelectorArgumentsNode(), [0, 7], {
                tag: ['foo'],
                tagNeg: ['bar', 'baz'],
                [UnsortedKeys]: ['tagNeg', 'tag', 'tagNeg']
            })
            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'selector-sort-keys', diags, info.document, { start: 0, end: 7 },
                '[tag=foo, tag=!bar, tag=!baz]'
            )])
        })
    })
})
