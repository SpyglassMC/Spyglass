import assert = require('power-assert')
import { constructConfig, VanillaConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../types/Formattable'
import IdentityNode from '../../types/nodes/IdentityNode'
import ItemNode from '../../types/nodes/ItemNode'
import NbtCompoundNode from '../../types/nodes/map/NbtCompoundNode'
import { $ } from '../utils'
import NbtStringNode from '../../types/nodes/nbt/NbtStringNode'

describe('Item Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return item ID only', () => {
            const { lint } = VanillaConfig
            const item = new ItemNode(
                new IdentityNode('minecraft', ['diamond_sword'])
            )
            const actual = item[GetFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword')
        })
        it('Should return item ID and nbt compound tag', () => {
            const { lint } = VanillaConfig
            const item = new ItemNode(
                new IdentityNode('minecraft', ['diamond_sword']),
                $(new NbtCompoundNode(null), {
                    foo: new NbtStringNode(null, 'test', '"test"', [1, 2, 3, 4])
                })
            )
            const actual = item[GetFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword{foo: "test"}')
        })
    })
})
