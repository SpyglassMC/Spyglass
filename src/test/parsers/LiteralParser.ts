import * as assert from 'power-assert'
import LiteralParser from '../../parsers/LiteralParser'
import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver';
import ParsingError from '../../types/ParsingError';

describe('LiteralParser Tests', () => {
    describe('toString() Tests', () => {
        it('Should return correctly for single literal', () => {
            const parser = new LiteralParser(['foo'])
            const actual = parser.toString()
            assert.strictEqual(actual, 'foo')
        })
        it('Should return correctly for multi literals', () => {
            const parser = new LiteralParser(['foo', 'bar'])
            const actual = parser.toString()
            assert.strictEqual(actual, '(bar|foo)')
        })
    })
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new LiteralParser(['foo', 'bar'])
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['bar', 'foo'])
        })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new LiteralParser(['expected'])
            const actual = parser.parse('actual', 0)
            assert.deepStrictEqual(actual.data, 'actual')
        })
        it('Should return completions for empty input', () => {
            const parser = new LiteralParser(['foo', 'bar'])
            const actual = parser.parse('', 0)
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
        it('Should treat empty string as partial matching', () => {
            const parser = new LiteralParser(['foo', 'bar'])
            const actual = parser.parse('', 0)
            assert.deepStrictEqual(
                actual.errors,
                [new ParsingError({ start: 0, end: 0 }, "expected one of 'bar' and 'foo' but got ''")]
            )
        })
        it('Should return errors when partial matching', () => {
            const parser = new LiteralParser(['foo', 'bar'])
            const actual = parser.parse('F', 0)
            assert.deepStrictEqual(
                actual.errors,
                [new ParsingError({ start: 0, end: 1 }, "expected one of 'bar' and 'foo' but got 'F'")]
            )
        })
        it('Should return errors when nothing matches', () => {
            const parser = new LiteralParser(['foo', 'bar'])
            const actual = parser.parse('spg!', 0)
            assert.deepStrictEqual(
                actual.errors,
                [new ParsingError({ start: 0, end: 4 }, "expected one of 'bar' and 'foo' but got 'spg!'", false)]
            )
        })
    })
})
