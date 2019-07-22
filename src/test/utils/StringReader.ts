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
    describe('readQuotedString() Tests', () => {
        it('Should return empty string when cannot read', () => {
            const reader = new StringReader('')
            const actual = reader.readQuotedString()
            assert.strictEqual(actual, '')
        })
        it('Should return correctly', () => {
            const reader = new StringReader('"haha"')
            const actual = reader.readQuotedString()
            assert.strictEqual(actual, 'haha')
        })
        it('Should handle escape characters', () => {
            const reader = new StringReader('"ha\\\\ha\\" "')
            const actual = reader.readQuotedString()
            assert.strictEqual(actual, 'ha\\ha" ')
        })
        it('Should throw error when not beginning with quote', () => {
            const reader = new StringReader('foo')
            assert.throws(() => { reader.readQuotedString() }, /expected a quote/)
        })
        it('Should throw error when having no ending quote', () => {
            const reader = new StringReader('"haha')
            assert.throws(() => { reader.readQuotedString() }, /expected ending quote/)
        })
        it('Should throw error for unexpected escape character', () => {
            const reader = new StringReader(`"haha\\'`)
            assert.throws(() => { reader.readQuotedString() }, /unexpected escape character/)
        })
    })
    describe('readRemaining() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('fooo')
            reader.read()
            const actualResult = reader.readQuotedString()
            const actualCursor = reader.cursor
            assert.strictEqual(actualResult, 'ooo')
            assert.strictEqual(actualCursor, 4)
        })
    })
})
