import * as assert from 'power-assert'
import TagArgumentParser from '../../parsers/TagArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'

describe('TagArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new TagArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['foo'])
        })
    })
    describe('parse() Tests', () => {
        const cache = {
            tags: {
                foo: { def: [], ref: [] },
                bar: { def: [{ line: { rel: '', number: 0 }, documentation: 'The doc of **bar**' }], ref: [] }
            }
        }
        it('Should return data', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('expected'))
            assert(actual.data === 'expected')
        })
        it('Should return completions', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader(''), 0, undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'foo' },
                    { label: 'bar', documentation: 'The doc of **bar**' }
                ]
            )
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a tag but got nothing', false)
            ])
        })
        it('Should not return warning when the strict tag check pass', () => {
            const parser = new TagArgumentParser()
            const config = constructConfig({ lint: { strictTagCheck: true } })
            const actual = parser.parse(new StringReader('foo'), undefined, undefined, config, cache)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return warning when the strict tag check fail', () => {
            const parser = new TagArgumentParser()
            const config = constructConfig({ lint: { strictTagCheck: true } })
            const actual = parser.parse(new StringReader('qux'), undefined, undefined, config, cache)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'undefined tag ‘qux’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return cache when the tag is already defined', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('foo'), undefined, undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.cache, {
                tags: {
                    foo: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            })
        })
        it('Should return empty cache when the tag is undefined', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('qux'), undefined, undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.cache, {})
        })
    })
})
