import * as assert from 'power-assert'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import NumberRange from '../../types/NumberRange'
import NumberRangeArgumentParser from '../../parsers/NumberRangeArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'

describe('NumberRangeArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0..5', '0', '-5', '-100..', '..100'])
        })
    })
    describe('parse() Tests', () => {
        const manager = new ArgumentParserManager()
        it('Should return data for int range without double periods', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions, errors, cache } = parser.parse(new StringReader('114514'), undefined, manager)
            assert.deepStrictEqual(data, new NumberRange('integer', 114514, 114514))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for int range without minimum value', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions, errors, cache } = parser.parse(new StringReader('..114514'), undefined, manager)
            assert.deepStrictEqual(data, new NumberRange('integer', undefined, 114514))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for int range without maximum value', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions, errors, cache } = parser.parse(new StringReader('114514..'), undefined, manager)
            assert.deepStrictEqual(data, new NumberRange('integer', 114514))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for int range with both side values', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions, errors, cache } = parser.parse(new StringReader('114..514'), undefined, manager)
            assert.deepStrictEqual(data, new NumberRange('integer', 114, 514))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return data for float range', () => {
            const parser = new NumberRangeArgumentParser('float')
            const { data, completions, errors, cache } = parser.parse(new StringReader('1.14..51.4'), undefined, manager)
            assert.deepStrictEqual(data, new NumberRange('float', 1.14, 51.4))
            assert.deepStrictEqual(completions, [])
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
        })
        it('Should return completions for integer range', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, completions } = parser.parse(new StringReader(''), 0, manager)
            assert.deepStrictEqual(data, new NumberRange('integer'))
            assert.deepStrictEqual(completions, [{ label: '-2147483648..2147483647' }])
        })
        it('Should return empty completions for float range', () => {
            const parser = new NumberRangeArgumentParser('float')
            const { data, completions } = parser.parse(new StringReader(''), 0, manager)
            assert.deepStrictEqual(data, new NumberRange('float'))
            assert.deepStrictEqual(completions, [])
        })
        it('Should return error when the minimum value is larger than maximum', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, errors } = parser.parse(new StringReader('3..2'), undefined, manager)
            assert.deepStrictEqual(data, new NumberRange('integer', 3, 2))
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 4 }, 'the minimum value 3 is larger than the maximum value 2')
            ])
        })
        it('Should return error when there is neither a minimum value nor a maximum value', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, errors } = parser.parse(new StringReader('..'), undefined, manager)
            assert.deepStrictEqual(data, new NumberRange('integer'))
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 2 }, 'expected either a minimum value or a maximum value')
            ])
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new NumberRangeArgumentParser('integer')
            const { data, errors } = parser.parse(new StringReader(''), undefined, manager)
            assert.deepStrictEqual(data, new NumberRange('integer'))
            assert.deepStrictEqual(errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a number range but got nothing', false)
            ])
        })
    })
})
