import assert = require('power-assert')
import { constructConfig } from '../../../types/Config'
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../../types/Formattable'
import IdentityNode from '../../../types/nodes/IdentityNode'
import ItemNode from '../../../types/nodes/ItemNode'
import NbtCompoundNode from '../../../types/nodes/map/NbtCompoundNode'
import { $ } from '../../utils'
import NbtStringNode from '../../../types/nodes/nbt/NbtStringNode'
import { UnsortedKeys } from '../../../types/nodes/map/MapNode'

describe('ItemNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        const { lint } = constructConfig({
            lint: {
                nbtCompoundBracketSpacing: { inside: 0 },
                nbtCompoundColonSpacing: { before: 0, after: 1 },
                nbtCompoundCommaSpacing: { before: 0, after: 1 },
                nbtCompoundTrailingComma: false
            }
        })
        it('Should return item ID only', () => {
            const item = new ItemNode(
                new IdentityNode('minecraft', ['diamond_sword'])
            )
            const actual = item[GetFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword')
        })
        it('Should return item ID and nbt compound tag', () => {
            const item = new ItemNode(
                new IdentityNode('minecraft', ['diamond_sword']),
                $(new NbtCompoundNode(null), {
                    foo: new NbtStringNode(null, 'test', '"test"', []),
                    [UnsortedKeys]: ['foo']
                })
            )
            const actual = item[GetFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword{foo: "test"}')
        })
    })
})
