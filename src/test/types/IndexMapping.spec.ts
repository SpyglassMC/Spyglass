import assert = require('power-assert')
import { describe, it } from 'mocha'
import IndexMapping, { getInnerIndex, getOuterIndex } from '../../types/IndexMapping'

describe('IndexMapping Tests', () => {
    // Outer: "foo\"bar"
    // Inner: foo"bar
    const mapping: IndexMapping = [1, 2, 3, 5, 6, 7, 8]
    describe('getInnerIndex() Tests', () => {
        it('Should return correctly', () => {
            const actual = getInnerIndex(mapping, 5)
            assert(actual === 3)
        })
    })
    describe('getOuterIndex() Tests', () => {
        it('Should return when it exists in the mapping', () => {
            const actual = getOuterIndex(mapping, 3)
            assert(actual === 5)
        })
        it('Should infer the outer index when the mapping is partial', () => {
            const mapping: IndexMapping = [1, 2, 3, 5]
            const actual = getOuterIndex(mapping, 6)
            assert(actual === 8)
        })
        it('Should infer the outer index when the mapping is empty, though the result might be wrong', () => {
            const mapping: IndexMapping = []
            const actual = getOuterIndex(mapping, 3)
            assert(actual === 3)
        })
    })
})
