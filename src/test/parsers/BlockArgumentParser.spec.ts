import assert = require('power-assert')
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import BlockNode from '../../types/nodes/BlockNode'
import BlockArgumentParser from '../../parsers/BlockArgumentParser'
import IdentityNode from '../../types/nodes/IdentityNode'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { CompletionItemKind } from 'vscode-languageserver'
import { constructConfig } from '../../types/Config'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import BlockStateNode from '../../types/nodes/map/BlockStateMapNode'
import { NodeRange } from '../../types/nodes/ArgumentNode'
import { $ } from '../utils'
import NbtCompoundNode from '../../types/nodes/map/NbtCompoundNode'
import { Keys } from '../../types/nodes/map/MapNode'
import NbtCompoundKeyNode from '../../types/nodes/map/NbtCompoundKeyNode'
import NbtStringNode from '../../types/nodes/nbt/NbtStringNode'
import NbtByteNode from '../../types/nodes/nbt/NbtByteNode'
import { ClientCache } from '../../types/ClientCache'

describe('BlockArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new BlockArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, ['stone', 'minecraft:stone', 'stone[foo=bar]', 'stone{bar:baz}'])
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
    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ blocks, registry: registries, parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data without states or tag', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), { start: 0, end: 15 })
            ), { start: 0, end: 15 }))
        })
        it('Should return data with empty states', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[]'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), { start: 0, end: 15 })
            ), { start: 0, end: 17 }))
        })
        it('Should return data with single state', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true ]'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), { start: 0, end: 15 }),
                $(new BlockStateNode(), { start: 15, end: 31 }, { snowy: 'true' })
            ), { start: 0, end: 31 }))
        })
        it('Should return data with multiple states', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true , age = 3 ]'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), { start: 0, end: 15 }),
                $(new BlockStateNode(), { start: 15, end: 41 }, { snowy: 'true', age: '3' })
            ), { start: 0, end: 41 }))
        })
        it('Should return data with tag', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone{ foo : "bar" }'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), [0, 15]),
                undefined,
                $(new NbtCompoundNode(null), [15, 30], v => $(v, {
                    [Keys]: { foo: $(new NbtCompoundKeyNode(v, 'foo', 'foo', [17, 18, 19]), [17, 20]) },
                    foo: $(new NbtStringNode(v, 'bar', '"bar"', [24, 25, 26]), [23, 28])
                }))
            ), [0, 30]))
        })
        it('Should return data with both states and tag', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true , age = 2 ]{ foo : 1b }'), ctx)
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), [0, 15]),
                $(new BlockStateNode(), [15, 41], { snowy: 'true', age: '2' }),
                $(new NbtCompoundNode(null), [41, 53], v => $(v, {
                    [Keys]: { foo: $(new NbtCompoundKeyNode(v, 'foo', 'foo', [43, 44, 45]), [43, 46]) },
                    foo: $(new NbtByteNode(v, 1, '1'), [49, 51])
                }))
            ), [0, 56]))
        })
        it('Should return completions at the beginning of input', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registry: registries, parsers, cursor: 0 })
            const actual = parser.parse(new StringReader(''), context)
            assert.deepEqual(actual.data, $(new BlockNode(), [0, 0]))
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'stone',
                        kind: CompletionItemKind.Field
                    },
                    {
                        label: 'grass_block',
                        kind: CompletionItemKind.Field
                    }
                ]
            )
        })
        it('Should return completions for state keys', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registry: registries, parsers, cursor: 16 })
            const actual = parser.parse(new StringReader('minecraft:stone[]'), context)
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), [0, 15])
            ), [0, 17]))
            assert.deepStrictEqual(actual.completions, [
                { label: 'snowy' },
                { label: 'age' }
            ])
        })
        it('Should not return redundant completions for state keys', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registry: registries, parsers, cursor: 27 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy=true,]'), context)
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), [0, 15]),
                $(new BlockStateNode(), [15, 28], { snowy: 'true' })
            ), [0, 28]))
            assert.deepStrictEqual(actual.completions, [
                { label: 'age' }
            ])
        })
        it('Should return completions for state values', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registry: registries, parsers, cursor: 22 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy=]'), context)
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone']), [0, 15]),
                $(new BlockStateNode(), [15, 23], { snowy: '' })
            ), [0, 23]))
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'true' },
                    { label: 'false' }
                ]
            )
        })
        it('Should return empty completions if the ID does not have states', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registry: registries, parsers, cursor: 12 })
            const actual = parser.parse(new StringReader('grass_block[]'), context)
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['grass_block']), [0, 13])
            ), [0, 13]))
            assert.deepStrictEqual(actual.completions, [])
        })
        it('Should return empty completions if the ID does not exist', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registry: registries, parsers, cursor: 13 })
            const actual = parser.parse(new StringReader('spgoding:wtf[]'), context)
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('spgoding', ['wtf']), [0, 14])
            ), [0, 14]))
            assert.deepStrictEqual(actual.completions, [])
        })
        it('Should return error for dupliate keys', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registry: registries, parsers, cursor: 0 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy=true,snowy=false]'), context)
            assert.deepStrictEqual(actual.errors,
                [
                    new ParsingError(
                        { start: 27, end: 32 }, 'Expected ‘age’ but got ‘snowy’'
                    ),
                    new ParsingError(
                        { start: 27, end: 32 }, 'Duplicate key ‘snowy’'
                    )
                ]
            )
        })
        it('Should return error when the end bracket is missing', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registry: registries, parsers, cursor: 0 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy='), context)
            assert.deepStrictEqual(actual.errors,
                [
                    new ParsingError(
                        { start: 22, end: 23 }, 'Expected ‘true’ or ‘false’ but got nothing'
                    ),
                    new ParsingError(
                        { start: 22, end: 23 }, 'Expected ‘]’ but got nothing'
                    )
                ]
            )
        })
        it('Should not return errors for block tags', async () => {
            const parser = new BlockArgumentParser(true)
            const cache: ClientCache = { "tags/blocks": { 'minecraft:stone': { def: [], ref: [] } } }
            const ctx = await constructContext({ blocks, registry: registries, parsers, cache })
            const actual = parser.parse(new StringReader('#minecraft:stone[snowy=true]'), ctx)
            assert.deepEqual(actual.data, $(new BlockNode(
                $(new IdentityNode('minecraft', ['stone'], true), [0, 16]),
                $(new BlockStateNode(), [16, 28], { snowy: 'true' })
            ), [0, 28]))
            assert.deepStrictEqual(actual.errors, [])
        })
    })
})
