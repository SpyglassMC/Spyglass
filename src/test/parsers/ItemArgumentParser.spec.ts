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
import { $ } from '../utils'
import NbtCompoundNode from '../../types/nodes/map/NbtCompoundNode'
import { Keys, UnsortedKeys } from '../../types/nodes/map/MapNode'
import NbtCompoundKeyNode from '../../types/nodes/map/NbtCompoundKeyNode'
import NbtByteNode from '../../types/nodes/nbt/NbtByteNode'

describe('ItemArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ItemArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['stick', 'minecraft:stick', 'stick{foo:bar}'])
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
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new ItemNode(
                $(new IdentityNode('minecraft', ['stick']), [0, 15])
            ), [0, 15]))
        })
        it('Should return data with tag', () => {
            const parser = new ItemArgumentParser(false)
            const actual = parser.parse(new StringReader('minecraft:stick{ foo : 1b }'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new ItemNode(
                $(new IdentityNode('minecraft', ['stick']), [0, 15]),
                $(new NbtCompoundNode(null), [15, 27], v => $(v, {
                    [Keys]: { foo: $(new NbtCompoundKeyNode(v, 'foo', 'foo', [17, 18, 19]), [17, 20]) },
                    foo: $(new NbtByteNode(v, 1, '1'), [23, 25]),
                    [UnsortedKeys]: ['foo']
                }))
            ), [0, 27]))
        })
        it('Should return completions at the beginning of input', async () => {
            const config = constructConfig({ lint: { idOmitDefaultNamespace: null } })
            const context = await constructContext({ registry: registries, parsers, config, cursor: 0 })
            const parser = new ItemArgumentParser(false)
            const actual = parser.parse(new StringReader(''), context)

            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module
                    },
                    {
                        label: 'stick',
                        kind: CompletionItemKind.Field
                    },
                    {
                        label: 'diamond_sword',
                        kind: CompletionItemKind.Field
                    }
                ]
            )
        })
    })
})
