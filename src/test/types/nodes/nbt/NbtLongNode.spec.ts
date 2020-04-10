import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import NbtLongNode from '../../../../types/nodes/nbt/NbtLongNode'
import { ToFormattedString } from '../../../../types/Formattable'

describe('NbtLongNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return with lower-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtLongSuffix: 'l' } })
            const node = new NbtLongNode(null, BigInt(0), '0')

            const actual = node[ToFormattedString](lint)

            assert(actual === '0l')
        })
        it('Should return with upper-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtLongSuffix: 'L' } })
            const node = new NbtLongNode(null, BigInt(0), '0')

            const actual = node[ToFormattedString](lint)

            assert(actual === '0L')
        })
    })
})
