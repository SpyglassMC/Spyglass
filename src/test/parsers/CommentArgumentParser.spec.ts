import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import Block from '../../types/Block'
import CommentArgumentParser from '../../parsers/CommentArgumentParser'
import Identity from '../../types/Identity'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'

describe('CommentArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new CommentArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, ['# This is a comment.'])
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new CommentArgumentParser()
            const actual = parser.parse(new StringReader('#aaaa'))
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, '#aaaa')
        })
        it('Should return untolerable error for non-comment', () => {
            const parser = new CommentArgumentParser()
            const actual = parser.parse(new StringReader('duck'))
            assert.deepEqual(actual.errors, [new ParsingError({ start: 0, end: 1 }, 'expected ‘#’ but got ‘d’')])
            assert.deepEqual(actual.data, '')
        })
    })
})
