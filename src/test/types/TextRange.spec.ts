import assert = require('power-assert')
import { describe, it } from 'mocha'
import IndexMapping from '../../types/IndexMapping'
import { remapTextRange, areOverlapped } from '../../types/TextRange'

describe('TextRange Tests', () => {
    describe('remapTextRange() Tests', () => {
        it('Should remap correctly', () => {
            const mapping: IndexMapping = [1, 2, 3, 4, 5]
            const actual = remapTextRange({ start: 1, end: 4 }, mapping)
            assert.deepStrictEqual(actual, { start: 2, end: 5 })
        })
    })
    describe('areOverlapped() Tests', () => {
        it('Should return true', () => {
            const actual = areOverlapped({ start: 0, end: 2 }, { start: 1, end: 4 })
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = areOverlapped({ start: 0, end: 2 }, { start: 3, end: 4 })
            assert(actual === false)
        })
    })
})
