import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import { GetFormattedString } from '../../../../types/Formattable'
import { NbtIntArrayNode } from '../../../../nodes/NbtIntArrayNode'
import { NbtIntNode } from '../../../../nodes/NbtIntNode'

describe('NbtIntArrayNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        const { lint } = constructConfig({
            lint: {
                nbtArrayBracketSpacing: { inside: 0 },
                nbtArrayCommaSpacing: { before: 0, after: 1 },
                nbtArraySemicolonSpacing: { after: 1 },
                nbtArrayTrailingComma: false
            }
        })
        it('Should return correctly for empty collection', () => {
            const node = new NbtIntArrayNode(null)

            const actual = node[GetFormattedString](lint)

            assert(actual === '[I;]')
        })
        it('Should return correctly for single element', () => {
            const node = new NbtIntArrayNode(null)

            node.push(new NbtIntNode(null, 0, '0'))

            const actual = node[GetFormattedString](lint)

            assert(actual === '[I; 0]')
        })
        it('Should return correctly for multiple elements', () => {
            const node = new NbtIntArrayNode(null)

            node.push(new NbtIntNode(null, 0, '0'))
            node.push(new NbtIntNode(null, 1, '1'))
            node.push(new NbtIntNode(null, 2, '2'))

            const actual = node[GetFormattedString](lint)

            assert(actual === '[I; 0, 1, 2]')
        })
    })
})
