import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { getNbtCompoundTag, getNbtStringTag } from '../../types/NbtTag'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import Identity from '../../types/Identity'
import Item from '../../types/Item'
import ItemArgumentParser from '../../parsers/ItemArgumentParser'
import StringReader from '../../utils/StringReader'
import { CompletionItemKind } from 'vscode-languageserver'
import { constructConfig } from '../../types/Config'

describe('ItemArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ItemArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, ['stick', 'minecraft:stick', 'stick{foo:bar}'])
        })
    })
    describe('parse() Tests', () => {
        const registries = {
            'minecraft:item': {
                protocol_id: 0,
                entries: {
                    'minecraft:stick': { protocol_id: 0 },
                    'minecraft:diamond_sword': { protocol_id: 1 }
                }
            }
        }
        const manager = new ArgumentParserManager()
        it('Should return data without tag', () => {
            const parser = new ItemArgumentParser(false, registries)
            const actual = parser.parse(new StringReader('minecraft:stick'), undefined, manager)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Item(
                new Identity('minecraft', ['stick'])
            ))
        })
        it('Should return data with tag', () => {
            const parser = new ItemArgumentParser(false, registries)
            const actual = parser.parse(new StringReader('minecraft:stick{ foo : "bar" }'), undefined, manager)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Item(
                new Identity('minecraft', ['stick']),
                getNbtCompoundTag({ foo: getNbtStringTag('bar') })
            ))
        })
        it('Should return completions at the beginning of input', () => {
            const config = constructConfig({ lint: { omitDefaultNamespace: true } })
            const parser = new ItemArgumentParser(false, registries)            
            const actual = parser.parse(new StringReader(''), 0, manager, config)
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
