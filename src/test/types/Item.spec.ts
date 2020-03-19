import assert = require('power-assert')
import { constructConfig, VanillaConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToFormattedString } from '../../types/Formattable'
import IdentityNode from '../../types/nodes/IdentityNode'
import ItemNode from '../../types/nodes/ItemNode'

describe('Item Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return item ID only', () => {
            const { lint } = VanillaConfig
            const item = new ItemNode(
                new IdentityNode('minecraft', ['diamond_sword'])
            )
            const actual = item[ToFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword')
        })
        it('Should return item ID and nbt compound tag', () => {
            const { lint } =VanillaConfig
            const item = new ItemNode(
                new IdentityNode('minecraft', ['diamond_sword']),
                getNbtCompoundTag({ foo: getNbtStringTag('test') })
            )
            const actual = item[ToFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword{foo: "test"}')
        })
    })
})
