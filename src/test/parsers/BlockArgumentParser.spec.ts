import assert = require('power-assert')
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import BlockToken from '../../types/tokens/BlockToken'
import BlockArgumentParser from '../../parsers/BlockArgumentParser'
import Identity from '../../types/Identity'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'
import { CompletionItemKind } from 'vscode-languageserver'
import { constructConfig } from '../../types/Config'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

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
        ctx = await constructContext({ blocks, registries, parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data without states or tag', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone'])
            ))
        })
        it('Should return data with empty states', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[]'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone'])
            ))
        })
        it('Should return data with single state', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true ]'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone']),
                { snowy: 'true' }
            ))
        })
        it('Should return data with multiple states', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true , age = 3 ]'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone']),
                { snowy: 'true', age: '3' }
            ))
        })
        it('Should return data with tag', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone{ foo : "bar" }'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone']),
                undefined,
                getNbtCompoundTag({ foo: getNbtStringTag('bar') })
            ))
        })
        it('Should return data with both states and tag', () => {
            const parser = new BlockArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stone[ snowy = true , age = 2 ]{ foo : "bar" }'), ctx)
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone']),
                { snowy: 'true', age: '2' },
                getNbtCompoundTag({ foo: getNbtStringTag('bar') })
            ))
        })
        it('Should return completions at the beginning of input', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registries, parsers, cursor: 0 })
            const actual = parser.parse(new StringReader(''), context)
            assert.deepEqual(actual.data, new BlockToken(
                new Identity()
            ))
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'stone',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    },
                    {
                        label: 'grass_block',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for state keys', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registries, parsers, cursor: 16 })
            const actual = parser.parse(new StringReader('minecraft:stone[]'), context)
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone'])
            ))
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'snowy' },
                    { label: 'age' }
                ]
            )
        })
        it('Should not return redundant completions for state keys', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registries, parsers, cursor: 27 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy=true,]'), context)
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone']),
                { snowy: 'true' }
            ))
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'age' }
                ]
            )
        })
        it('Should return completions for state values', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registries, parsers, cursor: 22 })
            const actual = parser.parse(new StringReader('minecraft:stone[snowy=]'), context)
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone']),
                { snowy: '' }
            ))
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'true' },
                    { label: 'false' }
                ]
            )
        })
        it('Should return empty completions if the ID does not have states', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registries, parsers, cursor: 12 })
            const actual = parser.parse(new StringReader('grass_block[]'), context)
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['grass_block'])
            ))
            assert.deepStrictEqual(actual.completions, [])
        })
        it('Should return empty completions if the ID does not exist', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registries, parsers, cursor: 13 })
            const actual = parser.parse(new StringReader('spgoding:wtf[]'), context)
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('spgoding', ['wtf'])
            ))
            assert.deepStrictEqual(actual.completions, [])
        })
        it('Should return error for dupliate keys', async () => {
            const parser = new BlockArgumentParser(false)
            const context = await constructContext({ blocks, registries, parsers, cursor: 0 })
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
            const context = await constructContext({ blocks, registries, parsers, cursor: 0 })
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
        it('Should not return errors for block tags', () => {
            const parser = new BlockArgumentParser(true)
            const actual = parser.parse(new StringReader('#minecraft:stone[snowy=true]'), ctx)
            assert.deepEqual(actual.data, new BlockToken(
                new Identity('minecraft', ['stone'], true),
                { snowy: 'true' }
            ))
            assert.deepStrictEqual(actual.errors, [])
        })
    })
})
