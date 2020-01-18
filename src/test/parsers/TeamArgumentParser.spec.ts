import assert = require('power-assert')
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import TeamArgumentParser from '../../parsers/TeamArgumentParser'
import { constructConfig } from '../../types/Config'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import { describe, it } from 'mocha'
import { DiagnosticSeverity } from 'vscode-languageserver'

describe('TeamArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new TeamArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['foo'])
        })
    })

    const cache = {
        teams: {
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
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader('expected'), ctx)
            assert(actual.data === 'expected')
        })
        it('Should return completions', async () => {
            const ctx = await constructContext({ cache, cursor: 0 })
            const parser = new TeamArgumentParser()
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
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a team but got nothing', false)
            ])
        })
        it('Should not return warning when the strict team check pass', async () => {
            const config = constructConfig({ lint: { strictTeamheck: true } })
            const ctx = await constructContext({ cache, config, cursor: 0 })
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return warning when the strict team check fail', async () => {
            const parser = new TeamArgumentParser()
            const config = constructConfig({ lint: { strictTeamCheck: true } })
            const ctx = await constructContext({ cache, config })
            const actual = parser.parse(new StringReader('qux'), ctx)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'undefined team ‘qux’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return cache if the team is an reference', () => {
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.cache, {
                teams: {
                    foo: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            })
        })
        it('Should return cache if the team is a definition', () => {
            const parser = new TeamArgumentParser(true)
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.cache, {
                teams: {
                    foo: {
                        def: [{ start: 0, end: 3 }],
                        ref: []
                    }
                }
            })
        })
        it('Should return empty cache when the team is undefined', () => {
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader('qux'), ctx)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.cache, {})
        })
    })
})
