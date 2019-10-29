import * as assert from 'power-assert'
import StringReader from '../../utils/StringReader'
import ParsingError from '../../types/ParsingError'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import BigNumber from 'bignumber.js'
import Identity from '../../types/Identity'

describe('StringReader Tests', () => {
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
    describe('clone() Tests', () => {
        it('Should clone', () => {
            const reader = new StringReader('foo bar')
            const clonedReader = reader.clone()
            assert(reader.string === clonedReader.string)
            assert(reader.cursor === clonedReader.cursor)
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
    describe('peek() Tests', () => {
        it('Should return the char at cursor', () => {
            const reader = new StringReader('bar')
            const actual = reader.peek()
            assert(actual === 'b')
        })
        it('Should return the char after offset', () => {
            const reader = new StringReader('bar')
            const actual = reader.peek(1)
            assert(actual === 'a')
        })
    })
    describe('read() Tests', () => {
        it('Should return the char at cursor', () => {
            const reader = new StringReader('foo')
            const actual = reader.read()
            assert(actual === 'f')
        })
    })
    describe('skipWhiteSpace() Tests', () => {
        it('Should skip white spaces', () => {
            const reader = new StringReader('f \n\r \n o')
            reader.cursor = 1
            reader.skipWhiteSpace()
            assert(reader.cursor === 7)
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
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected a number but got nothing/))
                assert(range.start === 0)
                assert(range.end === 1)
                assert(tolerable === false)
            }
        })
        it('Should throw error for invalid string consisting of valid characters', () => {
            const reader = new StringReader('2.3.3')
            try {
                reader.readInt()
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected a number but got ‘2.3.3’/))
                assert(range.start === 0)
                assert(range.end === 5)
                assert(tolerable === true)
            }
        })
        it('Should throw error for invalid string containing invalid characters', () => {
            const reader = new StringReader('foo')
            try {
                reader.readInt()
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected a number but got ‘f’ at beginning/))
                assert(range.start === 0)
                assert(range.end === 1)
                assert(tolerable === false)
            }
        })
        it('Should throw error for float numbers', () => {
            const reader = new StringReader('1.2')
            try {
                reader.readInt()
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
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
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected an integer between .* but got 9147483647/))
                assert(range.start === 0)
                assert(range.end === 10)
                assert(tolerable === true)
            }
        })
    })
    describe('readLong() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('2333foo')
            const actualResult = reader.readLong()
            const actualCursor = reader.cursor
            assert.deepStrictEqual(actualResult, new BigNumber(2333))
            assert(actualCursor === 4)
        })
        it('Should throw error for float numbers', () => {
            const reader = new StringReader('1.2')
            try {
                reader.readLong()
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected a long but got 1\.2/))
                assert(range.start === 0)
                assert(range.end === 3)
                assert(tolerable === true)
            }
        })
    })
    describe('readFloat() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('12.3foo')
            const actualResult = reader.readFloat()
            const actualCursor = reader.cursor
            assert(actualResult === 12.3)
            assert(actualCursor === 4)
        })
    })
    describe('readDouble() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('12.3foo')
            const actualResult = reader.readDouble()
            const actualCursor = reader.cursor
            assert(actualResult === 12.3)
            assert(actualCursor === 4)
        })
    })
    describe('readUnquotedString() Tests', () => {
        it('Should return correctly', () => {
            const reader = new StringReader('hahaha$')
            const actualResult = reader.readUnquotedString()
            const actualCursor = reader.cursor
            assert(actualResult === 'hahaha')
            assert(actualCursor === 6)
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
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected a quote.*but got ‘f’/))
                assert(range.start === 0)
                assert(range.end === 1)
                assert(!tolerable === true)
            }
        })
        it('Should throw error when having no ending quote', () => {
            const reader = new StringReader('"haha')
            try {
                reader.readQuotedString()
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected an ending quote ‘"’ but got nothing/))
                assert(range.start === 5)
                assert(range.end === 6)
                assert(tolerable === true)
            }
        })
        it('Should throw error for unexpected escape character', () => {
            const reader = new StringReader(`"haha\\'`)
            try {
                reader.readQuotedString()
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/unexpected escape character ‘'’/))
                assert(range.start === 6)
                assert(range.end === 7)
                assert(tolerable === true)
            }
        })
    })
    describe('readUntilOrEnd() Tests', () => {
        it('Should read until specific character', () => {
            const reader = new StringReader('foo bar')
            const actualResult = reader.readUntilOrEnd(' ')
            const actualCursor = reader.cursor
            assert(actualResult === 'foo')
            assert(actualCursor === 3)
        })
        it('Should read until end', () => {
            const reader = new StringReader('foobar')
            const actualResult = reader.readUntilOrEnd(' ')
            const actualCursor = reader.cursor
            assert(actualResult === 'foobar')
            assert(actualCursor === 6)
        })
    })
    describe('readString() Tests', () => {
        it('Should return empty string if cannot read', () => {
            const reader = new StringReader('')
            const actualResult = reader.readString()
            const actualCursor = reader.cursor
            assert(actualResult === '')
            assert(actualCursor === 0)
        })
        it('Should read quoted string', () => {
            const reader = new StringReader('"foobar"')
            const actualResult = reader.readString()
            const actualCursor = reader.cursor
            assert(actualResult === 'foobar')
            assert(actualCursor === 8)
        })
        it('Should read unquoted string', () => {
            const reader = new StringReader('foobar')
            const actualResult = reader.readString()
            const actualCursor = reader.cursor
            assert(actualResult === 'foobar')
            assert(actualCursor === 6)
        })
    })
    describe('readBoolean() Tests', () => {
        it('Should return true correctly', () => {
            // FIXME: When Mojang fixes that quoted string in commands can be parsed as boolean.
            const reader = new StringReader('"true"')
            const actual = reader.readBoolean()
            assert(actual === true)
        })
        it('Should return false correctly', () => {
            // FIXME: When Mojang fixes that quoted string in commands can be parsed as boolean.
            const reader = new StringReader('"false"')
            const actual = reader.readBoolean()
            assert(actual === false)
        })
        it('Should throw tolerable error', () => {
            const reader = new StringReader('Tru')
            try {
                reader.readBoolean()
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected a boolean but got ‘Tru’/))
                assert(range.start === 0)
                assert(range.end === 3)
                assert(tolerable === true)
            }
        })
        it('Should throw untolerable error', () => {
            const reader = new StringReader('Tuesday')
            try {
                reader.readBoolean()
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected a boolean but got ‘Tuesday’/))
                assert(range.start === 0)
                assert(range.end === 7)
                assert(tolerable === false)
            }
        })
    })
    describe('readNamespacedID() Tests', () => {
        it('Should return namespaced ID with single path', () => {
            const reader = new StringReader('spgoding:foo')
            const actualResult = reader.readNamespacedID()
            const actualCursor = reader.cursor
            assert.deepStrictEqual(actualResult, new Identity('spgoding', ['foo']))
            assert(actualCursor === 12)
        })
        it('Should return namespaced ID with multiple paths', () => {
            const reader = new StringReader('spgoding:foo/bar/baz')
            const actualResult = reader.readNamespacedID()
            const actualCursor = reader.cursor
            assert.deepStrictEqual(actualResult, new Identity('spgoding', ['foo', 'bar', 'baz']))
            assert(actualCursor === 20)
        })
        it('Should return namespaced ID without namespace', () => {
            const reader = new StringReader('foo/bar')
            const actualResult = reader.readNamespacedID()
            const actualCursor = reader.cursor
            assert.deepStrictEqual(actualResult, new Identity('minecraft', ['foo', 'bar']))
            assert(actualCursor === 7)
        })
        it('Should throw error when encounters nothing', () => {
            const reader = new StringReader('')
            try {
                reader.readNamespacedID()
                fail()
            } catch (p) {
                assert.deepStrictEqual(p, new ParsingError({ start: 0, end: 1 }, 'expected a namespaced ID but got nothing', false))
            }
        })
    })
    describe('expect() Tests', () => {
        it('Should not throw when string match the expectation', () => {
            const reader = new StringReader('foo')
            reader.expect('f')
        })
        it('Should throw tolerable error when cannot read', () => {
            const reader = new StringReader('f')
            reader.read()
            try {
                reader.expect('f')
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected ‘f’ but got nothing/))
                assert(range.start === 1)
                assert(range.end === 2)
                assert(tolerable === true)
            }
        })
        it('Should throw tolerable error when not matching', () => {
            const reader = new StringReader('foo')
            try {
                reader.expect('b')
                fail()
            } catch (p) {
                const { range, message, tolerable } = <ParsingError>p
                assert(message.match(/expected ‘b’ but got ‘f’/))
                assert(range.start === 0)
                assert(range.end === 1)
                assert(tolerable === true)
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
    describe('canInNumber() Tests', () => {
        it('Should return true', () => {
            const actual = StringReader.canInNumber('0')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = StringReader.canInNumber('a')
            assert(actual === false)
        })
    })
    describe('isWhiteSpace() Tests', () => {
        it('Should return true', () => {
            const actual = StringReader.isWhiteSpace(' ')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = StringReader.isWhiteSpace('a')
            assert(actual === false)
        })
    })
    describe('canInUnquotedString() Tests', () => {
        it('Should return true', () => {
            const actual = StringReader.canInUnquotedString('a')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = StringReader.canInUnquotedString(' ')
            assert(actual === false)
        })
    })
    describe('isQuote() Tests', () => {
        it('Should return true', () => {
            const actual = StringReader.isQuote('"')
            assert(actual === true)
        })
        it('Should return false', () => {
            const actual = StringReader.isQuote('a')
            assert(actual === false)
        })
    })
})
