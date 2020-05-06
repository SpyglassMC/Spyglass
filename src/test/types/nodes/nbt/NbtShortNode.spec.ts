import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import { GetFormattedString } from '../../../../types/Formattable'
import { NbtShortNode } from '../../../../types/nodes/NbtShortNode'

describe('NbtShortNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return with lower-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtShortSuffix: 's' } })
            const node = new NbtShortNode(null, 0, '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0s')
        })
        it('Should return with upper-cased suffix', () => {
            const { lint } = constructConfig({ lint: { nbtShortSuffix: 'S' } })
            const node = new NbtShortNode(null, 0, '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0S')
        })
    })
})
