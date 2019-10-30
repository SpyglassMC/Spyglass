import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { getNbtCompoundTag, getNbtByteTag } from '../../types/NbtTag'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import EntityArgumentParser from '../../parsers/EntityArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import NumberRange from '../../types/NumberRange'
import Identity from '../../types/Identity'

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
            },
            'tags/entityTypes': {
                'spgoding:mobs': { def: [], ref: [] }
            },
            predicates: {
                'spgoding:test/predicate': { def: [], ref: [] }
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
                assert.deepStrictEqual(actual.errors, [])
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
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data for empty-argument selector', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[]'), undefined, manager)
                assert.deepStrictEqual(actual.data, { variable: 'a' })
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with simple arguments', () => {
                const parser = new EntityArgumentParser()
                const command = '@a[sort=random,x=1,dx=2.5,limit=1,level=1..,distance=..5]'
                const expected = {
                    sort: 'random', x: 1, dx: 2.5, limit: 1,
                    level: new NumberRange('integer', 1),
                    distance: new NumberRange('float', undefined, 5)
                }
                const actual = parser.parse(new StringReader(command), undefined, manager)
                assert.deepStrictEqual(actual.data, { variable: 'a', arguments: expected })
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with all kinds of negativable array arguments', () => {
                const parser = new EntityArgumentParser()
                const command = '@a[gamemode=adventure,name=!SPGoding,predicate=spgoding:test/predicate,tag=foo,team=!red,type=#spgoding:mobs,nbt={Item: {Count: 1b}}]'
                const expected = {
                    gamemode: ['adventure'],
                    negName: ['SPGoding'],
                    predicate: [new Identity('spgoding', ['test', 'predicate'])],
                    tag: ['foo'],
                    negTeam: ['red'],
                    type: [new Identity('spgoding', ['mobs'], true)],
                    nbt: [getNbtCompoundTag({ Item: getNbtCompoundTag({ Count: getNbtByteTag(1) }) })]
                }
                const actual = parser.parse(new StringReader(command), undefined, manager, undefined, cache)
                assert.deepEqual(actual.data, { variable: 'a', arguments: expected })
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with the same negativable array arguments', () => {
                const parser = new EntityArgumentParser()
                const command = '@a[gamemode=adventure,gamemode=!creative,gamemode=!spectator]'
                const expected = {
                    gamemode: ['adventure'],
                    negGamemode: ['creative', 'spectator']
                }
                const actual = parser.parse(new StringReader(command), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a', arguments: expected })
                assert.deepStrictEqual(actual.errors, [])
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
            it('Should return error for unexpected variable', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@b'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, {})
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 1, end: 2 }, 'unexpected selector variable ‘b’')
                ])
            })
            it('Should return error for unexpected argument key', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[foo=bar]'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a', arguments: {} })
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 6 }, 'unexpected selector argument ‘foo’')
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
                assert.deepStrictEqual(actual.errors, [])
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
            it('Should return completions for negative ‘gamemode’ argument', () => {
                const parser = new EntityArgumentParser()
                const actual = parser.parse(new StringReader('@a[ gamemode = ! ]'), 17, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, { variable: 'a', arguments: {} })
                assert.deepStrictEqual(actual.completions, [
                    { label: 'adventure' },
                    { label: 'creative' },
                    { label: 'spectator' },
                    { label: 'survival' }
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
