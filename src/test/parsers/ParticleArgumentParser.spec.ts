import assert = require('power-assert')
import { describe, it } from 'mocha'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import Block from '../../types/Block'
import Identity from '../../types/Identity'
import Item from '../../types/Item'
import Particle from '../../types/Particle'
import ParticleArgumentParser from '../../parsers/ParticleArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import Vector from '../../types/Vector'
import { CompletionItemKind } from 'vscode-languageserver'
import { constructConfig } from '../../types/Config'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

describe('ParticleArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.getExamples()
            assert.deepEqual(actual, ['minecraft:cloud', 'minecraft:dust 1.0 1.0 1.0 1.0'])
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
    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ blocks, registries, parsers })
    })
    describe('parse() Tests', () => {
        it('Should return data without extra params', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:cloud'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Particle(
                new Identity('minecraft', ['cloud'])
            ))
        })
        it('Should return data for ‘dust’ particle', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:dust 0.93 0.40 0.80 1.00'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Particle(
                new Identity('minecraft', ['dust']),
                new Vector([
                    { value: '0.93', type: 'absolute' },
                    { value: '0.40', type: 'absolute' },
                    { value: '0.80', type: 'absolute' },
                    { value: '1.00', type: 'absolute' }
                ])
            ))
            assert.deepEqual(actual.cache, {
                colors: {
                    '0.93 0.4 0.8 1': {
                        def: [],
                        ref: [{ start: 0, end: 34 }]
                    }
                }
            })
        })
        it('Should return data for ‘block’ particle', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:block minecraft:stone'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Particle(
                new Identity('minecraft', ['block']),
                new Block(
                    new Identity('minecraft', ['stone'])
                )
            ))
        })
        it('Should return data for ‘item’ particle', () => {
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader('minecraft:item minecraft:diamond'), ctx)
            assert.deepEqual(actual.errors, [])
            assert.deepEqual(actual.data, new Particle(
                new Identity('minecraft', ['item']),
                new Item(
                    new Identity('minecraft', ['diamond'])
                )
            ))
        })
        it('Should return completions at the beginning of input', async () => {
            const config = constructConfig({ lint: { omitDefaultNamespace: true } })
            const ctx = await constructContext({ parsers, config, registries, cursor: 0 })
            const parser = new ParticleArgumentParser()
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepEqual(actual.data, new Particle(
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
                        label: 'cloud',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    },
                    {
                        label: 'dust',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    },
                    {
                        label: 'block',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    },
                    {
                        label: 'item',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
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
