import assert = require('power-assert')
import { describe, it } from 'mocha'
import VectorNode, { VectorElementNode, VectorElementType } from '../../types/nodes/VectorNode'
import { GetFormattedString } from '../../types/Formattable'
import { $ } from '../utils'

describe('Vector Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly', () => {
            const vector = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Local, 0, ''),
                1: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                2: new VectorElementNode(VectorElementType.Absolute, -0.5, '-.5'),
            })
            const actual = vector[GetFormattedString]()
            assert(actual === '^ ~1 -.5')
        })
    })
})
