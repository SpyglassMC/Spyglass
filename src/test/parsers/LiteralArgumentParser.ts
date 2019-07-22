import * as assert from 'power-assert'
import LiteralArgumentParser from '../../parsers/LiteralArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { CompletionItemKind } from 'vscode-languageserver'
import { describe, it } from 'mocha'

describe('LiteralParser Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly for single literal', () => {
            const parser = new LiteralArgumentParser(['foo'])
            const actual = parser.toString()
            assert.strictEqual(actual, 'foo')
        })
        it('Should return correctly for multi literals', () => {
            const parser = new LiteralArgumentParser(['foo', 'bar'])
            const actual = parser.toString()
            assert.strictEqual(actual, '(bar|foo)')
        })
    })
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new LiteralArgumentParser(['foo', 'bar'])
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['bar', 'foo'])
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new LiteralArgumentParser(['expected'])
            const actual = parser.parse(new StringReader('actual'))
            assert.deepStrictEqual(actual.data, 'actual')
        })
        it('Should return completions for empty input', () => {
            const parser = new LiteralArgumentParser(['foo', 'bar'])
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'bar',
                        kind: CompletionItemKind.Text
                    },
                    {
                        label: 'foo',
                        kind: CompletionItemKind.Text
                    }
                ]
            )
        })
        it('Should not return completions for input beginning with space', () => {
            const parser = new LiteralArgumentParser(['foo', 'bar'])
            const actual = parser.parse(new StringReader(' idk'))
            assert.deepStrictEqual(actual.completions, undefined)
        })
        it('Should treat empty string as partial matching', () => {
            const parser = new LiteralArgumentParser(['foo', 'bar'])
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(
                actual.errors,
                [new ParsingError({ start: 0, end: 0 }, "expected one of `bar` and `foo` but got ''")]
            )
        })
        it('Should return errors when partial matching', () => {
            const parser = new LiteralArgumentParser(['foo', 'bar'])
            const actual = parser.parse(new StringReader('F'))
            assert.deepStrictEqual(
                actual.errors,
                [new ParsingError({ start: 0, end: 1 }, "expected one of `bar` and `foo` but got 'F'")]
            )
        })
        it('Should return errors when nothing matches', () => {
            const parser = new LiteralArgumentParser(['foo', 'bar'])
            const actual = parser.parse(new StringReader('spg '))
            assert.deepStrictEqual(
                actual.errors,
                [new ParsingError({ start: 0, end: 3 }, "expected one of `bar` and `foo` but got 'spg'", false)]
            )
        })
    })
})
