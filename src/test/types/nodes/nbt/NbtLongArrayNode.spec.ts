import assert = require('power-assert')
import { describe, it } from 'mocha'
import { NbtLongArrayNode } from '../../../../nodes/NbtLongArrayNode'
import { NbtLongNode } from '../../../../nodes/NbtLongNode'
import { constructConfig } from '../../../../types/Config'
import { GetFormattedString } from '../../../../types/Formattable'

describe('NbtLongArrayNode Tests', () => {
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
            const node = new NbtLongArrayNode(null)

            const actual = node[GetFormattedString](lint)

            assert(actual === '[L;]')
        })
        it('Should return correctly for single element', () => {
            const node = new NbtLongArrayNode(null)

            node.push(new NbtLongNode(null, BigInt(0), '0'))

            const actual = node[GetFormattedString](lint)

            assert(actual === '[L; 0L]')
        })
        it('Should return correctly for multiple elements', () => {
            const node = new NbtLongArrayNode(null)

            node.push(new NbtLongNode(null, BigInt(0), '0'))
            node.push(new NbtLongNode(null, BigInt(1), '1'))
            node.push(new NbtLongNode(null, BigInt(2), '2'))

            const actual = node[GetFormattedString](lint)

            assert(actual === '[L; 0L, 1L, 2L]')
        })
    })
})
