import assert = require('power-assert')
import { constructConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../../types/Formattable'
import IdentityNode from '../../../types/nodes/IdentityNode'
import BlockNode from '../../../types/nodes/BlockNode'
import BlockStateNode from '../../../types/nodes/map/BlockStateMapNode'
import { $ } from '../../utils'
import NbtCompoundNode from '../../../types/nodes/map/NbtCompoundNode'
import NbtStringNode from '../../../types/nodes/nbt/NbtStringNode'

describe('BlockNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return block ID only', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone'])
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone')
        })
        it('Should return block ID and block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                $(new BlockStateNode(), {
                    snowy: 'true'
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone[snowy=true]')
        })
        it('Should return block ID and nbt compound tag', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                undefined,
                $(new NbtCompoundNode(null), {
                    Lock: new NbtStringNode(null, 'test', '"test"', [])
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone{Lock: "test"}')
        })
        it('Should return block ID, block states and nbt compound tag', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                $(new BlockStateNode(), {
                    snowy: 'true', age: '7'
                }),
                $(new NbtCompoundNode(null), {
                    Lock: new NbtStringNode(null, 'test', '"test"', [])
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone[snowy=true,age=7]{Lock: "test"}')
        })
        it('Should append spaces after the comma in block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: true,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: false
                }
            })
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                $(new BlockStateNode(), {
                    snowy: 'true', age: '7'
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone[snowy=true, age=7]')
        })
        it('Should put spaces around the equal sign in block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: true,
                    blockStateSortKeys: false
                }
            })
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                $(new BlockStateNode(), {
                    snowy: 'true', age: '7'
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone[snowy = true,age = 7]')
        })
        it('Should sort keys in block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateAppendSpaceAfterComma: false,
                    blockStatePutSpacesAroundEqualSign: false,
                    blockStateSortKeys: true
                }
            })
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                $(new BlockStateNode(), {
                    snowy: 'true', age: '7'
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone[age=7,snowy=true]')
        })
    })
})
