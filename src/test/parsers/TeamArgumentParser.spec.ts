import * as assert from 'power-assert'
import TeamArgumentParser from '../../parsers/TeamArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'

describe('TeamArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new TeamArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['foo'])
        })
    })
    describe('parse() Tests', () => {
        const cache = {
            teams: {
                foo: { def: [], ref: [] },
                bar: { def: [{ line: { rel: '', number: 0 }, documentation: 'The doc of **bar**' }], ref: [] }
            }
        }
        it('Should return data', () => {
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader('expected'))
            assert(actual.data === 'expected')
        })
        it('Should return completions', () => {
            const parser = new TeamArgumentParser()
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
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a team but got nothing', false)
            ])
        })
        it('Should not return warning when the strict team check pass', () => {
            const parser = new TeamArgumentParser()
            const config = constructConfig({ lint: { strictTeamheck: true } })
            const actual = parser.parse(new StringReader('foo'), undefined, undefined, config, cache)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return warning when the strict team check fail', () => {
            const parser = new TeamArgumentParser()
            const config = constructConfig({ lint: { strictTeamCheck: true } })
            const actual = parser.parse(new StringReader('qux'), undefined,undefined,  config, cache)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'undefined team ‘qux’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return cache when the team is already defined', () => {
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader('foo'), undefined, undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.cache, {
                teams: {
                    foo: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            })
        })
        it('Should return empty cache when the team is undefined', () => {
            const parser = new TeamArgumentParser()
            const actual = parser.parse(new StringReader('qux'), undefined, undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.cache, {})
        })
    })
})
