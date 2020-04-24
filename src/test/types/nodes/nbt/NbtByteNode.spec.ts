import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import NbtByteNode from '../../../../types/nodes/nbt/NbtByteNode'
import { GetFormattedString } from '../../../../types/Formattable'

describe('NbtByteNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return with lower-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtByteSuffix: 'b' } })
            const node = new NbtByteNode(null, 0, '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0b')
        })
        it('Should return with upper-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtByteSuffix: 'B' } })
            const node = new NbtByteNode(null, 0, '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0B')
        })
        it('Should return true', () => {
            const { lint } = constructConfig({ lint: { nbtByteSuffix: 'b' } })
            const node = new NbtByteNode(null, 1, 'True')

            const actual = node[GetFormattedString](lint)

            assert(actual === 'true')
        })
        it('Should return true', () => {
            const { lint } = constructConfig({ lint: { nbtByteSuffix: 'b' } })
            const node = new NbtByteNode(null, 0, 'False')

            const actual = node[GetFormattedString](lint)

            assert(actual === 'false')
        })
    })
})
