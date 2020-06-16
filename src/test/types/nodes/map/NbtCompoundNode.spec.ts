import assert = require('power-assert')
import { constructConfig } from '../../../../types/Config'
import { GetCodeActions } from '../../../../nodes/ArgumentNode'
import { UnsortedKeys } from '../../../../nodes/MapNode'
import { NbtByteNode } from '../../../../nodes/NbtByteNode'
import { NbtCompoundNode } from '../../../../nodes/NbtCompoundNode'
import { NbtLongNode } from '../../../../nodes/NbtLongNode'
import { ErrorCode } from '../../../../types/ParsingError'
import { getCodeAction } from '../../../../utils'
import { $, mockFunctionInfo } from '../../../utils.spec'

describe('NbtCompoundNode Tests', () => {
    describe('[GetCodeActions]() Tests', () => {
        const config = constructConfig({
            lint: {
                nbtCompoundBracketSpacing: { inside: 0 },
                nbtCompoundColonSpacing: { before: 0, after: 1 },
                nbtCompoundCommaSpacing: { before: 0, after: 1 },
                nbtCompoundTrailingComma: false,
                nbtCompoundSortKeys: ['warning', 'alphabetically']
            }
        })
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const info = mockFunctionInfo({ config })
        const diags: any = [{ message: 'A diagnostic message' }]
        it('Should return empty actions', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {}
            const node = $(new NbtCompoundNode(null), [0, 7], {
                foo: new NbtByteNode(null, 1, '1b'),
                bar: new NbtByteNode(null, 0, '0b'),
                [UnsortedKeys]: ['foo', 'bar']
            })
            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [])
        })
        it('Should return sort actions', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {
                [ErrorCode.NbtCompoundSortKeys]: diags
            }
            const node = $(new NbtCompoundNode(null), [0, 7], {
                foo: new NbtByteNode(null, 1, '1'),
                bar: new NbtByteNode(null, 0, '0'),
                [UnsortedKeys]: ['foo', 'bar']
            })
            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'nbt-compound-sort-keys', diags, info.document, { start: 0, end: 7 },
                '{bar: 0b, foo: 1b}'
            )])
        })
        it('Should return UUID datafix actions for L and M', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {
                [ErrorCode.NbtUuidDatafixCompound]: diags
            }
            const node = $(new NbtCompoundNode(null), [0, 7], {
                M: new NbtLongNode(null, BigInt(1234567890123), '1234567890123L'),
                L: new NbtLongNode(null, BigInt(4567890123456), '4567890123456L'),
                [UnsortedKeys]: ['M', 'L']
            })
            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'nbt-uuid-datafix', diags, info.document, { start: 0, end: 7 },
                '[I; 287, 1912276171, 1063, -1955079488]'
            )])
        })
        it('Should return UUID datafix actions for OwnerUUIDLeast and OwnerUUIDMost', () => {
            const range = { start: 3, end: 3 }
            const diagnostics = {
                [ErrorCode.NbtUuidDatafixCompound]: diags
            }
            const node = $(new NbtCompoundNode(null), [0, 7], {
                OwnerUUIDMost: new NbtLongNode(null, BigInt(1234567890123), '1234567890123L'),
                OwnerUUIDLeast: new NbtLongNode(null, BigInt(4567890123456), '4567890123456L'),
                [UnsortedKeys]: ['OwnerUUIDMost', 'OwnerUUIDLeast']
            })
            const actual = node[GetCodeActions](uri, info, range, diagnostics)
            assert.deepStrictEqual(actual, [getCodeAction(
                'nbt-uuid-datafix', diags, info.document, { start: 0, end: 7 },
                '[I; 287, 1912276171, 1063, -1955079488]'
            )])
        })
    })
})
