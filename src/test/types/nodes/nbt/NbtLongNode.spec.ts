import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import { GetFormattedString } from '../../../../types/Formattable'
import { NbtLongNode } from '../../../../types/nodes/NbtLongNode'

describe('NbtLongNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return with lower-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtLongSuffix: 'l' } })
            const node = new NbtLongNode(null, BigInt(0), '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0l')
        })
        it('Should return with upper-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtLongSuffix: 'L' } })
            const node = new NbtLongNode(null, BigInt(0), '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0L')
        })
    })
})
