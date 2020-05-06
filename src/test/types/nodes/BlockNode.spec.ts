import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'
import { BlockNode } from '../../../types/nodes/BlockNode'
import { BlockStateNode } from '../../../types/nodes/BlockStateNode'
import { IdentityNode } from '../../../types/nodes/IdentityNode'
import { UnsortedKeys } from '../../../types/nodes/MapNode'
import { NbtCompoundNode } from '../../../types/nodes/NbtCompoundNode'
import { NbtStringNode } from '../../../types/nodes/NbtStringNode'
import { $ } from '../../utils.spec'

describe('BlockNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        const { lint } = constructConfig({
            lint: {
                blockStateBracketSpacing: { inside: 0 },
                blockStateCommaSpacing: { before: 0, after: 1 },
                blockStateEqualSpacing: { before: 0, after: 0 },
                blockStateTrailingComma: false,
                nbtCompoundBracketSpacing: { inside: 0 },
                nbtCompoundColonSpacing: { before: 0, after: 1 },
                nbtCompoundCommaSpacing: { before: 0, after: 1 },
                nbtCompoundTrailingComma: false
            }
        })
        it('Should return block ID only', () => {
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone'])
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone')
        })
        it('Should return block ID and block states', () => {
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                $(new BlockStateNode(), {
                    snowy: 'true',
                    [UnsortedKeys]: ['snowy']
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone[snowy=true]')
        })
        it('Should return block ID and nbt compound tag', () => {
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                undefined,
                $(new NbtCompoundNode(null), {
                    Lock: new NbtStringNode(null, 'test', '"test"', {}),
                    [UnsortedKeys]: ['Lock']
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone{Lock: "test"}')
        })
        it('Should return block ID, block states, and nbt compound tag', () => {
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                $(new BlockStateNode(), {
                    snowy: 'true', age: '7',
                    [UnsortedKeys]: ['snowy', 'age']
                }),
                $(new NbtCompoundNode(null), {
                    Lock: new NbtStringNode(null, 'test', '"test"', {}),
                    [UnsortedKeys]: ['Lock']
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone[snowy=true, age=7]{Lock: "test"}')
        })
        it('Should put spaces around the equal sign in block states', () => {
            const { lint } = constructConfig({
                lint: {
                    blockStateBracketSpacing: { inside: 0 },
                    blockStateCommaSpacing: { before: 0, after: 1 },
                    blockStateEqualSpacing: { before: 1, after: 1 },
                    blockStateTrailingComma: false
                }
            })
            const block = new BlockNode(
                new IdentityNode('minecraft', ['stone']),
                $(new BlockStateNode(), {
                    snowy: 'true', age: '7',
                    [UnsortedKeys]: ['snowy', 'age']
                })
            )
            const actual = block[GetFormattedString](lint)
            assert(actual === 'minecraft:stone[snowy = true, age = 7]')
        })
    })
})
