import assert = require('power-assert')
import { describe, it } from 'mocha'
import { NumberArgumentParser } from '../../parsers/NumberArgumentParser'
import { NumberNode } from '../../nodes/NumberNode'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { $ } from '../utils.spec'

describe('NumberArgumentParser Tests', () => {
    describe('parse() Tests', () => {
        it('Should parse integer', () => {
            const reader = new StringReader('123456')
            const parser = new NumberArgumentParser('integer', -0.1, 123456)
            const { data } = parser.parse(reader)
            assert.deepStrictEqual(data, $(new NumberNode(123456, '123456'), [0, 6]))
        })
        it('Should parse float', () => {
            const reader = new StringReader('-.10')
            const parser = new NumberArgumentParser('float', -0.1, 123456)
            const { data } = parser.parse(reader)
            assert.deepStrictEqual(data, $(new NumberNode(-0.1, '-.10'), [0, 4]))
        })
        it('Should return error when it expectes an integer but gets a float', () => {
            const reader = new StringReader('123.456')
            const parser = new NumberArgumentParser('integer')
            const { errors } = parser.parse(reader)
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 7 }, 'Expected an integer but got 123.456')
            ])
        })
        it('Should return error when the number is larger than max', () => {
            const reader = new StringReader('1234')
            const parser = new NumberArgumentParser('integer', undefined, 6)
            const { data, errors } = parser.parse(reader)
            assert.deepStrictEqual(data, $(new NumberNode(1234, '1234'), [0, 4]))
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 4 }, 'Expected a number smaller than or equal to 6 but got 1234')
            ])
        })
        it('Should return error when the number is smaller than min', () => {
            const reader = new StringReader('1234')
            const parser = new NumberArgumentParser('integer', 123456)
            const { data, errors } = parser.parse(reader)
            assert.deepStrictEqual(data, $(new NumberNode(1234, '1234'), [0, 4]))
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 4 }, 'Expected a number greater than or equal to 123456 but got 1234')
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
