import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import NbtDoubleNode from '../../../../types/nodes/nbt/NbtDoubleNode'
import { GetFormattedString } from '../../../../types/Formattable'

describe('NbtDoubleNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return with lower-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtDoubleSuffix: 'd' } })
            const node = new NbtDoubleNode(null, 0.1, '0.10')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0.10d')
        })
        it('Should return with upper-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtDoubleSuffix: 'D' } })
            const node = new NbtDoubleNode(null, 0.1, '0.10')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0.10D')
        })
    })
})
