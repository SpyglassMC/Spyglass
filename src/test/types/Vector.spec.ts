import assert = require('power-assert')
import { describe, it } from 'mocha'
import VectorNode from '../../types/nodes/VectorNode'
import { ToFormattedString } from '../../types/Formattable'
import { $ } from '../utils'

describe('Vector Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const vector = $(new VectorNode(), {
                length: 3,
                0: { value: '', type: 'local' },
                1: { value: '1', type: 'relative' },
                2: { value: '-.5', type: 'absolute' }
            })
            const actual = vector[ToFormattedString]({} as any)
            assert(actual === '^ ~1 -.5')
        })
    })
})
