import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { getNbtCompoundTag, getNbtByteTag } from '../../types/NbtTag'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import EntityArgumentParser from '../../parsers/EntityArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import NumberRange from '../../types/NumberRange'
import Identity from '../../types/Identity'
import Entity from '../../types/Entity'
import { CompletionItemKind } from 'vscode-languageserver'
import { constructConfig } from '../../types/Config'

describe('EntityArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new EntityArgumentParser('multiple', 'entities')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['Player', '0123', '@e', '@e[type=foo]', 'dd12be42-52a9-4a91-a8a1-11c01849e498'])
        })
    })
    describe('parse() Tests', () => {
        const manager = new ArgumentParserManager()
        const cache = {
            entities: {
                foo: { def: [], ref: [] },
                bar: { def: [], ref: [], doc: 'The doc of **bar**' }
            },
            'tags/entityTypes': {
                'spgoding:mobs': { def: [], ref: [] }
            },
            predicates: {
                'spgoding:test/predicate': { def: [], ref: [] }
            },
            objectives: {
                foo: { def: [], ref: [] },
                bar: { def: [], ref: [] }
            },
            advancements: {
                'spgoding:advancement/a': { def: [], ref: [] },
                'spgoding:advancement/b': { def: [], ref: [] },
                'spgoding:advancement/c': { def: [], ref: [] }
            }
        }
        it('Should return untolerable error when the input is empty', () => {
            const parser = new EntityArgumentParser('multiple', 'entities')
            const actual = parser.parse(new StringReader(''), undefined, manager)
            assert.deepStrictEqual(actual.data, new Entity())
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected an entity but got nothing', false)
            ])
        })
        describe('For plain entities', () => {
            it('Should be greedy for score holders', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('$ASDASD'), undefined, manager)
                assert.deepStrictEqual(actual.data, new Entity('$ASDASD'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return normal data', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('foo'), undefined, manager)
                assert.deepStrictEqual(actual.data, new Entity('foo'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should errors when the entity is too long', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', false)
                const actual = parser.parse(new StringReader('12345678901234567'), undefined, manager)
                assert.deepStrictEqual(actual.data, new Entity('12345678901234567'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError(
                        { start: 0, end: 17 },
                        '‘12345678901234567’ exceeds the max length of an entity name, which is 16'
                    )
                ])
            })
            it('Should errors when the score holder is too long', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('12345678901234567890123456789012345678901'), undefined, manager)
                assert.deepStrictEqual(actual.data, new Entity('12345678901234567890123456789012345678901'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError(
                        { start: 0, end: 41 },
                        '‘12345678901234567890123456789012345678901’ exceeds the max length of a score holder name, which is 40'
                    )
                ])
            })
            it('Should return completions', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader(''), 0, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity())
                assert.deepStrictEqual(actual.completions,
                    [
                        { label: 'foo' },
                        {
                            label: 'bar',
                            documentation: {
                                kind: 'markdown',
                                value: 'The doc of **bar**'
                            }
                        },
                        { label: '@a', commitCharacters: ['[', ' '] },
                        { label: '@e', commitCharacters: ['[', ' '] },
                        { label: '@p', commitCharacters: ['[', ' '] },
                        { label: '@r', commitCharacters: ['[', ' '] },
                        { label: '@s', commitCharacters: ['[', ' '] }
                    ]
                )
            })
            it('Should return cache when the entity is a plain name', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('foo'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity('foo'))
                assert.deepStrictEqual(actual.cache, {
                    entities: {
                        foo: {
                            def: [],
                            ref: [{ start: 0, end: 3 }]
                        }
                    }
                })
            })
            it('Should return empty cache when the entity is undefined', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('qux'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity('qux'))
                assert.deepStrictEqual(actual.cache, {})
            })
        })
        describe('For entity selectors', () => {
            it('Should return data for simple selector', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a'), undefined, manager)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data for empty-argument selector', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[]'), undefined, manager)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with simple arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[sort=random,x=1,dx=2.5,limit=1,level=1..,distance=..5]'
                const expected = {
                    sort: 'random', x: 1, dx: 2.5, limit: 1,
                    level: new NumberRange('integer', 1),
                    distance: new NumberRange('float', undefined, 5)
                }
                const actual = parser.parse(new StringReader(command), undefined, manager)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a', expected as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with empty value', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[gamemode=]'
                const expected = {
                    gamemode: ['']
                }
                const actual = parser.parse(new StringReader(command), undefined, manager, undefined, cache)
                assert.deepEqual(actual.data, new Entity(undefined, 'a', expected as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with all kinds of negativable array arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[gamemode=adventure,name=!SPGoding,predicate=spgoding:test/predicate,tag=foo,team=!red,type=#spgoding:mobs,nbt={Item: {Count: 1b}}]'
                const expected = {
                    gamemode: ['adventure'],
                    nameNeg: ['SPGoding'],
                    predicate: [new Identity('spgoding', ['test', 'predicate'])],
                    tag: ['foo'],
                    teamNeg: ['red'],
                    type: [new Identity('spgoding', ['mobs'], true)],
                    nbt: [getNbtCompoundTag({ Item: getNbtCompoundTag({ Count: getNbtByteTag(1) }) })]
                }
                const actual = parser.parse(new StringReader(command), undefined, manager, undefined, cache)
                assert.deepEqual(actual.data, new Entity(undefined, 'a', expected as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with the same negativable array arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[gamemode=adventure,gamemode=!creative,gamemode=!spectator]'
                const expected = {
                    gamemode: ['adventure'],
                    gamemodeNeg: ['creative', 'spectator']
                }
                const actual = parser.parse(new StringReader(command), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a', expected as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with ‘scores’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ scores = { foo = 114.. , bar = ..514 } ]'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a',
                    {
                        scores: {
                            foo: new NumberRange('integer', 114),
                            bar: new NumberRange('integer', undefined, 514)
                        }
                    } as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with ‘advancements’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ advancements = { spgoding:advancement/a = true , spgoding:advancement/b = { critA = false , critB = true } , spgoding:advancement/c = { } } ]'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a', {
                    advancements: {
                        'spgoding:advancement/a': true,
                        'spgoding:advancement/b': {
                            critA: false,
                            critB: true
                        },
                        'spgoding:advancement/c': {}
                    }
                } as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return completions for variable', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@'), 1, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity())
                assert.deepStrictEqual(actual.completions,
                    [
                        { label: 'a', commitCharacters: ['[', ' '] },
                        { label: 'e', commitCharacters: ['[', ' '] },
                        { label: 'p', commitCharacters: ['[', ' '] },
                        { label: 'r', commitCharacters: ['[', ' '] },
                        { label: 's', commitCharacters: ['[', ' '] }
                    ]
                )
            })
            it('Should return error for unexpected variable', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@b'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity())
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 1, end: 2 }, 'unexpected selector variable ‘b’')
                ])
            })
            it('Should return error for unexpected argument key', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[foo=bar]'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
                assert.deepStrictEqual(
                    actual.errors[0],
                    new ParsingError({ start: 3, end: 6 }, 'expected ‘advancements’, ‘distance’, ‘dx’, ‘dy’, ‘dz’, ‘gamemode’, ‘level’, ‘limit’, ‘name’, ‘nbt’, ‘predicate’, ‘scores’, ‘sort’, ‘tag’, ‘team’, ‘type’, ‘x’, ‘x_rotation’, ‘y’, ‘y_rotation’ or ‘z’ but got ‘foo’')
                )
            })
            it('Should return completions for argument keys', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[]'), 3, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
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
            it('Should return completions for argument keys after comma', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[gamemode=adventure,]'), 22, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a', { gamemode: ['adventure'] }))
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
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a['), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 4 }, 'expected ‘]’ but got nothing')
                ])
            })
            it('Should return completions for ‘sort’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ sort = ]'), 11, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'arbitrary' },
                    { label: 'furthest' },
                    { label: 'nearest' },
                    { label: 'random' }
                ])
            })
            it('Should return completions for ‘gamemode’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ gamemode = ]'), 15, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a', { gamemode: [''] }))
                assert.deepStrictEqual(actual.completions, [
                    { label: '!' },
                    { label: 'adventure' },
                    { label: 'creative' },
                    { label: 'spectator' },
                    { label: 'survival' }
                ])
            })
            it('Should return completions for negative ‘gamemode’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ gamemode = ! ]'), 17, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a', { gamemodeNeg: [''] }))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'adventure' },
                    { label: 'creative' },
                    { label: 'spectator' },
                    { label: 'survival' }
                ])
            })
            it('Should return completions for objectives in ‘scores’', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ scores = { } ]'), 15, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'foo' },
                    { label: 'bar' }
                ])
            })
            it('Should return completions for advancements in ‘advancements’', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ advancements = { } ]'), 21, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
                assert.deepStrictEqual(actual.completions, [
                    {
                        label: 'spgoding',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    }
                ])
            })
            it('Should return multiple-entity error for @a', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@a'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'a'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 2 }, 'the selector contains multiple entities')
                ])
            })
            it('Should return multiple-entity error for @r[limit=2]', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@r[limit=2]'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'r', { limit: 2 }))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 11 }, 'the selector contains multiple entities')
                ])
            })
            it('Should not return multiple-entity error for @s', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@s'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 's'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should not return multiple-entity error for @e[limit=1]', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@e[limit=1]'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'e', { limit: 1 }))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return non-player error for @e', () => {
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'e'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 2 }, 'the selector contains non-player entities')
                ])
            })
            it('Should return non-player error for @e[type=zombie]', () => {
                const config = constructConfig({ lint: { omitDefaultNamespace: true } })
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e[type=zombie]'), undefined, manager, config, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'e', { type: [new Identity(undefined, ['zombie'])] }))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 15 }, 'the selector contains non-player entities')
                ])
            })
            it('Should not return non-player error for @e[type=player]', () => {
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e[type=minecraft:player]'), undefined, manager, undefined, cache)
                assert.deepStrictEqual(actual.data, new Entity(undefined, 'e', { type: [new Identity(undefined, ['player'])] }))
                assert.deepStrictEqual(actual.errors, [])
            })
        })
    })
})
