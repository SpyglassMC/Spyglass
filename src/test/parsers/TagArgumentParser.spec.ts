import assert = require('power-assert')
import TagArgumentParser from '../../parsers/TagArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

describe('TagArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new TagArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['foo'])
        })
    })

    const cache = {
        tags: {
            foo: { def: [], ref: [] },
            bar: { doc: 'The doc of **bar**', def: [{ start: 0, end: 0 }], ref: [] }
        }
    }
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ cache })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('expected'), ctx)
            assert(actual.data === 'expected')
        })
        it('Should return completions', async () => {
            const ctx = await constructContext({ cache, cursor: 0 })
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'foo' },
                    {
                        label: 'bar',
                        documentation: {
                            kind: 'markdown',
                            value: 'The doc of **bar**'
                        }
                    }
                ]
            )
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'Expected a tag but got nothing', false)
            ])
        })
        it('Should not return warning when the strict tag check pass', async () => {
            const config = constructConfig({ lint: { strictTagCheck: true } })
            const ctx = await constructContext({ cache, config })
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return warning when the strict tag check fail', async () => {
            const config = constructConfig({ lint: { strictTagCheck: true } })
            const ctx = await constructContext({ cache, config })
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('qux'), ctx)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Undefined tag ‘qux’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return cache', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.cache, {
                tags: {
                    foo: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            })
        })
        it('Should return empty cache when the tag is undefined', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('qux'), ctx)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.cache, {})
        })
    })
})
