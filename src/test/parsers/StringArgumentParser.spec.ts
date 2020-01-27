import assert = require('power-assert')
import { describe, it } from 'mocha'
import StringReader from '../../utils/StringReader'
import StringArgumentParser from '../../parsers/StringArgumentParser'
import ParsingError from '../../types/ParsingError'

describe('StringArgumentParser Tests', () => {
    describe('parse() Tests', () => {
        it('Should parse single word', () => {
            const reader = new StringReader('foo')
            const parser = new StringArgumentParser('SingleWord')
            const { data } = parser.parse(reader)
            assert(data === 'foo')
        })
        it('Should parse quotable phrase', () => {
            const reader = new StringReader("'foo'")
            const parser = new StringArgumentParser('QuotablePhrase')
            const { data } = parser.parse(reader)
            assert(data === 'foo')
        })
        it('Should parse greedy phrase', () => {
            const reader = new StringReader('"#$What is this?')
            const parser = new StringArgumentParser('GreedyPhrase')
            const { data } = parser.parse(reader)
            assert(data === '"#$What is this?')
        })
        it('Should throw error', () => {
            const reader = new StringReader('"haha')
            const parser = new StringArgumentParser('QuotablePhrase')
            const { data, errors } = parser.parse(reader)
            const message = (<ParsingError[]>errors)[0].message
            assert(data === '')
            assert(message.match(/Expected an ending quote ‘"’/))
        })
    })
    describe('toHint() Tests', () => {
        it('Should return correctly for non-optional node', () => {
            const parser = new StringArgumentParser()
            const actual = parser.toHint('id', false)
            assert(actual === '<id: string>')
        })
        it('Should return correctly for optional node', () => {
            const parser = new StringArgumentParser()
            const actual = parser.toHint('id', true)
            assert(actual === '[id: string]')
        })
    })
    describe('getExamples() Tests', () => {
        it('Should return for single word', () => {
            const parser = new StringArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['word', 'word_with_underscores'])
        })
        it('Should return for quotable phrase', () => {
            const parser = new StringArgumentParser('QuotablePhrase')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['word', '"quoted phrase"', '""'])
        })
        it('Should return for greedy phrase', () => {
            const parser = new StringArgumentParser('GreedyPhrase')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['word', 'words with spaces', '"and symbols"'])
        })
    })
})
