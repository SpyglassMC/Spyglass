import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { TagArgumentParser } from '../../parsers/TagArgumentParser'
import { constructConfig } from '../../types/Config'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { assertCompletions } from '../utils.spec'

describe('TagArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new TagArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['foo'])
        })
    })

    const cache = {
        tag: {
            foo: { def: [], ref: [] },
            bar: { doc: 'The doc of **bar**', def: [{ start: 0, end: 0 }], ref: [] }
        }
    }
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ cache })
    })
    describe('parse() Tests', () => {
        it('Should return data', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('expected'), ctx)
            assert(actual.data === 'expected')
        })
        it('Should return completions', async () => {
            const ctx = constructContext({ cache, cursor: 0 })
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, '')
            assertCompletions('', actual.completions,
                [
                    { label: 'foo', t: 'foo' },
                    {
                        label: 'bar',
                        t: 'bar',
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
        it('Should report errors for tag that do not follow the convention', () => {
            const config = constructConfig({ lint: { nameOfTags: ['warning', 'PascalCase'] } })
            const ctx = constructContext({ cache, config })
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 0, end: 3 },
                    "Invalid tag “foo” which doesn't follow “PascalCase” convention",
                    true, DiagnosticSeverity.Warning
                )
            ])
        })
        it('Should not return warning when the strict tag check pass', async () => {
            const config = constructConfig({ lint: { strictTagCheck: ['warning', true] } })
            const ctx = constructContext({ cache, config })
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return warning when the strict tag check fail', async () => {
            const config = constructConfig({ lint: { strictTagCheck: ['warning', true] } })
            const ctx = constructContext({ cache, config })
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('qux'), ctx)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Undefined tag “qux”', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return cache', () => {
            const parser = new TagArgumentParser()
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.cache, {
                tag: {
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
