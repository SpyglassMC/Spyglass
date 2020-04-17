import assert = require('power-assert')
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import EntityArgumentParser from '../../parsers/EntityArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import NumberRangeNode from '../../types/nodes/NumberRangeNode'
import IdentityNode from '../../types/nodes/IdentityNode'
import EntityNode from '../../types/nodes/EntityNode'
import { CompletionItemKind } from 'vscode-languageserver'
import { constructConfig } from '../../types/Config'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import NbtCompoundNode from '../../types/nodes/map/NbtCompoundNode'
import { NodeRange } from '../../types/nodes/ArgumentNode'
import NbtCompoundKeyNode from '../../types/nodes/map/NbtCompoundKeyNode'
import { Keys } from '../../types/nodes/map/MapNode'
import NbtByteNode from '../../types/nodes/nbt/NbtByteNode'
import SelectorArgumentsNode from '../../types/nodes/map/SelectorArgumentMapNode'

describe('EntityArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new EntityArgumentParser('multiple', 'entities')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['Player', '0123', '@e', '@e[type=foo]', 'dd12be42-52a9-4a91-a8a1-11c01849e498'])
        })
    })

    const parsers = new ArgumentParserManager()
    const cache = {
        entities: {
            foo: { def: [], ref: [] },
            bar: { def: [], ref: [], doc: 'The doc of **bar**' }
        },
        'tags/entity_types': {
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
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ parsers, cache })
    })
    describe('parse() Tests', () => {
        it('Should return untolerable error when the input is empty', () => {
            const parser = new EntityArgumentParser('multiple', 'entities')
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new EntityNode())
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'Expected an entity but got nothing', false)
            ])
        })

        describe('For UUIDs', () => {
            it('Should return normal data', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('12345678-1234-1234-1234-1234567890AB'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode('12345678-1234-1234-1234-1234567890AB'))
                assert.deepStrictEqual(actual.errors, [])
            })
        })
        describe('For plain entity names', () => {
            it('Should be greedy for score holders', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('$ASDASD'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode('$ASDASD'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return normal data', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('foo'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode('foo'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should errors when the entity is too long', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', false)
                const actual = parser.parse(new StringReader('12345678901234567'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode('12345678901234567'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError(
                        { start: 0, end: 17 },
                        '‘12345678901234567’ exceeds the max length of an entity, which is 16'
                    )
                ])
            })
            it('Should errors when the score holder is too long', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('12345678901234567890123456789012345678901'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode('12345678901234567890123456789012345678901'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError(
                        { start: 0, end: 41 },
                        '‘12345678901234567890123456789012345678901’ exceeds the max length of a score holder, which is 40'
                    )
                ])
            })
            it('Should return completions', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 0 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader(''), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode())
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
                const actual = parser.parse(new StringReader('foo'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode('foo'))
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
                const actual = parser.parse(new StringReader('qux'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode('qux'))
                assert.deepStrictEqual(actual.cache, {})
            })
        })
        describe('For entity selectors', () => {
            it('Should return data for simple selector', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data for empty-argument selector', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[]'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with simple arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[sort=random,x=1,dx=2.5,limit=1,level=1..,distance=..5,x_rotation=135..-135]'
                const expected = {
                    sort: 'random', x: 1, dx: 2.5, limit: 1,
                    level: new NumberRangeNode('integer', 1),
                    distance: new NumberRangeNode('float', undefined, 5),
                    x_rotation: new NumberRangeNode('float', 135, -135)
                }
                const actual = parser.parse(new StringReader(command), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a', expected as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with empty value', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[gamemode=]'
                const expected = {
                    gamemode: ['']
                }
                const actual = parser.parse(new StringReader(command), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a', expected as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with all kinds of negativable array arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[gamemode=adventure,name=!SPGoding,predicate=spgoding:test/predicate,tag=foo,team=!red,type=#spgoding:mobs,nbt={foo: 1b}]'

                const expectedCompound = new NbtCompoundNode(null)
                expectedCompound[NodeRange] = { start: 113, end: 132 }
                const expectedCompoundKey = new NbtCompoundKeyNode(expectedCompound, 'foo', 'foo', [114, 115, 116])
                expectedCompoundKey[NodeRange] = { start: 114, end: 117 }
                expectedCompound[Keys].foo = expectedCompoundKey
                const expectedByte = new NbtByteNode(expectedCompound, 1, '1')
                expectedByte[NodeRange] = { start: 119, end: 121 }
                expectedCompound.foo = expectedByte
                const expected = {
                    gamemode: ['adventure'],
                    nameNeg: ['SPGoding'],
                    predicate: [new IdentityNode('spgoding', ['test', 'predicate'])],
                    tag: ['foo'],
                    teamNeg: ['red'],
                    type: [new IdentityNode('spgoding', ['mobs'], true)],
                    nbt: [expectedCompound]
                }

                const actual = parser.parse(new StringReader(command), ctx)

                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a', expected as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with the same negativable array arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[gamemode=adventure,gamemode=!creative,gamemode=!spectator]'
                const expected = {
                    gamemode: ['adventure'],
                    gamemodeNeg: ['creative', 'spectator']
                }
                const actual = parser.parse(new StringReader(command), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a', expected as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with ‘scores’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ scores = { foo = 114.. , bar = ..514 } ]'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a',
                    {
                        scores: {
                            foo: new NumberRangeNode('integer', 114),
                            bar: new NumberRangeNode('integer', undefined, 514)
                        }
                    } as any))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with ‘advancements’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ advancements = { spgoding:advancement/a = true , spgoding:advancement/b = { critA = false , critB = true } , spgoding:advancement/c = { } } ]'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a', {
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
            it('Should return completions for variable', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 1 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode())
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
                const actual = parser.parse(new StringReader('@b'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode())
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 1, end: 2 }, 'Unexpected selector variable ‘b’')
                ])
            })
            it('Should return error for unexpected argument key', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[foo=bar]'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
                assert.deepStrictEqual(
                    actual.errors[0],
                    new ParsingError({ start: 3, end: 6 }, 'Expected ‘advancements’, ‘distance’, ‘dx’, ‘dy’, ‘dz’, ‘gamemode’, ‘level’, ‘limit’, ‘name’, ‘nbt’, ‘predicate’, ‘scores’, ‘sort’, ‘tag’, ‘team’, ‘type’, ‘x’, ‘x_rotation’, ‘y’, ‘y_rotation’, or ‘z’ but got ‘foo’')
                )
            })
            it('Should return completions for argument keys', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 3 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[]'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
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
            it('Should return completions for argument keys after comma', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 22 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[gamemode=adventure,]'), ctx)
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments.gamemode = ['adventure']
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a', expectedArguments))
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
                const actual = parser.parse(new StringReader('@a['), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 4 }, 'Expected ‘]’ but got nothing')
                ])
            })
            it('Should return completions for ‘sort’ argument', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 11 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ sort = ]'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'arbitrary' },
                    { label: 'furthest' },
                    { label: 'nearest' },
                    { label: 'random' }
                ])
            })
            it('Should return completions for ‘gamemode’ argument', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 15 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ gamemode = ]'), ctx)
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments.gamemode = ['']
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a', expectedArguments))
                assert.deepStrictEqual(actual.completions, [
                    { label: '!' },
                    { label: 'adventure' },
                    { label: 'creative' },
                    { label: 'spectator' },
                    { label: 'survival' }
                ])
            })
            it('Should return completions for negative ‘gamemode’ argument', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 17 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ gamemode = ! ]'), ctx)
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments.gamemodeNeg = ['']
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a', expectedArguments))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'adventure' },
                    { label: 'creative' },
                    { label: 'spectator' },
                    { label: 'survival' }
                ])
            })
            it('Should return completions for objectives in ‘scores’', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 15 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ scores = { } ]'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'foo' },
                    { label: 'bar' }
                ])
            })
            it('Should return completions for advancements in ‘advancements’', async () => {
                const ctx = await constructContext({ parsers, cache, cursor: 21 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ advancements = { } ]'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
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
                const actual = parser.parse(new StringReader('@a'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'a'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 2 }, 'The selector contains multiple entities')
                ])
            })
            it('Should return multiple-entity error for @r[limit=2]', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@r[limit=2]'), ctx)
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments.limit = 2
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'r', expectedArguments))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 11 }, 'The selector contains multiple entities')
                ])
            })
            it('Should not return multiple-entity error for @s', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@s'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 's'))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should not return multiple-entity error for @e[limit=1]', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@e[limit=1]'), ctx)
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments.limit = 1
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'e', expectedArguments))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return non-player error for @e', () => {
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e'), ctx)
                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'e'))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 2 }, 'The selector contains non-player entities')
                ])
            })
            it('Should return non-player error for @e[type=zombie]', async () => {
                const config = constructConfig({ lint: { omitDefaultNamespace: true } })
                const ctx = await constructContext({ parsers, cache, config })
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e[type=zombie]'), ctx)

                const expectedIdentity = new IdentityNode(undefined, ['zombie'])
                expectedIdentity[NodeRange] = { start: 8, end: 14 }
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments.type = [expectedIdentity]

                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'e', expectedArguments))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 15 }, 'The selector contains non-player entities')
                ])
            })
            it('Should not return non-player error for @e[type=player]', () => {
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e[type=minecraft:player]'), ctx)

                const expectedIdentity = new IdentityNode(undefined, ['player'])
                expectedIdentity[NodeRange] = { start: 8, end: 14 }
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments.type = [expectedIdentity]

                assert.deepStrictEqual(actual.data, new EntityNode(undefined, 'e', expectedArguments))
                assert.deepStrictEqual(actual.errors, [])
            })
        })
    })
})
