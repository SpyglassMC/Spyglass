import * as assert from 'power-assert'
import StringReader from '../../utils/StringReader'

describe('StringReader Tests', () => {
    describe('passedString Tests', () => {
        it('Should return correctly when cursor is 0', () => {
            const reader = new StringReader('foo')
            const actual = reader.passedString
            assert.strictEqual(actual, '')
        })
        it('Should return correctly when cursor is more than 0', () => {
            const reader = new StringReader('foo')
            reader.cursor = 1
            const actual = reader.passedString
            assert.strictEqual(actual, 'f')
        })
    })
    describe('remainingString Tests', () => {
        it('Should return correctly when cursor is 0', () => {
            const reader = new StringReader('foo')
            const actual = reader.remainingString
            assert.strictEqual(actual, 'foo')
        })
        it('Should return correctly when cursor is more than 0', () => {
            const reader = new StringReader('foo')
            reader.cursor = 1
            const actual = reader.remainingString
            assert.strictEqual(actual, 'oo')
        })
    })
    describe('canRead() Tests', () => {
        it('Should return true when can read', () => {
            const reader = new StringReader('foo')
            const actual = reader.canRead()
            assert.strictEqual(actual, true)
        })
        it('Should return false when cannot read', () => {
            const reader = new StringReader('foo')
            reader.cursor = 3
            const actual = reader.canRead()
            assert.strictEqual(actual, false)
        })
    })
    describe('canRead() Tests', () => {
        it('Should return true when can read', () => {
            const reader = new StringReader('foo')
            const actual = reader.canRead()
            assert.strictEqual(actual, true)
        })
        it('Should return false when cannot read', () => {
            const reader = new StringReader('foo')
            reader.cursor = 3
            const actual = reader.canRead()
            assert.strictEqual(actual, false)
        })
    })
    describe('read() Tests', () => {
        it('Should return the char at cursor', () => {
            const reader = new StringReader('foo')
            const actual = reader.read()
            assert.strictEqual(actual, 'f')
        })
    })
})
