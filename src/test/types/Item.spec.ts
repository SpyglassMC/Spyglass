import assert = require('power-assert')
import { constructConfig, VanillaConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import { ToFormattedString } from '../../types/Formattable'
import Identity from '../../types/Identity'
import Item from '../../types/Item'
import Vector from '../../types/Vector'
import { getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'

describe('Item Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return item ID only', () => {
            const { lint } = VanillaConfig
            const item = new Item(
                new Identity('minecraft', ['diamond_sword'])
            )
            const actual = item[ToFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword')
        })
        it('Should return item ID and nbt compound tag', () => {
            const { lint } =VanillaConfig
            const item = new Item(
                new Identity('minecraft', ['diamond_sword']),
                getNbtCompoundTag({ foo: getNbtStringTag('test') })
            )
            const actual = item[ToFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword{foo: "test"}')
        })
    })
})
