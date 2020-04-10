import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import NbtFloatNode from '../../../../types/nodes/nbt/NbtFloatNode'
import { ToFormattedString } from '../../../../types/Formattable'

describe('NbtFloatNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return with lower-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtFloatSuffix: 'f' } })
            const node = new NbtFloatNode(null, 1, '1.00')

            const actual = node[ToFormattedString](lint)

            assert(actual === '1.00f')
        })
        it('Should return with upper-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtFloatSuffix: 'F' } })
            const node = new NbtFloatNode(null, 1, '1.00')

            const actual = node[ToFormattedString](lint)

            assert(actual === '1.00F')
        })
    })
})
