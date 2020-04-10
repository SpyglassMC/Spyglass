import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import NbtByteArrayNode from '../../../../types/nodes/nbt/NbtByteArrayNode'
import { ToFormattedString } from '../../../../types/Formattable'
import NbtByteNode from '../../../../types/nodes/nbt/NbtByteNode'

describe('NbtByteArrayNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        const { lint } = constructConfig({
            lint: {
                nbtArrayBracketSpacing: { inside: 0 },
                nbtArrayCommaSpacing: { before: 0, after: 1 },
                nbtArraySemicolonSpacing: { after: 1 },
                nbtArrayTrailingComma: false
            }
        })
        it('Should return correctly for empty collection', () => {
            const node = new NbtByteArrayNode(null)

            const actual = node[ToFormattedString](lint)

            assert(actual === '[B;]')
        })
        it('Should return correctly for single element', () => {
            const node = new NbtByteArrayNode(null)

            node.push(new NbtByteNode(null, 0, '0'))

            const actual = node[ToFormattedString](lint)

            assert(actual === '[B; 0b]')
        })
        it('Should return correctly for multiple elements', () => {
            const node = new NbtByteArrayNode(null)

            node.push(new NbtByteNode(null, 0, '0'))
            node.push(new NbtByteNode(null, 1, '1'))
            node.push(new NbtByteNode(null, 2, '2'))

            const actual = node[ToFormattedString](lint)

            assert(actual === '[B; 0b, 1b, 2b]')
        })
    })
})
