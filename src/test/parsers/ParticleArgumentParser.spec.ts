import assert = require('power-assert')
import { describe, it } from 'mocha'
import { CompletionItemKind } from 'vscode-languageserver'
import { BlockNode } from '../../nodes/BlockNode'
import { IdentityNode } from '../../nodes/IdentityNode'
import { ItemNode } from '../../nodes/ItemNode'
import { ParticleNode } from '../../nodes/ParticleNode'
import { VectorElementNode, VectorElementType, VectorNode } from '../../nodes/VectorNode'
import { ParticleArgumentParser } from '../../parsers/ParticleArgumentParser'
import { constructConfig } from '../../types/Config'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { $ } from '../utils.spec'

describe('ParticleArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['minecraft:cloud', 'minecraft:dust 1.0 1.0 1.0 1.0'])
        })
    })

    const blocks = {
        'minecraft:stone': {
            properties: {
                snowy: ['true', 'false'],
                age: ['0', '1', '2', '3']
            },
            states: []
        }
    }
    const registries = {
        'minecraft:particle_type': {
            protocol_id: 0,
            entries: {
                'minecraft:cloud': { protocol_id: 0 },
                'minecraft:dust': { protocol_id: 1 },
                'minecraft:block': { protocol_id: 2 },
                'minecraft:item': { protocol_id: 3 }
            }
        },
        'minecraft:item': {
            protocol_id: 0,
            entries: {
                'minecraft:stick': { protocol_id: 0 },
                'minecraft:diamond': { protocol_id: 1 }
            }
        },
        'minecraft:block': {
            protocol_id: 0,
            entries: {
                'minecraft:stone': { protocol_id: 0 }
            }
        }
    }
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ blockDefinition: blocks, registry: registries })
    })
    describe('parse() Tests', () => {
        it('Should return data without extra params', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:cloud'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new ParticleNode(
                $(new IdentityNode('minecraft', ['cloud']), [0, 15])
            ), [0, 15]))
        })
        it('Should return data for ‘dust’ particle', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:dust 0.93 0.40 0.80 1'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new ParticleNode(
                $(new IdentityNode('minecraft', ['dust']), [0, 14]),
                $(new VectorNode(), [15, 31], {
                    length: 4,
                    0: $(new VectorElementNode(VectorElementType.Absolute, 0.93, '0.93'), [15, 19]),
                    1: $(new VectorElementNode(VectorElementType.Absolute, 0.4, '0.40'), [20, 24]),
                    2: $(new VectorElementNode(VectorElementType.Absolute, 0.8, '0.80'), [25, 29]),
                    3: $(new VectorElementNode(VectorElementType.Absolute, 1, '1'), [30, 31])
                })
            ), [0, 31]))
            assert.deepStrictEqual(actual.cache, {
                colors: {
                    '0.93 0.4 0.8': {
                        def: [],
                        ref: [{ start: 0, end: 29 }]
                    }
                }
            })
        })
        it('Should return data for ‘block’ particle', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:block minecraft:stone'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new ParticleNode(
                $(new IdentityNode('minecraft', ['block']), [0, 15]),
                $(new BlockNode(
                    $(new IdentityNode('minecraft', ['stone']), [16, 31])
                ), [16, 31])
            ), [0, 31]))
        })
        it('Should return data for ‘item’ particle', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:item minecraft:diamond'), ctx)
            assert.deepStrictEqual(actual.errors, [])
            assert.deepStrictEqual(actual.data, $(new ParticleNode(
                $(new IdentityNode('minecraft', ['item']), [0, 14]),
                $(new ItemNode(
                    $(new IdentityNode('minecraft', ['diamond']), [15, 32])
                ), [15, 32])
            ), [0, 32]))
        })
        it('Should return completions at the beginning of input', async () => {
            const config = constructConfig({ lint: { idOmitDefaultNamespace: null } })
            const ctx = constructContext({ config, registry: registries, cursor: 0 })
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module
                    },
                    {
                        label: 'cloud',
                        kind: CompletionItemKind.Field
                    },
                    {
                        label: 'dust',
                        kind: CompletionItemKind.Field
                    },
                    {
                        label: 'block',
                        kind: CompletionItemKind.Field
                    },
                    {
                        label: 'item',
                        kind: CompletionItemKind.Field
                    }
                ]
            )
        })
        it('Should return error when the param is lossing', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:dust'), ctx)
            assert.deepStrictEqual(actual.errors,
                [
                    new ParsingError(
                        { start: 14, end: 15 }, 'Expected ‘ ’ but got nothing'
                    )
                ]
            )
        })
    })
})
