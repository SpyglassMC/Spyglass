import assert = require('power-assert')
import VectorArgumentParser from '../../parsers/VectorArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import { $ } from '../utils'
import VectorNode, { VectorElementNode, VectorElementType } from '../../types/nodes/VectorNode'
import { CompletionItemKind, InsertTextFormat } from 'vscode-languageserver'

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

    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({})
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new VectorArgumentParser(2, false)
            const actual = parser.parse(new StringReader('0 ~-0.5'), ctx)
            assert.deepStrictEqual(actual.data, $(new VectorNode(), [0, 7], {
                length: 2,
                0: $(new VectorElementNode(VectorElementType.Absolute, 0, '0'), [0, 1]),
                1: $(new VectorElementNode(VectorElementType.Relative, -0.5, '-0.5'), [2, 7]),
            }))
        })
        it('Should return completions at the beginning of input', async () => {
            const ctx = await constructContext({ cursor: 0 })
            const parser = new VectorArgumentParser(2, true, false)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '^ ^', insertText: '^$1 ^$2', insertTextFormat: InsertTextFormat.Snippet, kind: CompletionItemKind.Snippet },
                    { label: '^', sortText: '2' }
                ]
            )
        })
        it('Should return completions at the beginning of an element', async () => {
            const ctx = await constructContext({ cursor: 2 })
            const parser = new VectorArgumentParser(2, false, true)
            const actual = parser.parse(new StringReader('~ '), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '~', sortText: '1' }
                ]
            )
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'Expected a vector but got nothing', false)
            ])
        })
        it('Should return untolerable error when the input is not a vector', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader('f'), ctx)
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'Expected a vector but got ‘f’', false)
            ])
        })
        it('Should return error when local coordinates are mixed with non-local coordinates', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader('^1 ~ -1'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Local, 1, '1'), [0, 2]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Relative, 0, ''), [3, 4]))
            assert.deepStrictEqual(actual.data[2], $(new VectorElementNode(VectorElementType.Absolute, -1, '-1'), [5, 7]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 7 }, 'Cannot mix local coordinates and non-local coordinates together')
            ])
        })
        it('Should return error when local coordinates are not allowed', () => {
            const parser = new VectorArgumentParser(2, false)
            const actual = parser.parse(new StringReader('^-1 ^.5'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Local, -1, '-1'), [0, 3]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Local, 0.5, '.5'), [4, 7]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Local coordinate ‘^-1’ is not allowed'),
                new ParsingError({ start: 4, end: 7 }, 'Local coordinate ‘^.5’ is not allowed')
            ])
        })
        it('Should return error when relative coordinates are not allowed', () => {
            const parser = new VectorArgumentParser(2, undefined, false)
            const actual = parser.parse(new StringReader('1 ~'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Absolute, 1, '1'), [0, 1]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Relative, 0, ''), [2, 3]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 2, end: 3 }, 'Relative coordinate ‘~’ is not allowed')
            ])
        })
        it('Should return untolerable error when failed to find sep', () => {
            const parser = new VectorArgumentParser(3)
            const actual = parser.parse(new StringReader('1 ~'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Absolute, 1, '1'), [0, 1]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Relative, 0, ''), [2, 3]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 3, end: 4 }, 'Expected ‘ ’ but got nothing', false)
            ])
        })
        it('Should return error for illegal number', () => {
            const parser = new VectorArgumentParser(2)
            const actual = parser.parse(new StringReader('1 ~1.4.5.1.4'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Absolute, 1, '1'), [0, 1]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Relative, 0, ''), [2, 3]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 3, end: 12 }, 'Expected a number but got ‘1.4.5.1.4’')
            ])
        })
        it('Should return error when the number is smaller than min', () => {
            const parser = new VectorArgumentParser(2, undefined, false, 0)
            const actual = parser.parse(new StringReader('-.1 .5'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Absolute, -0.1, '-.1'), [0, 3]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Absolute, 0.5, '.5'), [4, 6]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Expected a number greater than or equal to 0 but got -0.1')
            ])
        })
        it('Should return error when the number is smaller than min in an array', () => {
            const parser = new VectorArgumentParser(2, undefined, false, [0, undefined])
            const actual = parser.parse(new StringReader('-.1 .5'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Absolute, -0.1, '-.1'), [0, 3]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Absolute, 0.5, '.5'), [4, 6]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Expected a number greater than or equal to 0 but got -0.1')
            ])
        })
        it('Should return error when the number is larger than max', () => {
            const parser = new VectorArgumentParser(2, undefined, false, undefined, 0)
            const actual = parser.parse(new StringReader('-.1 .5'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Absolute, -0.1, '-.1'), [0, 3]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Absolute, 0.5, '.5'), [4, 6]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 4, end: 6 }, 'Expected a number smaller than or equal to 0 but got 0.5')
            ])
        })
        it('Should return error when the number is larger than max in an array', () => {
            const parser = new VectorArgumentParser(2, undefined, false, undefined, [undefined, 0])
            const actual = parser.parse(new StringReader('-.1 .5'), ctx)
            assert.deepStrictEqual(actual.data[0], $(new VectorElementNode(VectorElementType.Absolute, -0.1, '-.1'), [0, 3]))
            assert.deepStrictEqual(actual.data[1], $(new VectorElementNode(VectorElementType.Absolute, 0.5, '.5'), [4, 6]))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 4, end: 6 }, 'Expected a number smaller than or equal to 0 but got 0.5')
            ])
        })
    })
})
