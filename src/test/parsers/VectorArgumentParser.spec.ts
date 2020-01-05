import * as assert from 'power-assert'
import VectorArgumentParser from '../../parsers/VectorArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'

describe('VectorArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples for Vector2', () => {
            const parser = new VectorArgumentParser(2)
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0 0', '~ ~', '0.1 -0.5', '~1 ~-2'])
        })
        it('Should return examples for Vector3', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0 0 0', '~ ~ ~', '^ ^ ^', '^1 ^ ^-5', '0.1 -0.5 .9', '~0.5 ~1 ~-5'])
        })
        it('Should return examples for Vector4', () => {
            const parser = new VectorArgumentParser(4)
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['0 0 0 0', '~ ~ ~ ~', '^ ^ ^ ^'])
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new VectorArgumentParser(2, false)
            const actual = parser.parse(new StringReader('0 ~-0.5'))
            assert.deepEqual(actual.data.elements[0], { value: '0', type: 'absolute' })
            assert.deepEqual(actual.data.elements[1], { value: '-0.5', type: 'relative' })
        })
        it('Should return completions at the beginning of input', () => {
            const parser = new VectorArgumentParser(2, true, false)
            const actual = parser.parse(new StringReader(''), 0)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '^', sortText: '2' }
                ]
            )
        })
        it('Should return completions at the beginning of an element', () => {
            const parser = new VectorArgumentParser(2, false, true)
            const actual = parser.parse(new StringReader('~ '), 2)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '~', sortText: '1' }
                ]
            )
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a vector but got nothing', false)
            ])
        })
        it('Should return untolerable error when the input is not a vector', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader('f'))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a vector but got ‘f’', false)
            ])
        })
        it('Should return error when local coordinates are mixed with non-local coordinates', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader('^1 ~ -1'))
            assert.deepEqual(actual.data.elements[0], { value: '1', type: 'local' })
            assert.deepEqual(actual.data.elements[1], { value: '', type: 'relative' })
            assert.deepEqual(actual.data.elements[2], { value: '-1', type: 'absolute' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 7 }, 'cannot mix local coordinates and non-local coordinates together')
            ])
        })
        it('Should return error when local coordinates are not allowed', () => {
            const parser = new VectorArgumentParser(2, false)
            const actual = parser.parse(new StringReader('^-1 ^.5'))
            assert.deepEqual(actual.data.elements[0], { value: '-1', type: 'local' })
            assert.deepEqual(actual.data.elements[1], { value: '.5', type: 'local' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'local coordinate ‘^-1’ is not allowed'),
                new ParsingError({ start: 4, end: 7 }, 'local coordinate ‘^.5’ is not allowed')
            ])
        })
        it('Should return error when relative coordinates are not allowed', () => {
            const parser = new VectorArgumentParser(2, undefined, false)
            const actual = parser.parse(new StringReader('1 ~'))
            assert.deepEqual(actual.data.elements[0], { value: '1', type: 'absolute' })
            assert.deepEqual(actual.data.elements[1], { value: '', type: 'relative' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 2, end: 3 }, 'relative coordinate ‘~’ is not allowed')
            ])
        })
        it('Should return untolerable error when failed to find sep', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader('1 ~'))
            assert.deepEqual(actual.data.elements[0], { value: '1', type: 'absolute' })
            assert.deepEqual(actual.data.elements[1], { value: '', type: 'relative' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 3, end: 4 }, 'expected ‘ ’ but got nothing', false)
            ])
        })
        it('Should return error for illegal number', () => {
            const parser = new VectorArgumentParser(2)
            const actual = parser.parse(new StringReader('1 ~1.4.5.1.4'))
            assert.deepEqual(actual.data.elements[0], { value: '1', type: 'absolute' })
            assert.deepEqual(actual.data.elements[1], { value: '', type: 'relative' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 3, end: 12 }, 'expected a number but got ‘1.4.5.1.4’')
            ])
        })
        it('Should return error when the number is smaller than min', () => {
            const parser = new VectorArgumentParser(2, undefined, false, 0)
            const actual = parser.parse(new StringReader('-.1 .5'))
            assert.deepEqual(actual.data.elements[0], { value: '-.1', type: 'absolute' })
            assert.deepEqual(actual.data.elements[1], { value: '.5', type: 'absolute' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'expected a number larger than or equal to 0 but got -0.1')
            ])
        })
        it('Should return error when the number is smaller than min in an array', () => {
            const parser = new VectorArgumentParser(2, undefined, false, [0, undefined])
            const actual = parser.parse(new StringReader('-.1 .5'))
            assert.deepEqual(actual.data.elements[0], { value: '-.1', type: 'absolute' })
            assert.deepEqual(actual.data.elements[1], { value: '.5', type: 'absolute' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'expected a number larger than or equal to 0 but got -0.1')
            ])
        })
        it('Should return error when the number is larger than max', () => {
            const parser = new VectorArgumentParser(2, undefined, false, undefined, 0)
            const actual = parser.parse(new StringReader('-.1 .5'))
            assert.deepEqual(actual.data.elements[0], { value: '-.1', type: 'absolute' })
            assert.deepEqual(actual.data.elements[1], { value: '.5', type: 'absolute' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 4, end: 6 }, 'expected a number smaller than or equal to 0 but got 0.5')
            ])
        })
        it('Should return error when the number is larger than max in an array', () => {
            const parser = new VectorArgumentParser(2, undefined, false, undefined, [undefined, 0])
            const actual = parser.parse(new StringReader('-.1 .5'))
            assert.deepEqual(actual.data.elements[0], { value: '-.1', type: 'absolute' })
            assert.deepEqual(actual.data.elements[1], { value: '.5', type: 'absolute' })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 4, end: 6 }, 'expected a number smaller than or equal to 0 but got 0.5')
            ])
        })
    })
})
