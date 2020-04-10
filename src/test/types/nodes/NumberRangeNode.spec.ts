import assert = require('power-assert')
import { describe, it } from 'mocha'
import NumberRangeNode from '../../../types/nodes/NumberRangeNode'
import { ToFormattedString } from '../../../types/Formattable'

describe('NumberRangeNode Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly when min === max', () => {
            const range = new NumberRangeNode('integer', 1, 1)
            const actual = range[ToFormattedString]({} as any)
            assert(actual === '1')
        })
        it('Should return correctly when min is undefined', () => {
            const range = new NumberRangeNode('integer', undefined, 2)
            const actual = range[ToFormattedString]({} as any)
            assert(actual === '..2')
        })
        it('Should return correctly when max is undefined', () => {
            const range = new NumberRangeNode('integer', 1, undefined)
            const actual = range[ToFormattedString]({} as any)
            assert(actual === '1..')
        })
        it('Should return correctly when both min and max exist', () => {
            const range = new NumberRangeNode('integer', 1, 2)
            const actual = range[ToFormattedString]({} as any)
            assert(actual === '1..2')
        })
    })
})
