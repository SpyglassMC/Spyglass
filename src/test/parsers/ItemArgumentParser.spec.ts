import assert = require('power-assert')
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import Identity from '../../types/Identity'
import Item from '../../types/Item'
import ItemArgumentParser from '../../parsers/ItemArgumentParser'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { CompletionItemKind } from 'vscode-languageserver'
import { constructConfig } from '../../types/Config'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import { getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'

describe('ItemArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ItemArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, ['stick', 'minecraft:stick', 'stick{foo:bar}'])
        })
    })

    const registries = {
        'minecraft:item': {
            protocol_id: 0,
            entries: {
                'minecraft:stick': { protocol_id: 0 },
                'minecraft:diamond_sword': { protocol_id: 1 }
            }
        }
    }
    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ registries, parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data without tag', () => {
            const parser = new ItemArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stick'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Item(
                new Identity('minecraft', ['stick'])
            ))
        })
        it('Should return data with tag', () => {
            const parser = new ItemArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stick{ foo : "bar" }'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Item(
                new Identity('minecraft', ['stick']),
                getNbtCompoundTag({ foo: getNbtStringTag('bar') })
            ))
        })
        it('Should return completions at the beginning of input', async () => {
            const config = constructConfig({ lint: { omitDefaultNamespace: true } })
            const context = await constructContext({ registries, parsers, config, cursor: 0 })
            const parser = new ItemArgumentParser(false)
            const actual = parser.parse(new StringReader(''), context)
            assert.deepEqual(actual.data, new Item(
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
                        label: 'stick',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    },
                    {
                        label: 'diamond_sword',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
    })
})
