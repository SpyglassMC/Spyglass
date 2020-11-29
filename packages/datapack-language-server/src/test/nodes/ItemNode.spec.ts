import assert = require('power-assert')
import { describe, it } from 'mocha'
import { IdentityNode } from '../../nodes/IdentityNode'
import { ItemNode } from '../../nodes/ItemNode'
import { UnsortedKeys } from '../../nodes/MapNode'
import { NbtCompoundNode } from '../../nodes/NbtCompoundNode'
import { NbtStringNode } from '../../nodes/NbtStringNode'
import { constructConfig } from '../../types/Config'
import { GetFormattedString } from '../../types/Formattable'
import { $ } from '../utils.spec'

describe('ItemNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
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
                    foo: new NbtStringNode(null, 'test', '"test"', {}),
                    [UnsortedKeys]: ['foo']
                })
            )
            const actual = item[GetFormattedString](lint)
            assert(actual === 'minecraft:diamond_sword{foo: "test"}')
        })
    })
})
