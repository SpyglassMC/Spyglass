import assert = require('power-assert')
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import NumberRangeArgumentParser from '../../parsers/NumberRangeArgumentParser'
import NumberNode from '../../types/nodes/NumberNode'
import NumberRangeNode from '../../types/nodes/NumberRangeNode'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { $ } from '../utils.spec'

describe('NumberRangeArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0..5', '0', '-5', '-100..', '..100'])
        })
    })

    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data for int range without double periods', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions, errors, cache } = parser.parse(new StringReader('123456'), ctx)
            assert.deepStrictEqual(data, $(new NumberRangeNode('integer',
                $(new NumberNode(123456, '123456'), [0, 6]),
                $(new NumberNode(123456, '123456'), [0, 6])
            ), [0, 6]))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for int range without minimum value', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions, errors, cache } = parser.parse(new StringReader('..123456'), ctx)
            assert.deepStrictEqual(data, $(new NumberRangeNode('integer',
                undefined,
                $(new NumberNode(123456, '123456'), [2, 8])
            ), [0, 8]))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for int range without maximum value', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions, errors, cache } = parser.parse(new StringReader('123456..'), ctx)
            assert.deepStrictEqual(data, $(new NumberRangeNode('integer',
                $(new NumberNode(123456, '123456'), [0, 6]),
                undefined
            ), [0, 8]))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for int range with both side values', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions, errors, cache } = parser.parse(new StringReader('123..456'), ctx)
            assert.deepStrictEqual(data, $(new NumberRangeNode('integer',
                $(new NumberNode(123, '123'), [0, 3]),
                $(new NumberNode(456, '456'), [5, 8])
            ), [0, 8]))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for float range', () => {
            const parser = new NumberRangeArgumentParser('float')
            const { data, completions, errors, cache } = parser.parse(new StringReader('1.23..45.6'), ctx)
            assert.deepStrictEqual(data, $(new NumberRangeNode('float',
                $(new NumberNode(1.23, '1.23'), [0, 4]),
                $(new NumberNode(45.6, '45.6'), [6, 10])
            ), [0, 10]))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for cycle float range', () => {
            const parser = new NumberRangeArgumentParser('float', true)
            const { data, completions, errors, cache } = parser.parse(new StringReader('135..-135'), ctx)
            assert.deepStrictEqual(data, $(new NumberRangeNode('float',
                $(new NumberNode(135, '135'), [0, 3]),
                $(new NumberNode(-135, '-135'), [5, 9])
            ), [0, 9]))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return completions for integer range', async () => {
            const ctx = constructContext({ parsers, cursor: 0 })
            const parser = new NumberRangeArgumentParser('integer')
            const { completions } = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(completions, [{ label: '-2147483648..2147483647' }])
        })
        it('Should return empty completions for float range', async () => {
            const ctx = constructContext({ parsers, cursor: 0 })
            const parser = new NumberRangeArgumentParser('float')
            const { completions } = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(completions, [])
        })
        it('Should return error when the minimum value is larger than maximum', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { errors } = parser.parse(new StringReader('3..2'), ctx)
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 4 }, 'The minimum value 3 is larger than the maximum value 2')
            ])
        })
        it('Should return error when there is neither a minimum value nor a maximum value', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { errors } = parser.parse(new StringReader('..'), ctx)
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 2 }, 'Expected either a minimum value or a maximum value')
            ])
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { errors } = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 1 }, 'Expected a number range but got nothing', false)
            ])
        })
    })
})
