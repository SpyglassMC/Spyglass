import assert = require('power-assert')
import { describe, it } from 'mocha'
import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { BlockNode } from '../../nodes/BlockNode'
import { BlockStateNode } from '../../nodes/BlockStateNode'
import { IdentityNode } from '../../nodes/IdentityNode'
import { Keys, UnsortedKeys } from '../../nodes/MapNode'
import { NbtByteNode } from '../../nodes/NbtByteNode'
import { NbtCompoundKeyNode } from '../../nodes/NbtCompoundKeyNode'
import { NbtCompoundNode } from '../../nodes/NbtCompoundNode'
import { NbtStringNode } from '../../nodes/NbtStringNode'
import { BlockArgumentParser } from '../../parsers/BlockArgumentParser'
import { ClientCache } from '../../types/ClientCache'
import { constructConfig } from '../../types/Config'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ErrorCode, ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { $, assertCompletions } from '../utils.spec'

describe('BlockArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new BlockArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['stone', 'minecraft:stone', 'stone[foo=bar]', 'stone{bar:baz}'])
        })
    })

    const blocks = {
        'minecraft:stone': {
            properties: {
                snowy: ['true', 'false'],
                age: ['0', '1', '2', '3']
            },
            states: [{
                id: 0,
                properties: {}
            }]
        },
        'minecraft:grass_block': {
            states: [{
                id: 1,
                properties: {}
            }]
        }
    }
    const registries = {
        'minecraft:block': {
            protocol_id: 0,
            entries: {
                'minecraft:stone': { protocol_id: 0 },
                'minecraft:grass_block': { protocol_id: 1 }
            }
        }
    }
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ blockDefinition: blocks, registry: registries })
    })
    describe('parse() Tests', () => {
        it('Should return data without states or tag', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], undefined, 'minecraft:block'), { start: 0, end: 15 })
            ), { start: 0, end: 15 }))
        })
        it('Should return data with empty states', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[]'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], undefined, 'minecraft:block'), { start: 0, end: 15 }),
                $(new BlockStateNode(), [15, 17])
            ), { start: 0, end: 17 }))
        })
        it('Should return data with single state', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true ]'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], undefined, 'minecraft:block'), { start: 0, end: 15 }),
                $(new BlockStateNode(), { start: 15, end: 31 }, {
                    snowy: 'true',
                    [UnsortedKeys]: ['snowy']
                })
            ), { start: 0, end: 31 }))
        })
        it('Should return data with multiple states', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true , age = 3 ]'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], undefined, 'minecraft:block'), { start: 0, end: 15 }),
                $(new BlockStateNode(), { start: 15, end: 41 }, {
                    snowy: 'true',
                    age: '3',
                    [UnsortedKeys]: ['snowy', 'age']
                })
            ), { start: 0, end: 41 }))
        })
        it('Should return data with NBT', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone{ foo : "bar" }'), ctx)
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], undefined, 'minecraft:block'), [0, 15]),
                undefined,
                $(new NbtCompoundNode(null), [15, 30], v => $(v, {
                    [Keys]: { foo: $(new NbtCompoundKeyNode(v, 'foo', 'foo', { start: 17 }), [17, 20]) },
                    foo: $(new NbtStringNode(v, 'bar', '"bar"', { start: 24 }), [23, 28]),
                    [UnsortedKeys]: ['foo']
                }))
            ), [0, 30]))
        })
        it('Should return data with both states and NBT', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true , age = 2 ]{ foo : 1b }'), ctx)
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], undefined, 'minecraft:block'), [0, 15]),
                $(new BlockStateNode(), [15, 41], {
                    snowy: 'true',
                    age: '2',
                    [UnsortedKeys]: ['snowy', 'age']
                }),
                $(new NbtCompoundNode(null), [41, 53], v => $(v, {
                    [Keys]: { foo: $(new NbtCompoundKeyNode(v, 'foo', 'foo', { start: 43 }), [43, 46]) },
                    foo: $(new NbtByteNode(v, 1, '1'), [49, 51]),
                    [UnsortedKeys]: ['foo']
                }))
            ), [0, 53]))
        })
        it('Should not validate NBT of block tags #437', () => {
            const parser = new BlockArgumentParser(true)
            const actual = parser.parse(new StringReader('#minecraft:test{}'), ctx)
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return completions at the beginning of input', async () => {
            const parser = new BlockArgumentParser(false)
            const config = constructConfig({ lint: { idOmitDefaultNamespace: null } })
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, config, cursor: 0 })
            const actual = parser.parse(new StringReader(''), ctx)
            assertCompletions('', actual.completions, [
                {
                    label: 'minecraft',
                    kind: CompletionItemKind.Module,
                    t: 'minecraft'
                },
                {
                    label: 'stone',
                    kind: CompletionItemKind.Field,
                    t: 'stone'
                },
                {
                    label: 'grass_block',
                    kind: CompletionItemKind.Field,
                    t: 'grass_block'
                }
            ])
        })
        it('Should return completions for state keys', async () => {
            const parser = new BlockArgumentParser(false)
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, cursor: 16 })
            const reader = new StringReader('minecraft:stone[]')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], undefined, 'minecraft:block'), [0, 15]),
                $(new BlockStateNode(), [15, 17])
            ), [0, 17]))
            assertCompletions(reader, actual.completions, [
                { label: 'snowy', t: 'minecraft:stone[snowy]' },
                { label: 'age', t: 'minecraft:stone[age]' }
            ])
        })
        it('Should not return redundant completions for state keys', async () => {
            const parser = new BlockArgumentParser(false)
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, cursor: 27 })
            const reader = new StringReader('minecraft:stone[snowy=true,]')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], undefined, 'minecraft:block'), [0, 15]),
                $(new BlockStateNode(), [15, 28], {
                    snowy: 'true',
                    [UnsortedKeys]: ['snowy']
                })
            ), [0, 28]))
            assertCompletions(reader, actual.completions, [
                { label: 'age', t: 'minecraft:stone[snowy=true,age]' }
            ])
        })
        it('Should return completions for state values', async () => {
            const parser = new BlockArgumentParser(false)
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, cursor: 22 })
            const reader = new StringReader('minecraft:stone[snowy=]')
            const actual = parser.parse(reader, ctx)
            assertCompletions(reader, actual.completions,
                [
                    { label: 'true', t: 'minecraft:stone[snowy=true]' },
                    { label: 'false', t: 'minecraft:stone[snowy=false]' }
                ]
            )
        })
        it('Should return empty completions if the ID does not have states', async () => {
            const parser = new BlockArgumentParser(false)
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, cursor: 12 })
            const reader = new StringReader('grass_block[]')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode(undefined, ['grass_block'], undefined, 'minecraft:block'), [0, 11]),
                $(new BlockStateNode(), [11, 13])
            ), [0, 13]))
            assertCompletions(reader, actual.completions, [])
        })
        it('Should return empty completions if the ID does not exist', async () => {
            const parser = new BlockArgumentParser(false)
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, cursor: 13 })
            const reader = new StringReader('spgoding:wtf[]')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('spgoding', ['wtf'], undefined, 'minecraft:block'), [0, 12]),
                $(new BlockStateNode(), [12, 14])
            ), [0, 14]))
            assertCompletions(reader, actual.completions, [])
        })
        it('Should return error for dupliate keys', async () => {
            const parser = new BlockArgumentParser(false)
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, cursor: 0 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy=true,snowy=false]'), ctx)
            assert.deepStrictEqual(actual.errors,
                [
                    new ParsingError(
                        { start: 27, end: 32 }, 'Expected “age” but got “snowy”'
                    ),
                    new ParsingError(
                        { start: 27, end: 32 }, 'Duplicate key “snowy”'
                    )
                ]
            )
        })
        it('Should return error when the end bracket is missing', async () => {
            const parser = new BlockArgumentParser(false)
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, cursor: 0 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy='), ctx)
            assert.deepStrictEqual(actual.errors,
                [
                    new ParsingError(
                        { start: 22, end: 23 }, 'Expected “true” or “false” but got nothing'
                    ),
                    new ParsingError(
                        { start: 22, end: 23 }, 'Expected “]” but got nothing'
                    )
                ]
            )
        })
        it('Should not return errors for block tags', async () => {
            const parser = new BlockArgumentParser(true)
            const cache: ClientCache = { "tag/block": { 'minecraft:qwert': { def: [], ref: [] } } }
            const ctx = constructContext({ blockDefinition: blocks, registry: registries, cache })
            const actual = parser.parse(new StringReader('#minecraft:qwert[snowy=true]'), ctx)
            assert.deepStrictEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['qwert'], true, 'minecraft:block'), [0, 16]),
                $(new BlockStateNode(), [16, 28], {
                    snowy: 'true',
                    [UnsortedKeys]: ['snowy']
                })
            ), [0, 28]))
            assert.deepStrictEqual(actual.errors, [])
        })
        it('Should return error when the states are not sorted', async () => {
            const parser = new BlockArgumentParser(false)
            const config = constructConfig({ lint: { blockStateSortKeys: ['warning', true] } })
            const ctx = constructContext({ blockDefinition: blocks, config, registry: registries, cursor: 0 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy=true,age=1]'), ctx)
            assert.deepStrictEqual(actual.errors, [
                new ParsingError(
                    { start: 15, end: 33 },
                    'Unsorted keys (rule: “blockStateSortKeys”)',
                    undefined, DiagnosticSeverity.Warning,
                    ErrorCode.BlockStateSortKeys
                )
            ])
        })
        it('Should not return error when the states are sorted', async () => {
            const parser = new BlockArgumentParser(false)
            const config = constructConfig({ lint: { blockStateSortKeys: ['warning', true] } })
            const ctx = constructContext({ blockDefinition: blocks, config, registry: registries, cursor: 0 })
            const actual = parser.parse(new StringReader('minecraft:stone[age=1,snowy=true]'), ctx)
            assert.deepStrictEqual(actual.errors, [])
        })
    })
})
