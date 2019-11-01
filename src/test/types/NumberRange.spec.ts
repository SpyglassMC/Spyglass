import * as assert from 'power-assert'
import { constructConfig } from '../../types/Config'
import { describe, it } from 'mocha'
import NumberRange from '../../types/NumberRange'
import { ToLintedString } from '../../types/Lintable'

describe('NumberRange Tests', () => {
    describe('[ToLintedString]() Tests', () => {
        it('Should return correctly when min === max', () => {
            const vector = new NumberRange('integer', 1, 1)
            const actual = vector[ToLintedString]({} as any)
            assert(actual === '1')
        })
        it('Should return correctly when min is undefined', () => {
            const vector = new NumberRange('integer', undefined, 2)
            const actual = vector[ToLintedString]({} as any)
            assert(actual === '..2')
        })
        it('Should return correctly when max is undefined', () => {
            const vector = new NumberRange('integer', 1, undefined)
            const actual = vector[ToLintedString]({} as any)
            assert(actual === '1..')
        })
        it('Should return correctly when both min and max exist', () => {
            const vector = new NumberRange('integer', 1, 2)
            const actual = vector[ToLintedString]({} as any)
            assert(actual === '1..2')
        })
    })
})
