import assert = require('power-assert')
import { describe, it } from 'mocha'
import { GetCodeActions } from '../../../nodes/ArgumentNode'
import { NbtByteNode } from '../../../nodes/NbtByteNode'
import { constructConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'
import { ErrorCode } from '../../../types/ParsingError'
import { getCodeAction } from '../../../utils'
import { $, mockFunctionInfo } from '../../utils.spec'

describe('NbtByteNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return with lower-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtByteSuffix: 'b' } })
            const node = new NbtByteNode(null, 0, '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0b')
        })
        it('Should return with upper-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtByteSuffix: 'B' } })
            const node = new NbtByteNode(null, 0, '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0B')
        })
        it('Should return true', () => {
            const { lint } = constructConfig({ lint: { nbtByteSuffix: 'b' } })
            const node = new NbtByteNode(null, 1, 'True')

            const actual = node[GetFormattedString](lint)

            assert(actual === 'true')
        })
        it('Should return true', () => {
            const { lint } = constructConfig({ lint: { nbtByteSuffix: 'b' } })
            const node = new NbtByteNode(null, 0, 'False')

            const actual = node[GetFormattedString](lint)

            assert(actual === 'false')
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const info = mockFunctionInfo()
        const diags: any[] = [{ message: 'A diagnostic message' }]
        it('Should convert it to short', () => {
            const diagnostics = {
                [ErrorCode.NbtTypeToShort]: diags
            }
            const node = $(new NbtByteNode(null, 17, '17'), [0, 3])

            const actual = node[GetCodeActions](uri, info, { start: 1, end: 1 }, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'nbt-type-to-short', diags, info.document, { start: 0, end: 3 },
                '17s'
            )])
        })
    })
})
