import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import NbtListNode from '../../../../types/nodes/nbt/NbtListNode'
import { GetFormattedString } from '../../../../types/Formattable'
import NbtLongNode from '../../../../types/nodes/nbt/NbtLongNode'

describe('NbtListNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        const { lint } = constructConfig({
            lint: {
                nbtListBracketSpacing: { inside: 0 },
                nbtListCommaSpacing: { before: 0, after: 1 },
                nbtListTrailingComma: false
            }
        })
        it('Should return correctly for empty collection', () => {
            const node = new NbtListNode(null)

            const actual = node[GetFormattedString](lint)

            assert(actual === '[]')
        })
        it('Should return correctly for single element', () => {
            const node = new NbtListNode(null)

            node.push(new NbtLongNode(null, BigInt(0), '0'))

            const actual = node[GetFormattedString](lint)

            assert(actual === '[0L]')
        })
        it('Should return correctly for multiple elements', () => {
            const node = new NbtListNode(null)

            node.push(new NbtLongNode(null, BigInt(0), '0'))
            node.push(new NbtLongNode(null, BigInt(1), '1'))
            node.push(new NbtLongNode(null, BigInt(2), '2'))

            const actual = node[GetFormattedString](lint)

            assert(actual === '[0L, 1L, 2L]')
        })
    })
})
