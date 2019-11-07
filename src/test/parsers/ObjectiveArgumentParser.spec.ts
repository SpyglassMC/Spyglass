import * as assert from 'power-assert'
import ObjectiveArgumentParser from '../../parsers/ObjectiveArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'

describe('ObjectiveArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ObjectiveArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['objective'])
        })
    })
    describe('parse() Tests', () => {
        const cache = {
            objectives: {
                foo: { def: [], ref: [] },
                bar: { def: [{ line: { rel: '', number: 0 }, documentation: 'The doc of **bar**' }], ref: [] }
            }
        }
        it('Should return data', () => {
            const parser = new ObjectiveArgumentParser()
            const actual = parser.parse(new StringReader('expected'))
            assert(actual.data === 'expected')
        })
        it('Should return completions', () => {
            const parser = new ObjectiveArgumentParser()
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
            const parser = new ObjectiveArgumentParser()
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(actual.data, '')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected an objective but got nothing', false)
            ])
        })
        it('Should return error when the input is too long', () => {
            const parser = new ObjectiveArgumentParser()
            const actual = parser.parse(new StringReader('123456789012345678'))
            assert.deepStrictEqual(actual.data, '123456789012345678')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 18 }, '‘123456789012345678’ exceeds the max length of objective name')
            ])
        })
        it('Should not return warning when the strict objective check pass', () => {
            const parser = new ObjectiveArgumentParser()
            const config = constructConfig({ lint: { strictObjectiveCheck: true } })
            const actual = parser.parse(new StringReader('foo'), undefined, undefined, config, cache)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return warning when the strict objective check fail', () => {
            const parser = new ObjectiveArgumentParser()
            const config = constructConfig({ lint: { strictObjectiveCheck: true } })
            const actual = parser.parse(new StringReader('qux'), undefined, undefined, config, cache)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'undefined objective ‘qux’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return cache when the objective is already defined', () => {
            const parser = new ObjectiveArgumentParser()
            const actual = parser.parse(new StringReader('foo'), undefined, undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, 'foo')
            assert.deepStrictEqual(actual.cache, {
                objectives: {
                    foo: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            })
        })
        it('Should return empty cache when the objective is undefined', () => {
            const parser = new ObjectiveArgumentParser()
            const actual = parser.parse(new StringReader('qux'), undefined, undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, 'qux')
            assert.deepStrictEqual(actual.cache, {})
        })
    })
})
