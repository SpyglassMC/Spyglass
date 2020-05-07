import assert = require('power-assert')
import { constructConfig } from '../../../../types/Config'
import { GetFormattedString } from '../../../../types/Formattable'
import { FunctionInfo } from '../../../../types/FunctionInfo'
import { GetCodeActions } from '../../../../nodes/ArgumentNode'
import { BlockStateNode } from '../../../../nodes/BlockStateNode'
import { UnsortedKeys } from '../../../../nodes/MapNode'
import { ErrorCode } from '../../../../types/ParsingError'
import { getCodeAction } from '../../../../utils'
import { $ } from '../../../utils.spec'

describe('BlockStateNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should use the zeroValue option in bracket spacing', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateBracketSpacing: { inside: 2, oneValue: 1, zeroValue: 0 },
                    blockStateCommaSpacing: { before: 0, after: 1 },
                    blockStateEqualSpacing: { before: 0, after: 0 },
                    blockStateTrailingComma: false
                }
            })
            const node = $(new BlockStateNode(), {})
            const actual = node[GetFormattedString](lint)
            assert(actual === '[]')
        })
        it('Should use the oneValue option in bracket spacing', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateBracketSpacing: { inside: 2, oneValue: 1, zeroValue: 0 },
                    blockStateCommaSpacing: { before: 0, after: 1 },
                    blockStateEqualSpacing: { before: 0, after: 0 },
                    blockStateTrailingComma: false
                }
            })
            const node = $(new BlockStateNode(), {
                age: '7',
                [UnsortedKeys]: ['age']
            })
            const actual = node[GetFormattedString](lint)
            assert(actual === '[ age=7 ]')
        })
        it('Should contain the trailing comma', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateBracketSpacing: { inside: 0 },
                    blockStateCommaSpacing: { before: 0, after: 1 },
                    blockStateEqualSpacing: { before: 0, after: 0 },
                    blockStateTrailingComma: true
                }
            })
            const node = $(new BlockStateNode(), {
                age: '7',
                [UnsortedKeys]: ['age']
            })
            const actual = node[GetFormattedString](lint)
            assert(actual === '[age=7,]')
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const config = constructConfig({
            lint: {
                blockStateBracketSpacing: { inside: 0 },
                blockStateCommaSpacing: { before: 0, after: 1 },
                blockStateEqualSpacing: { before: 0, after: 0 },
                blockStateTrailingComma: false,
                blockStateSortKeys: ['warning', 'alphabetically']
            }
        })
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const lineNumber = 10
        const info: FunctionInfo = { config, lineBreak: '\n', lines: [], strings: [], version: null }
        const diags: any = [{ message: 'A diagnostic message' }]
        it('Should return empty actions', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {}
            const node = $(new BlockStateNode(), [0, 7], {
                foo: 'bar',
                baz: 'qux',
                [UnsortedKeys]: ['foo', 'baz']
            })
            const actual = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)
            assert.deepStrictEqual(actual, [])
        })
        it('Should return sort actions', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {
                [ErrorCode.BlockStateSortKeys]: diags
            }
            const node = $(new BlockStateNode(), [0, 7], {
                foo: 'bar',
                baz: 'qux',
                [UnsortedKeys]: ['foo', 'baz']
            })
            const actual = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'block-state-sort-keys', diags, uri, info.version, lineNumber, { start: 0, end: 7 },
                '[baz=qux, foo=bar]'
            )])
        })
    })
})
