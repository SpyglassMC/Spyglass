import * as assert from 'power-assert'
import EntityArgumentParser from '../../parsers/EntityArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'

describe('EntityArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new EntityArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['Player', '0123', '@e', '@e[type=foo]', 'dd12be42-52a9-4a91-a8a1-11c01849e498'])
        })
    })
    describe('parse() Tests', () => {
        const cache = {
            entities: {
                foo: { def: [], ref: [] },
                bar: { def: [{ line: { uri: '', number: 0 }, documentation: 'The doc of **bar**' }], ref: [] }
            }
        }
        it('Should return untolerable error when the input is empty', () => {
            const parser = new EntityArgumentParser()
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(actual.data, {})
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected an entity but got nothing', false)
            ])
        })
        describe('For plain entities', () => {
            it('Should return data', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('SPGoding'))
                assert.deepStrictEqual(actual.data, { plain: 'SPGoding' })
            })
            it('Should return completions', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader(''), 0, undefined, cache)
                assert.deepStrictEqual(actual.data, {})
                assert.deepStrictEqual(actual.completions,
                    [
                        { label: '@' },
                        { label: 'foo' },
                        { label: 'bar', documentation: 'The doc of **bar**' }
                    ]
                )
            })
            it('Should return cache when the entity is already defined', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('foo'), undefined, undefined, cache)
                assert.deepStrictEqual(actual.data, { plain: 'foo' })
                assert.deepStrictEqual(actual.cache, {
                    entities: {
                        foo: {
                            def: [],
                            ref: [{ range: { start: 0, end: 3 } }]
                        }
                    }
                })
            })
            it('Should return empty cache when the entity is undefined', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('qux'), undefined, undefined, cache)
                assert.deepStrictEqual(actual.data, { plain: 'qux' })
                assert.deepStrictEqual(actual.cache, {})
            })
        })
        describe('For entity selectors', () => {
            it('Should return data for simple selector', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a'))
                assert.deepStrictEqual(actual.data, { variable: 'a' })
            })
            it('Should return completions for variable', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@'), 1, undefined, cache)
                assert.deepStrictEqual(actual.data, {})
                assert.deepStrictEqual(actual.completions,
                    [
                        { label: 'a' },
                        { label: 'e' },
                        { label: 'p' },
                        { label: 'r' },
                        { label: 's' }
                    ]
                )
            })
            it('Should return errors for unexpected variable', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@b'), undefined, undefined, cache)
                assert.deepStrictEqual(actual.data, {})
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 1, end: 2 }, 'unexpected selector variable ‘b’')
                ])
            })
            it('Should return completions for argument keys', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[]'), 3, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a' })
                assert.deepStrictEqual(actual.completions, [
                    { label: 'sort' },
                    { label: 'x' },
                    { label: 'y' },
                    { label: 'z' },
                    { label: 'dx' },
                    { label: 'dy' },
                    { label: 'dz' },
                    { label: 'distance' },
                    { label: 'x_rotation' },
                    { label: 'y_rotation' },
                    { label: 'level' },
                    { label: 'limit' },
                    { label: 'tag' },
                    { label: 'team' },
                    { label: 'gamemode' },
                    { label: 'name' },
                    { label: 'type' },
                    { label: 'scores' },
                    { label: 'advancement' },
                    { label: 'nbt' }
                ])
            })
            it('Should return errors for unclosed brackets', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a['), undefined, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a' })
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 4 }, 'expected ‘]’ but got nothing')
                ])
            })
            it('Should return completions for ‘sort’ argument', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[ sort = ]'), 11, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a', arguments: {} })
                assert.deepStrictEqual(actual.completions, [
                    { label: 'arbitrary' },
                    { label: 'furthest' },
                    { label: 'nearest' },
                    { label: 'random' }
                ])
            })
            // it('Should return empty cache when the entity is undefined', () => {
            //     const parser = new EntityArgumentParser()
            //     const actual = parser.parse(new StringReader('qux'), undefined, undefined, cache)
            //     assert.deepStrictEqual(actual.data, { plain: 'qux' })
            //     assert.deepStrictEqual(actual.cache, {})
            // })
        })
    })
})
