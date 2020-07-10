import assert = require('power-assert')
import { describe, it } from 'mocha'
import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { NodeRange } from '../../nodes/ArgumentNode'
import { EntityNode } from '../../nodes/EntityNode'
import { IdentityNode } from '../../nodes/IdentityNode'
import { Keys, UnsortedKeys } from '../../nodes/MapNode'
import { NbtCompoundNode } from '../../nodes/NbtCompoundNode'
import { NumberNode } from '../../nodes/NumberNode'
import { NumberRangeNode } from '../../nodes/NumberRangeNode'
import { SelectorAdvancementsNode, SelectorArgumentsNode, SelectorCriteriaNode, SelectorScoresNode } from '../../nodes/SelectorArgumentsNode'
import { StringNode } from '../../nodes/StringNode'
import { EntityArgumentParser, getNbtdocRegistryId } from '../../parsers/EntityArgumentParser'
import { constructConfig } from '../../types/Config'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ErrorCode, ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { $ } from '../utils.spec'

describe('EntityArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new EntityArgumentParser('multiple', 'entities')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['Player', '0123', '@e', '@e[type=foo]', 'dd12be42-52a9-4a91-a8a1-11c01849e498'])
        })
    })

    const cache = {
        entity: {
            foo: { def: [], ref: [] },
            bar: { def: [], ref: [], doc: 'The doc of **bar**' }
        },
        score_holder: {
            '#holder': { def: [], ref: [] }
        },
        'tag/entity_type': {
            'spgoding:mobs': { def: [], ref: [] }
        },
        predicate: {
            'spgoding:test/predicate': { def: [], ref: [] }
        },
        objective: {
            foo: { def: [], ref: [] },
            bar: { def: [], ref: [] }
        },
        advancement: {
            'spgoding:advancement/a': { def: [], ref: [] },
            'spgoding:advancement/b': { def: [], ref: [] },
            'spgoding:advancement/c': { def: [], ref: [] }
        }
    }
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ cache })
    })
    describe('parse() Tests', () => {
        it('Should return untolerable error when the input is empty', () => {
            const parser = new EntityArgumentParser('multiple', 'entities')
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'Expected an entity but got nothing', false)
            ])
        })

        describe('For UUIDs', () => {
            it('Should return normal data', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('12345678-1234-1234-1234-1234567890AB'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode('12345678-1234-1234-1234-1234567890AB'), [0, 36]))
                assert.deepStrictEqual(actual.errors, [])
            })
        })
        describe('For plain entity names', () => {
            it('Should be greedy for score holders', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('$ASDASD'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode('$ASDASD'), [0, 7]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return normal data', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader('foo'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode('foo'), [0, 3]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should errors when the entity is too long', () => {
                const parser = new EntityArgumentParser('multiple', 'entities', false)
                const actual = parser.parse(new StringReader('12345678901234567'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode('12345678901234567'), [0, 17]))
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
                assert.deepStrictEqual(actual.data, $(new EntityNode('12345678901234567890123456789012345678901'), [0, 41]))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError(
                        { start: 0, end: 41 },
                        '‘12345678901234567890123456789012345678901’ exceeds the max length of a score holder, which is 40'
                    )
                ])
            })
            it('Should return completions', async () => {
                const ctx = constructContext({ cache, cursor: 0 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader(''), ctx)
                assert.deepStrictEqual(actual.completions, [
                    { label: 'foo' },
                    {
                        label: 'bar',
                        documentation: { kind: 'markdown', value: 'The doc of **bar**' }
                    },
                    { label: '@a' },
                    { label: '@e' },
                    { label: '@p' },
                    { label: '@r' },
                    { label: '@s' }
                ])
            })
            it('Should return completions for score holders', async () => {
                const ctx = constructContext({ cache, cursor: 0 })
                const parser = new EntityArgumentParser('multiple', 'entities', true)
                const actual = parser.parse(new StringReader(''), ctx)
                assert.deepStrictEqual(actual.completions, [
                    { label: 'foo' },
                    {
                        label: 'bar',
                        documentation: { kind: 'markdown', value: 'The doc of **bar**' }
                    },
                    { label: '#holder' },
                    { label: '@a' },
                    { label: '@e' },
                    { label: '@p' },
                    { label: '@r' },
                    { label: '@s' }
                ])
            })
            it('Should return cache when the entity is a plain name', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('foo'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode('foo'), [0, 3]))
                assert.deepStrictEqual(actual.cache, {
                    entity: {
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
                assert.deepStrictEqual(actual.data, $(new EntityNode('qux'), [0, 3]))
                assert.deepStrictEqual(actual.cache, {})
            })
        })
        describe('For entity selectors', () => {
            it('Should return data for simple selector', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'a'), [0, 2]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data for empty-argument selector', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[]'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'a',
                    $(new SelectorArgumentsNode(), [2, 4], {})
                ), [0, 4]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with simple arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[sort=random,x=1,dx=2.5,limit=1,level=1..,distance=..5,x_rotation=135..-135]'
                const expected = $(new SelectorArgumentsNode(), [2, 78], {
                    sort: 'random',
                    x: $(new NumberNode(1, '1'), [17, 18]),
                    dx: $(new NumberNode(2.5, '2.5'), [22, 25]),
                    limit: $(new NumberNode(1, '1'), [32, 33]),
                    level: $(new NumberRangeNode('integer', $(new NumberNode(1, '1'), [40, 41])), [40, 43]),
                    distance: $(new NumberRangeNode('float', undefined, $(new NumberNode(5, '5'), [55, 56])), [53, 56]),
                    x_rotation: $(new NumberRangeNode('float', $(new NumberNode(135, '135'), [68, 71]), $(new NumberNode(-135, '-135'), [73, 77])), [68, 77]),
                    [Keys]: {
                        sort: $(new StringNode('sort', 'sort', { start: 3 }), [3, 7]),
                        x: $(new StringNode('x', 'x', { start: 15 }), [15, 16]),
                        dx: $(new StringNode('dx', 'dx', { start: 19 }), [19, 21]),
                        limit: $(new StringNode('limit', 'limit', { start: 26 }), [26, 31]),
                        level: $(new StringNode('level', 'level', { start: 34 }), [34, 39]),
                        distance: $(new StringNode('distance', 'distance', { start: 44 }), [44, 52]),
                        x_rotation: $(new StringNode('x_rotation', 'x_rotation', { start: 57 }), [57, 67])
                    },
                    [UnsortedKeys]: ['sort', 'x', 'dx', 'limit', 'level', 'distance', 'x_rotation']
                })
                const actual = parser.parse(new StringReader(command), ctx)

                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'a', expected), [0, 78]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with empty value', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const command = '@a[gamemode=]'
                const expected = $(new SelectorArgumentsNode(), [2, 13], {
                    gamemode: [''],
                    [Keys]: {
                        gamemode: $(new StringNode('gamemode', 'gamemode', { start: 3 }), [3, 11])
                    },
                    [UnsortedKeys]: ['gamemode']
                })
                const actual = parser.parse(new StringReader(command), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'a', expected), [0, 13]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with all kinds of negativable array arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const reader = new StringReader('@e[gamemode=adventure,name=!SPGoding,predicate=spgoding:test/predicate,tag=foo,team=!red,type=#spgoding:mobs,nbt={}]')

                const expectedCompound = new NbtCompoundNode(null)
                expectedCompound[NodeRange] = { start: 113, end: 115 }
                const expected = $(new SelectorArgumentsNode(), [2, 116], {
                    gamemode: ['adventure'],
                    nameNeg: [$(new StringNode('SPGoding', 'SPGoding', { start: 28 }), [28, 36])],
                    predicate: [$(new IdentityNode('spgoding', ['test', 'predicate']), [47, 70])],
                    tag: ['foo'],
                    teamNeg: ['red'],
                    type: [$(new IdentityNode('spgoding', ['mobs'], true), [94, 108])],
                    nbt: [expectedCompound],
                    [Keys]: {
                        gamemode: $(new StringNode('gamemode', 'gamemode', { start: 3 }), [3, 11]),
                        name: $(new StringNode('name', 'name', { start: 22 }), [22, 26]),
                        predicate: $(new StringNode('predicate', 'predicate', { start: 37 }), [37, 46]),
                        tag: $(new StringNode('tag', 'tag', { start: 71 }), [71, 74]),
                        team: $(new StringNode('team', 'team', { start: 79 }), [79, 83]),
                        type: $(new StringNode('type', 'type', { start: 89 }), [89, 93]),
                        nbt: $(new StringNode('nbt', 'nbt', { start: 109 }), [109, 112]),
                    },
                    [UnsortedKeys]: ['gamemode', 'nameNeg', 'predicate', 'tag', 'teamNeg', 'type', 'nbt']
                })

                const actual = parser.parse(reader, ctx)

                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'e', expected), [0, 116]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with the same negativable array arguments', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const reader = new StringReader('@a[gamemode=adventure,gamemode=!creative,gamemode=!spectator]')
                const actual = parser.parse(reader, ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'a', $(new SelectorArgumentsNode(), [2, 61], {
                    gamemode: ['adventure'],
                    gamemodeNeg: ['creative', 'spectator'],
                    [Keys]: {
                        gamemode: $(new StringNode('gamemode', 'gamemode', { start: 41 }), [41, 49])
                    },
                    [UnsortedKeys]: ['gamemode', 'gamemodeNeg', 'gamemodeNeg']
                })), [0, 61]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with ‘scores’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ scores = { foo = 123.. , bar = ..456 } ]'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'a', $(new SelectorArgumentsNode(), [2, 44], {
                    scores: $(new SelectorScoresNode(), [13, 42], {
                        foo: $(new NumberRangeNode('integer', $(new NumberNode(123, '123'), [21, 24])), [21, 26]),
                        bar: $(new NumberRangeNode('integer', undefined, $(new NumberNode(456, '456'), [37, 40])), [35, 40]),
                        [UnsortedKeys]: ['foo', 'bar']
                    }),
                    [Keys]: {
                        scores: $(new StringNode('scores', 'scores', { start: 4 }), [4, 10])
                    },
                    [UnsortedKeys]: ['scores']
                })), [0, 44]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return data with ‘advancements’ argument', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ advancements = { spgoding:advancement/a = true , spgoding:advancement/b = { critA = false , critB = true } , spgoding:advancement/c = { } } ]'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'a', $(new SelectorArgumentsNode(), [2, 145], {
                    advancements: $(new SelectorAdvancementsNode(), [19, 143], {
                        'spgoding:advancement/a': true,
                        'spgoding:advancement/b': $(new SelectorCriteriaNode(), [78, 110], {
                            critA: false,
                            critB: true,
                            [Keys]: {
                                'critA': $(new StringNode('critA', 'critA', { start: 80 }), [80, 85]),
                                'critB': $(new StringNode('critB', 'critB', { start: 96 }), [96, 101])
                            },
                            [UnsortedKeys]: ['critA', 'critB']
                        }),
                        'spgoding:advancement/c': $(new SelectorCriteriaNode(), [138, 141]),
                        [Keys]: {
                            'spgoding:advancement/a': $(new IdentityNode('spgoding', ['advancement', 'a']), [21, 43]),
                            'spgoding:advancement/b': $(new IdentityNode('spgoding', ['advancement', 'b']), [53, 75]),
                            'spgoding:advancement/c': $(new IdentityNode('spgoding', ['advancement', 'c']), [113, 135])
                        },
                        [UnsortedKeys]: ['spgoding:advancement/a', 'spgoding:advancement/b', 'spgoding:advancement/c']
                    }),
                    [Keys]: {
                        advancements: $(new StringNode('advancements', 'advancements', { start: 4 }), [4, 16])
                    },
                    [UnsortedKeys]: ['advancements']
                })), [0, 145]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return completions for variable', async () => {
                const ctx = constructContext({ cache, cursor: 1 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@'), ctx)
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
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@b'), ctx)
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 1, end: 2 }, 'Unexpected selector variable ‘b’')
                ])
            })
            it('Should return error for unexpected argument key', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@e[foo=bar]'), ctx)
                assert.deepStrictEqual(
                    actual.errors[0],
                    new ParsingError({ start: 3, end: 6 }, 'Expected ‘advancements’, ‘distance’, ‘dx’, ‘dy’, ‘dz’, ‘gamemode’, ‘level’, ‘limit’, ‘name’, ‘nbt’, ‘predicate’, ‘scores’, ‘sort’, ‘tag’, ‘team’, ‘type’, ‘x’, ‘x_rotation’, ‘y’, ‘y_rotation’, or ‘z’ but got ‘foo’')
                )
            })
            it('Should return error for "type" of @a', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[type=bee]'), ctx)
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 7 }, 'Expected ‘advancements’, ‘distance’, ‘dx’, ‘dy’, ‘dz’, ‘gamemode’, ‘level’, ‘limit’, ‘name’, ‘nbt’, ‘predicate’, ‘scores’, ‘sort’, ‘tag’, ‘team’, ‘x’, ‘x_rotation’, ‘y’, ‘y_rotation’, or ‘z’ but got ‘type’')
                ])
            })
            it('Should return error for "type" of @p', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@p[type=bee]'), ctx)
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 7 }, 'Expected ‘advancements’, ‘distance’, ‘dx’, ‘dy’, ‘dz’, ‘gamemode’, ‘level’, ‘limit’, ‘name’, ‘nbt’, ‘predicate’, ‘scores’, ‘sort’, ‘tag’, ‘team’, ‘x’, ‘x_rotation’, ‘y’, ‘y_rotation’, or ‘z’ but got ‘type’')
                ])
            })
            it('Should return error for "type" of @r', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@r[type=bee]'), ctx)
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 7 }, 'Expected ‘advancements’, ‘distance’, ‘dx’, ‘dy’, ‘dz’, ‘gamemode’, ‘level’, ‘limit’, ‘name’, ‘nbt’, ‘predicate’, ‘scores’, ‘sort’, ‘tag’, ‘team’, ‘x’, ‘x_rotation’, ‘y’, ‘y_rotation’, or ‘z’ but got ‘type’')
                ])
            })
            it('Should return error for "limit" of @s', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@s[limit=1]'), ctx)
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 8 }, 'Expected ‘advancements’, ‘distance’, ‘dx’, ‘dy’, ‘dz’, ‘gamemode’, ‘level’, ‘name’, ‘nbt’, ‘predicate’, ‘scores’, ‘tag’, ‘team’, ‘type’, ‘x’, ‘x_rotation’, ‘y’, ‘y_rotation’, or ‘z’ but got ‘limit’')
                ])
            })
            it('Should return completions for argument keys', async () => {
                const ctx = constructContext({ cache, cursor: 3 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@e[]'), ctx)
                assert.deepStrictEqual(actual.data, $(
                    new EntityNode(undefined, 'e', $(
                        new SelectorArgumentsNode(), [2, 4]
                    )),
                    [0, 4]
                ))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'advancements', insertText: 'advancements' },
                    { label: 'distance', insertText: 'distance' },
                    { label: 'dx', insertText: 'dx' },
                    { label: 'dy', insertText: 'dy' },
                    { label: 'dz', insertText: 'dz' },
                    { label: 'gamemode', insertText: 'gamemode' },
                    { label: 'level', insertText: 'level' },
                    { label: 'limit', insertText: 'limit' },
                    { label: 'name', insertText: 'name' },
                    { label: 'nbt', insertText: 'nbt' },
                    { label: 'predicate', insertText: 'predicate' },
                    { label: 'scores', insertText: 'scores' },
                    { label: 'sort', insertText: 'sort' },
                    { label: 'tag', insertText: 'tag' },
                    { label: 'team', insertText: 'team' },
                    { label: 'type', insertText: 'type' },
                    { label: 'x', insertText: 'x' },
                    { label: 'x_rotation', insertText: 'x_rotation' },
                    { label: 'y', insertText: 'y' },
                    { label: 'y_rotation', insertText: 'y_rotation' },
                    { label: 'z', insertText: 'z' }
                ])
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should omit certain keys in completions for @s selectors', async () => {
                const ctx = constructContext({ cache, cursor: 3 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@s[]'), ctx)
                assert.deepStrictEqual(actual.data, $(
                    new EntityNode(undefined, 's', $(
                        new SelectorArgumentsNode(), [2, 4]
                    )),
                    [0, 4]
                ))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'advancements', insertText: 'advancements' },
                    { label: 'distance', insertText: 'distance' },
                    { label: 'dx', insertText: 'dx' },
                    { label: 'dy', insertText: 'dy' },
                    { label: 'dz', insertText: 'dz' },
                    { label: 'gamemode', insertText: 'gamemode' },
                    { label: 'level', insertText: 'level' },
                    { label: 'name', insertText: 'name' },
                    { label: 'nbt', insertText: 'nbt' },
                    { label: 'predicate', insertText: 'predicate' },
                    { label: 'scores', insertText: 'scores' },
                    { label: 'tag', insertText: 'tag' },
                    { label: 'team', insertText: 'team' },
                    { label: 'type', insertText: 'type' },
                    { label: 'x', insertText: 'x' },
                    { label: 'x_rotation', insertText: 'x_rotation' },
                    { label: 'y', insertText: 'y' },
                    { label: 'y_rotation', insertText: 'y_rotation' },
                    { label: 'z', insertText: 'z' }
                ])
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return completions for argument keys after comma', async () => {
                const ctx = constructContext({ cache, cursor: 22 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@e[gamemode=adventure,]'), ctx)
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments[NodeRange] = { start: 2, end: 23 }
                expectedArguments.gamemode = ['adventure']
                expectedArguments[Keys].gamemode = $(new StringNode('gamemode', 'gamemode', { start: 3 }), [3, 11])
                expectedArguments[UnsortedKeys].push('gamemode')

                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'e', expectedArguments), [0, 23]))
                assert.deepStrictEqual(actual.completions, [
                    { label: 'advancements', insertText: 'advancements' },
                    { label: 'distance', insertText: 'distance' },
                    { label: 'dx', insertText: 'dx' },
                    { label: 'dy', insertText: 'dy' },
                    { label: 'dz', insertText: 'dz' },
                    { label: 'gamemode', insertText: 'gamemode' },
                    { label: 'level', insertText: 'level' },
                    { label: 'limit', insertText: 'limit' },
                    { label: 'name', insertText: 'name' },
                    { label: 'nbt', insertText: 'nbt' },
                    { label: 'predicate', insertText: 'predicate' },
                    { label: 'scores', insertText: 'scores' },
                    { label: 'sort', insertText: 'sort' },
                    { label: 'tag', insertText: 'tag' },
                    { label: 'team', insertText: 'team' },
                    { label: 'type', insertText: 'type' },
                    { label: 'x', insertText: 'x' },
                    { label: 'x_rotation', insertText: 'x_rotation' },
                    { label: 'y', insertText: 'y' },
                    { label: 'y_rotation', insertText: 'y_rotation' },
                    { label: 'z', insertText: 'z' }
                ])
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return errors for unclosed brackets', () => {
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a['), ctx)
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 3, end: 4 }, 'Expected ‘]’ but got nothing')
                ])
            })
            it('Should return completions for ‘sort’ argument', async () => {
                const ctx = constructContext({ cache, cursor: 11 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ sort = ]'), ctx)
                assert.deepStrictEqual(actual.completions, [
                    { label: 'arbitrary' },
                    { label: 'furthest' },
                    { label: 'nearest' },
                    { label: 'random' }
                ])
            })
            it('Should return completions for ‘gamemode’ argument', async () => {
                const ctx = constructContext({ cache, cursor: 15 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ gamemode = ]'), ctx)
                assert.deepStrictEqual(actual.completions, [
                    { label: '!' },
                    { label: 'adventure' },
                    { label: 'creative' },
                    { label: 'spectator' },
                    { label: 'survival' }
                ])
            })
            it('Should return completions for negative ‘gamemode’ argument', async () => {
                const ctx = constructContext({ cache, cursor: 17 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ gamemode = ! ]'), ctx)
                assert.deepStrictEqual(actual.completions, [
                    { label: 'adventure' },
                    { label: 'creative' },
                    { label: 'spectator' },
                    { label: 'survival' }
                ])
            })
            it('Should return completions for objectives in ‘scores’', async () => {
                const ctx = constructContext({ cache, cursor: 15 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ scores = { } ]'), ctx)
                assert.deepStrictEqual(actual.completions, [
                    { label: 'foo' },
                    { label: 'bar' }
                ])
            })
            it('Should return completions for advancements in ‘advancements’', async () => {
                const config = constructConfig({ env: { dependsOnVanilla: false } })
                const ctx = constructContext({ config, cache, cursor: 21 })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[ advancements = { } ]'), ctx)
                assert.deepStrictEqual(actual.completions, [
                    {
                        label: 'spgoding',
                        kind: CompletionItemKind.Module
                    }
                ])
            })
            it('Should return multiple-entity error for @a', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@a'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'a'), [0, 2]))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 2 }, 'The selector contains multiple entities')
                ])
            })
            it('Should return multiple-entity error for @r[limit=2]', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@r[limit=2]'), ctx)
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments[NodeRange] = { start: 2, end: 11 }
                expectedArguments.limit = $(new NumberNode(2, '2'), [9, 10])
                expectedArguments[Keys].limit = $(new StringNode('limit', 'limit', { start: 3 }), [3, 8])
                expectedArguments[UnsortedKeys].push('limit')
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'r', expectedArguments), [0, 11]))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 11 }, 'The selector contains multiple entities')
                ])
            })
            it('Should not return multiple-entity error for @s', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@s'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 's'), [0, 2]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should not return multiple-entity error for @e[limit=1]', () => {
                const parser = new EntityArgumentParser('single', 'entities')
                const actual = parser.parse(new StringReader('@e[limit=1]'), ctx)
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments[NodeRange] = { start: 2, end: 11 }
                expectedArguments.limit = $(new NumberNode(1, '1'), [9, 10])
                expectedArguments[Keys].limit = $(new StringNode('limit', 'limit', { start: 3 }), [3, 8])
                expectedArguments[UnsortedKeys].push('limit')
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'e', expectedArguments), [0, 11]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return non-player error for @e', () => {
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e'), ctx)
                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'e'), [0, 2]))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 2 }, 'The selector contains non-player entities')
                ])
            })
            it('Should return non-player error for @e[type=zombie]', async () => {
                const config = constructConfig({ lint: { idOmitDefaultNamespace: ['warning', true] } })
                const ctx = constructContext({ cache, config })
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e[type=zombie]'), ctx)

                const expectedIdentity = new IdentityNode(undefined, ['zombie'])
                expectedIdentity[NodeRange] = { start: 8, end: 14 }
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments[NodeRange] = { start: 2, end: 15 }
                expectedArguments.type = [expectedIdentity]
                expectedArguments[Keys].type = $(new StringNode('type', 'type', { start: 3 }), [3, 7])
                expectedArguments[UnsortedKeys].push('type')

                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'e', expectedArguments), [0, 15]))
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError({ start: 0, end: 15 }, 'The selector contains non-player entities')
                ])
            })
            it('Should not return non-player error for @e[type=player]', () => {
                const parser = new EntityArgumentParser('multiple', 'players')
                const actual = parser.parse(new StringReader('@e[type=minecraft:player]'), ctx)

                const expectedIdentity = new IdentityNode('minecraft', ['player'])
                expectedIdentity[NodeRange] = { start: 8, end: 24 }
                const expectedArguments = new SelectorArgumentsNode()
                expectedArguments[NodeRange] = { start: 2, end: 25 }
                expectedArguments.type = [expectedIdentity]
                expectedArguments[Keys].type = $(new StringNode('type', 'type', { start: 3 }), [3, 7])
                expectedArguments[UnsortedKeys].push('type')

                assert.deepStrictEqual(actual.data, $(new EntityNode(undefined, 'e', expectedArguments), [0, 25]))
                assert.deepStrictEqual(actual.errors, [])
            })
            it('Should return error for unsorted keys', async () => {
                const config = constructConfig({ lint: { selectorSortKeys: ['warning', ['tagNeg', 'tag']] } })
                const ctx = constructContext({ config, cache })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[tag=foo,tag=!bar]'), ctx)
                assert.deepStrictEqual(actual.errors, [
                    new ParsingError(
                        { start: 2, end: 20 },
                        'Unsorted keys (rule: ‘datapack.lint.selectorSortKeys’)',
                        undefined, DiagnosticSeverity.Warning,
                        ErrorCode.SelectorSortKeys
                    )
                ])
            })
            it('Should not return error when the keys are already sorted', async () => {
                const config = constructConfig({ lint: { selectorSortKeys: ['warning', ['tag', 'tagNeg']] } })
                const ctx = constructContext({ config, cache })
                const parser = new EntityArgumentParser('multiple', 'entities')
                const actual = parser.parse(new StringReader('@a[tag=foo,tag=!bar]'), ctx)
                assert.deepStrictEqual(actual.errors, [])
            })
        })
    })
    describe('getNbtdocRegistryId() Tests', () => {
        it('Should return the respective id', () => {
            const id = new IdentityNode('minecraft', ['spgoding'])
            const argument = new SelectorArgumentsNode()
            argument.type = [id]
            const entity = new EntityNode(undefined, 'e', argument)
            const actual = getNbtdocRegistryId(entity)
            assert(actual === 'minecraft:spgoding')
        })
        it('Should return minecraft:player for @a', () => {
            const entity = new EntityNode(undefined, 'a', new SelectorArgumentsNode())
            const actual = getNbtdocRegistryId(entity)
            assert(actual === 'minecraft:player')
        })
        it('Should return null when there is no type', () => {
            const argument = new SelectorArgumentsNode()
            const entity = new EntityNode(undefined, 'e', argument)
            const actual = getNbtdocRegistryId(entity)
            assert(actual === null)
        })
        it('Should return null when the type is empty', () => {
            const argument = new SelectorArgumentsNode()
            argument.type = []
            const entity = new EntityNode(undefined, 'e', argument)
            const actual = getNbtdocRegistryId(entity)
            assert(actual === null)
        })
        it('Should return null when the first type is a tag', () => {
            const id = new IdentityNode('minecraft', ['spgoding'], true)
            const argument = new SelectorArgumentsNode()
            argument.type = [id]
            const entity = new EntityNode(undefined, 'e', argument)
            const actual = getNbtdocRegistryId(entity)
            assert(actual === null)
        })
    })
})
