import * as assert from 'power-assert'
import VectorArgumentParser from '../../parsers/VectorArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { ShouldCorrect } from '../../types/Vector'

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
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new VectorArgumentParser(2, false)
            const actual = parser.parse(new StringReader('0 ~-0.5'))
            assert.deepEqual(actual.data[0], { value: 0, type: 'absolute', hasDot: true })
            assert.deepEqual(actual.data[1], { value: -0.5, type: 'relative', hasDot: false })
            assert.deepEqual(actual.data[ShouldCorrect], false)
        })
        it('Should return completions at the beginning of input', () => {
            const parser = new VectorArgumentParser(2, undefined, true, false)
            const actual = parser.parse(new StringReader(''), 0)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '^' },]
            )
        })
        it('Should return completions at the beginning of an element', () => {
            const parser = new VectorArgumentParser(2, undefined, false, true)
            const actual = parser.parse(new StringReader('~ '), 2)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '~' }
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
        it('Should return error when local coordinates are mixed with non-local coordinates', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader('^1 ~ -1'))
            assert.deepEqual(actual.data[0], { value: 1, type: 'local', hasDot: true })
            assert.deepEqual(actual.data[1], { value: 0, type: 'relative', hasDot: false })
            assert.deepEqual(actual.data[2], { value: -1, type: 'absolute', hasDot: true })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 7 }, 'cannot mix local coordinates and non-local coordinates together')
            ])
        })
        it('Should return error when local coordinates are not allowed', () => {
            const parser = new VectorArgumentParser(2, undefined, false)
            const actual = parser.parse(new StringReader('^-1 ^.5'))
            assert.deepEqual(actual.data[0], { value: -1, type: 'local', hasDot: true })
            assert.deepEqual(actual.data[1], { value: 0.5, type: 'local', hasDot: false })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'local coordinate ‘^-1’ is not allowed'),
                new ParsingError({ start: 4, end: 7 }, 'local coordinate ‘^0.5’ is not allowed')
            ])
        })
        it('Should return error when relative coordinates are not allowed', () => {
            const parser = new VectorArgumentParser(2, undefined, undefined, false)
            const actual = parser.parse(new StringReader('1 ~'))
            assert.deepEqual(actual.data[0], { value: 1, type: 'absolute', hasDot: true })
            assert.deepEqual(actual.data[1], { value: 0, type: 'relative', hasDot: false })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 2, end: 3 }, 'relative coordinate ‘~0’ is not allowed')
            ])
        })
        it('Should return error when failed to find sep', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader('1 ~'))
            assert.deepEqual(actual.data[0], { value: 1, type: 'absolute', hasDot: true })
            assert.deepEqual(actual.data[1], { value: 0, type: 'relative', hasDot: false })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 3, end: 4 }, 'expected ‘ ’ but got nothing')
            ])
        })
        it('Should return error for illegal number', () => {
            const parser = new VectorArgumentParser(2)
            const actual = parser.parse(new StringReader('1 ~1.4.5.1.4'))
            assert.deepEqual(actual.data[0], { value: 1, type: 'absolute', hasDot: true })
            assert.deepEqual(actual.data[1], { value: 0, type: 'relative', hasDot: false })
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 3, end: 12 }, 'expected a number but got ‘1.4.5.1.4’')
            ])
        })
    })
})
