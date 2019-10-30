import * as assert from 'power-assert'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import EntityArgumentParser from '../../parsers/EntityArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'
import NumberRange from '../../types/NumberRange'

describe('EntityArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new EntityArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['Player', '0123', '@e', '@e[type=foo]', 'dd12be42-52a9-4a91-a8a1-11c01849e498'])
        })
    })
    describe('parse() Tests', () => {
        const manager = new ArgumentParserManager()
        const cache = {
            entities: {
                foo: { def: [], ref: [] },
                bar: { def: [{ line: { uri: '', number: 0 }, documentation: 'The doc of **bar**' }], ref: [] }
            }
        }
        it('Should return untolerable error when the input is empty', () => {
            const parser = new EntityArgumentParser()
            const actual = parser.parse(new StringReader(''), undefined, manager)
            assert.deepStrictEqual(actual.data, {})
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected an entity but got nothing', false)
            ])
        })
        describe('For plain entities', () => {
            it('Should return data', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('SPGoding'), undefined, manager)
                assert.deepStrictEqual(actual.data, { plain: 'SPGoding' })
            })
            it('Should return completions', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader(''), 0, manager, undefined, cache)
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
                const actual = parser.parse(new StringReader('foo'), undefined, manager, undefined, cache)
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
                const actual = parser.parse(new StringReader('qux'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, { plain: 'qux' })
                assert.deepStrictEqual(actual.cache, {})
            })
        })
        describe('For entity selectors', () => {
            it('Should return data for simple selector', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a'), undefined, manager)
                assert.deepStrictEqual(actual.data, { variable: 'a' })
            })
            it('Should return data for empty-argument selector', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[]'), undefined, manager)
                assert.deepStrictEqual(actual.data, { variable: 'a' })
            })
            it('Should return data for selector with simple arguments', () => {
                const parser = new EntityArgumentParser()
                const command = '@a[sort=random,x=1,dx=2.5,limit=1,level=1..,distance=..5]'
                const expected = {
                    sort: 'random', x: 1, dx: 2.5, limit: 1,
                    level: new NumberRange('integer', 1),
                    distance: new NumberRange('integer', undefined, 1)
                }
                const actual = parser.parse(new StringReader(command), undefined, manager)
                assert.deepStrictEqual(actual.data, { variable: 'a', arguments: expected })
            })
            it('Should return completions for variable', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@'), 1, manager, undefined, cache)
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
                const actual = parser.parse(new StringReader('@b'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, {})
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 1, end: 2 }, 'unexpected selector variable ‘b’')
                ])
            })
            it('Should return completions for argument keys', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[]'), 3, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a' })
                assert.deepStrictEqual(actual.completions, [
                    { label: 'advancements' },
                    { label: 'distance' },
                    { label: 'dx' },
                    { label: 'dy' },
                    { label: 'dz' },
                    { label: 'gamemode' },
                    { label: 'level' },
                    { label: 'limit' },
                    { label: 'name' },
                    { label: 'nbt' },
                    { label: 'predicate' },
                    { label: 'scores' },
                    { label: 'sort' },
                    { label: 'tag' },
                    { label: 'team' },
                    { label: 'type' },
                    { label: 'x' },
                    { label: 'x_rotation' },
                    { label: 'y' },
                    { label: 'y_rotation' },
                    { label: 'z' }
                ])
            })
            it('Should return errors for unclosed brackets', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a['), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a' })
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 4 }, 'expected ‘]’ but got nothing')
                ])
            })
            it('Should return completions for ‘sort’ argument', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[ sort = ]'), 11, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a', arguments: {} })
                assert.deepStrictEqual(actual.completions, [
                    { label: 'arbitrary' },
                    { label: 'furthest' },
                    { label: 'nearest' },
                    { label: 'random' }
                ])
            })
            it('Should return completions for ‘gamemode’ argument', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[ gamemode = ]'), 15, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a', arguments: {} })
                assert.deepStrictEqual(actual.completions, [
                    { label: '!' },
                    { label: 'adventure' },
                    { label: 'creative' },
                    { label: 'spectator' },
                    { label: 'survival' }
                ])
            })
            // it('Should return completions for negative ‘gamemode’ argument', () => {
            //     const parser = new EntityArgumentParser()
            //     const actual = parser.parse(new StringReader('@a[ gamemode = ! ]'), 17, manager, undefined, cache)
            //     assert.deepStrictEqual(actual.data, { variable: 'a', arguments: {} })
            //     assert.deepStrictEqual(actual.completions, [
            //         { label: 'adventure' },
            //         { label: 'creative' },
            //         { label: 'spectator' },
            //         { label: 'survival' }
            //     ])
            // })
            // it('Should return empty cache when the entity is undefined', () => {
            //     const parser = new EntityArgumentParser()
            //     const actual = parser.parse(new StringReader('qux'), undefined, undefined, cache)
            //     assert.deepStrictEqual(actual.data, { plain: 'qux' })
            //     assert.deepStrictEqual(actual.cache, {})
            // })
        })
    })
})
