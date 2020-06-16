import assert = require('power-assert')
import { describe, it } from 'mocha'
import { NbtIntNode } from '../../../../nodes/NbtIntNode'
import { constructConfig } from '../../../../types/Config'
import { GetFormattedString } from '../../../../types/Formattable'

describe('NbtIntNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const node = new NbtIntNode(null, 0, '0')

            const actual = node[GetFormattedString](lint)

            assert(actual === '0')
        })
    })
})
