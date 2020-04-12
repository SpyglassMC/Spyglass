import assert = require('power-assert')
import { describe, it } from 'mocha'
import StringReader from '../../utils/StringReader'
import NumberArgumentParser from '../../parsers/NumberArgumentParser'
import ParsingError from '../../types/ParsingError'

describe('NumberArgumentParser Tests', () => {
    describe('parse() Tests', () => {
        it('Should parse integer', () => {
            const reader = new StringReader('114514')
            const parser = new NumberArgumentParser('integer', -0.1, 114514)
            const { data } = parser.parse(reader)
            assert(data === 114514)
        })
        it('Should parse float', () => {
            const reader = new StringReader('-.10')
            const parser = new NumberArgumentParser('float', -0.1, 114514)
            const { data } = parser.parse(reader)
            assert(data === -0.1)
        })
        it('Should return error when it expectes an integer but gets a float', () => {
            const reader = new StringReader('114.514')
            const parser = new NumberArgumentParser('integer')
            const { data, errors } = parser.parse(reader)
            assert(isNaN(data))
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 7 }, 'Expected an integer but got 114.514')
            ])
        })
        it('Should return error when the number is larger than max', () => {
            const reader = new StringReader('2333')
            const parser = new NumberArgumentParser('integer', undefined, 6)
            const { data, errors } = parser.parse(reader)
            assert(data === 2333)
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 4 }, 'Expected a number smaller than or equal to 6 but got 2333')
            ])
        })
        it('Should return error when the number is smaller than min', () => {
            const reader = new StringReader('2333')
            const parser = new NumberArgumentParser('integer', 114514)
            const { data, errors } = parser.parse(reader)
            assert(data === 2333)
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 4 }, 'Expected a number greater than or equal to 114514 but got 2333')
            ])
        })
    })
    describe('getExamples() Tests', () => {
        it('Should return for integer', () => {
            const parser = new NumberArgumentParser('integer')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0', '-123', '123'])
        })
        it('Should return for float', () => {
            const parser = new NumberArgumentParser('float')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0', '1.2', '.5', '-1', '-.5', '-1234.56'])
        })
    })
})
