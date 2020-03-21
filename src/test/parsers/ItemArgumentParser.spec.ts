import assert = require('power-assert')
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import IdentityNode from '../../types/nodes/IdentityNode'
import ItemNode from '../../types/nodes/ItemNode'
import ItemArgumentParser from '../../parsers/ItemArgumentParser'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { CompletionItemKind } from 'vscode-languageserver'
import { constructConfig } from '../../types/Config'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

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
        ctx = await constructContext({ registry: registries, parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data without tag', () => {
            const parser = new ItemArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stick'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new ItemNode(
                new IdentityNode('minecraft', ['stick'])
            ))
        })
        it('Should return data with tag', () => {
            const parser = new ItemArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stick{ foo : "bar" }'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new ItemNode(
                new IdentityNode('minecraft', ['stick']),
                getNbtCompoundTag({ foo: getNbtStringTag('bar') })
            ))
        })
        it('Should return completions at the beginning of input', async () => {
            const config = constructConfig({ lint: { omitDefaultNamespace: true } })
            const context = await constructContext({ registry: registries, parsers, config, cursor: 0 })
            const parser = new ItemArgumentParser(false)
            const actual = parser.parse(new StringReader(''), context)
            assert.deepEqual(actual.data, new ItemNode(
                new IdentityNode()
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
