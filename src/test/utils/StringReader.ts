import * as assert from 'power-assert'
import StringReader from '../../utils/StringReader'
import ParsingError from '../../types/ParsingError'
import { describe, it } from 'mocha'

describe.only('StringReader Tests', () => {
    describe('passedString Tests', () => {
        it('Should return correctly when cursor is 0', () => {
            const reader = new StringReader('foo')
            const actual = reader.passedString
            assert(actual === '')
        })
        it('Should return correctly when cursor is more than 0', () => {
            const reader = new StringReader('foo')
            reader.cursor = 1
            const actual = reader.passedString
            assert(actual === 'f')
        })
    })
    describe('remainingString Tests', () => {
        it('Should return correctly when cursor is 0', () => {
            const reader = new StringReader('foo')
            const actual = reader.remainingString
            assert(actual === 'foo')
        })
        it('Should return correctly when cursor is more than 0', () => {
            const reader = new StringReader('foo')
            reader.cursor = 1
            const actual = reader.remainingString
            assert(actual === 'oo')
        })
    })
    describe('canRead() Tests', () => {
        it('Should return true when can read', () => {
            const reader = new StringReader('foo')
            const actual = reader.canRead()
            assert(actual === true)
        })
        it('Should return false when cannot read', () => {
            const reader = new StringReader('foo')
            reader.cursor = 3
            const actual = reader.canRead()
            assert(actual === false)
        })
    })
    describe('read() Tests', () => {
        it('Should return the char at cursor', () => {
            const reader = new StringReader('foo')
            const actual = reader.read()
            assert(actual === 'f')
        })
    })
    describe('readInt() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('233foo')
            const actualResult = reader.readInt()
            const actualCursor = reader.cursor
            assert(actualResult === 233)
            assert(actualCursor === 3)
        })
        it('Should throw error for nothing', () => {
            const reader = new StringReader('')
            try {
                reader.readInt()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected a number but got nothing/))
                assert(range.start === 0)
                assert(range.end === 1)
                assert(tolerable === true)
            }
        })
        it('Should throw error for invalid string consisting of valid characters', () => {
            const reader = new StringReader('2.3.3')
            try {
                reader.readInt()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected a number but got `2.3.3`/))
                assert(range.start === 0)
                assert(range.end === 5)
                assert(tolerable === true)
            }
        })
        it('Should throw error for invalid string containing invalid characters', () => {
            const reader = new StringReader('foo')
            try {
                reader.readInt()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected a number but got `f` at beginning/))
                assert(range.start === 0)
                assert(range.end === 1)
                assert(tolerable === false)
            }
        })
        it('Should throw error for float numbers', () => {
            const reader = new StringReader('1.2')
            try {
                reader.readInt()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected an integer but got 1\.2/))
                assert(range.start === 0)
                assert(range.end === 3)
                assert(tolerable === true)
            }
        })
        it('Should throw error for numbers which are too high', () => {
            const reader = new StringReader('9147483647')
            try {
                reader.readInt()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected an integer between .* but got 9147483647/))
                assert(range.start === 0)
                assert(range.end === 10)
                assert(tolerable === true)
            }
        })
    })
    describe('readQuotedString() Tests', () => {
        it('Should return empty string when cannot read', () => {
            const reader = new StringReader('')
            const actual = reader.readQuotedString()
            assert(actual === '')
        })
        it('Should return correctly', () => {
            const reader = new StringReader('"haha"')
            const actual = reader.readQuotedString()
            assert(actual === 'haha')
        })
        it('Should handle escape characters', () => {
            const reader = new StringReader('"ha\\\\ha\\" "')
            const actual = reader.readQuotedString()
            assert(actual === 'ha\\ha" ')
        })
        it('Should throw error when not beginning with quote', () => {
            const reader = new StringReader('foo')
            try {
                reader.readQuotedString()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected a quote.*but got `f`/))
                assert(range.start === 0)
                assert(range.end === 1)
                assert(!tolerable === true)
            }
        })
        it('Should throw error when having no ending quote', () => {
            const reader = new StringReader('"haha')
            try {
                reader.readQuotedString()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected ending quote `"` but got nothing/))
                assert(range.start === 5)
                assert(range.end === 6)
                assert(tolerable === true)
            }
        })
        it('Should throw error for unexpected escape character', () => {
            const reader = new StringReader(`"haha\\'`)
            try {
                reader.readQuotedString()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/unexpected escape character `'`/))
                assert(range.start === 6)
                assert(range.end === 7)
                assert(tolerable === true)
            }
        })
    })
    describe('readBoolean() Tests', () => {
        it('Should return correctly', () => {
            // FIXME: When Mojang fixes that quoted string can be parsed as boolean.
            const reader = new StringReader('"true"')
            const actual = reader.readBoolean()
            assert(actual === true)
        })
        it('Should throw tolerable error', () => {
            const reader = new StringReader('Tru')
            try {
                reader.readBoolean()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected a boolean but got `Tru`/))
                assert(range.start === 0)
                assert(range.end === 3)
                assert(tolerable === true)
            }
        })
        it('Should throw untolerable error', () => {
            const reader = new StringReader('Tuesday')
            try {
                reader.readBoolean()
            } catch (e) {
                const { range, message, tolerable } = <ParsingError>e
                assert(message.match(/expected a boolean but got `Tuesday`/))
                assert(range.start === 0)
                assert(range.end === 7)
                assert(tolerable === false)
            }
        })
    })
    describe('readRemaining() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('fooo')
            reader.read()
            const actualResult = reader.readRemaining()
            const actualCursor = reader.cursor
            assert(actualResult === 'ooo')
            assert(actualCursor === 4)
        })
    })
})
