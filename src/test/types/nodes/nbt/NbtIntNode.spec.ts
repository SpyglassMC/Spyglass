import assert = require('power-assert')
import { describe, it } from 'mocha'
import { constructConfig } from '../../../../types/Config'
import NbtIntNode from '../../../../types/nodes/nbt/NbtIntNode'
import { ToFormattedString } from '../../../../types/Formattable'

describe('NbtIntNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const { lint } = constructConfig({})
            const node = new NbtIntNode(null, 0, '0')

            const actual = node[ToFormattedString](lint)

            assert(actual === '0')
        })
    })
})
