import assert = require('power-assert')
import { describe, it } from 'mocha'
import IndexMapping, { getInnerIndex, getOuterIndex } from '../../types/IndexMapping'

describe('IndexMapping Tests', () => {
    // 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ
    // 000000000011111111112222222222333333
    // 012345678901234567890123456789012345
    // some begin "{\"text\":\"ha\\\\ha\"}"
    // {"text":"ha\\ha"}
    const mapping: IndexMapping = {
        start: 12,
        skipAt: [1, 6, 8, 11, 12, 15]
    }
    describe('getInnerIndex() Tests', () => {
        it('Should return correctly for empty mapping', () => {
            const actual = getInnerIndex({}, 4)
            assert(actual === 4)
        })
        it('Should return correctly from 12', () => {
            const actual = getInnerIndex(mapping, 12)
            assert(actual === 0)
        })
        it('Should return correctly from 13', () => {
            const actual = getInnerIndex(mapping, 13)
            assert(actual === 1)
        })
        it('Should return correctly from 14', () => {
            const actual = getInnerIndex(mapping, 14)
            assert(actual === 1)
        })
        it('Should return correctly from 15', () => {
            const actual = getInnerIndex(mapping, 15)
            assert(actual === 2)
        })
        it('Should return correctly from 16', () => {
            const actual = getInnerIndex(mapping, 16)
            assert(actual === 3)
        })
        it('Should return correctly from 17', () => {
            const actual = getInnerIndex(mapping, 17)
            assert(actual === 4)
        })
        it('Should return correctly from 18', () => {
            const actual = getInnerIndex(mapping, 18)
            assert(actual === 5)
        })
        it('Should return correctly from 19', () => {
            const actual = getInnerIndex(mapping, 19)
            assert(actual === 6)
        })
        it('Should return correctly from 20', () => {
            const actual = getInnerIndex(mapping, 20)
            assert(actual === 6)
        })
        it('Should return correctly from 21', () => {
            const actual = getInnerIndex(mapping, 21)
            assert(actual === 7)
        })
        it('Should return correctly from 22', () => {
            const actual = getInnerIndex(mapping, 22)
            assert(actual === 8)
        })
        it('Should return correctly from 23', () => {
            const actual = getInnerIndex(mapping, 23)
            assert(actual === 8)
        })
        it('Should return correctly from 24', () => {
            const actual = getInnerIndex(mapping, 24)
            assert(actual === 9)
        })
        it('Should return correctly from 25', () => {
            const actual = getInnerIndex(mapping, 25)
            assert(actual === 10)
        })
        it('Should return correctly from 26', () => {
            const actual = getInnerIndex(mapping, 26)
            assert(actual === 11)
        })
        it('Should return correctly from 27', () => {
            const actual = getInnerIndex(mapping, 27)
            assert(actual === 11)
        })
        it('Should return correctly from 28', () => {
            const actual = getInnerIndex(mapping, 28)
            assert(actual === 12)
        })
        it('Should return correctly from 29', () => {
            const actual = getInnerIndex(mapping, 29)
            assert(actual === 12)
        })
        it('Should return correctly from 30', () => {
            const actual = getInnerIndex(mapping, 30)
            assert(actual === 13)
        })
        it('Should return correctly from 31', () => {
            const actual = getInnerIndex(mapping, 31)
            assert(actual === 14)
        })
        it('Should return correctly from 32', () => {
            const actual = getInnerIndex(mapping, 32)
            assert(actual === 15)
        })
        it('Should return correctly from 33', () => {
            const actual = getInnerIndex(mapping, 33)
            assert(actual === 15)
        })
        it('Should return correctly from 34', () => {
            const actual = getInnerIndex(mapping, 34)
            assert(actual === 16)
        })
    })
    describe('getOuterIndex() Tests', () => {
        it('Should return correctly for empty mapping', () => {
            const actual = getOuterIndex({}, 4)
            assert(actual === 4)
        })
        it('Should return correctly from 0', () => {
            const actual = getOuterIndex(mapping, 0)
            assert(actual === 12)
        })
        it('Should return correctly from 1', () => {
            const actual = getOuterIndex(mapping, 1)
            assert(actual === 14)
        })
        it('Should return correctly from 2', () => {
            const actual = getOuterIndex(mapping, 2)
            assert(actual === 15)
        })
        it('Should return correctly from 3', () => {
            const actual = getOuterIndex(mapping, 3)
            assert(actual === 16)
        })
        it('Should return correctly from 4', () => {
            const actual = getOuterIndex(mapping, 4)
            assert(actual === 17)
        })
        it('Should return correctly from 5', () => {
            const actual = getOuterIndex(mapping, 5)
            assert(actual === 18)
        })
        it('Should return correctly from 6', () => {
            const actual = getOuterIndex(mapping, 6)
            assert(actual === 20)
        })
        it('Should return correctly from 7', () => {
            const actual = getOuterIndex(mapping, 7)
            assert(actual === 21)
        })
        it('Should return correctly from 8', () => {
            const actual = getOuterIndex(mapping, 8)
            assert(actual === 23)
        })
        it('Should return correctly from 9', () => {
            const actual = getOuterIndex(mapping, 9)
            assert(actual === 24)
        })
        it('Should return correctly from 10', () => {
            const actual = getOuterIndex(mapping, 10)
            assert(actual === 25)
        })
        it('Should return correctly from 11', () => {
            const actual = getOuterIndex(mapping, 11)
            assert(actual === 27)
        })
        it('Should return correctly from 12', () => {
            const actual = getOuterIndex(mapping, 12)
            assert(actual === 29)
        })
        it('Should return correctly from 13', () => {
            const actual = getOuterIndex(mapping, 13)
            assert(actual === 30)
        })
        it('Should return correctly from 14', () => {
            const actual = getOuterIndex(mapping, 14)
            assert(actual === 31)
        })
        it('Should return correctly from 15', () => {
            const actual = getOuterIndex(mapping, 15)
            assert(actual === 33)
        })
        it('Should return correctly from 16', () => {
            const actual = getOuterIndex(mapping, 16)
            assert(actual === 34)
        })
    })
})
