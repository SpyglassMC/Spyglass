import assert = require('power-assert')
import { describe, it } from 'mocha'
import { GetFormattedString } from '../../../types/Formattable'
import { NumberNode } from '../../../types/nodes/NumberNode'
import { NumberRangeNode } from '../../../types/nodes/NumberRangeNode'

describe('NumberRangeNode Tests', () => {
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly when min === max', () => {
            const range = new NumberRangeNode('integer', new NumberNode(1, '1'), new NumberNode(1, '1'))
            const actual = range[GetFormattedString]({} as any)
            assert(actual === '1')
        })
        it('Should return correctly when min is undefined', () => {
            const range = new NumberRangeNode('integer', undefined, new NumberNode(2, '2'))
            const actual = range[GetFormattedString]({} as any)
            assert(actual === '..2')
        })
        it('Should return correctly when max is undefined', () => {
            const range = new NumberRangeNode('integer', new NumberNode(1, '1'), undefined)
            const actual = range[GetFormattedString]({} as any)
            assert(actual === '1..')
        })
        it('Should return correctly when both min and max exist', () => {
            const range = new NumberRangeNode('integer', new NumberNode(1, '1'), new NumberNode(2, '2'))
            const actual = range[GetFormattedString]({} as any)
            assert(actual === '1..2')
        })
    })
})
