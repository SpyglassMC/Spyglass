import * as assert from 'power-assert'
import NamespacedIDArgumentParser from '../../parsers/NamespacedIDArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { Registries } from '../../types/VanillaRegistries'
import Identity from '../../types/Identity'
import { fail } from 'assert'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'

describe('NamespacedIDArgumentParser Tests', () => {
    const registries: Registries = {
        'spgoding:test': {
            protocol_id: 0,
            entries: {
                'spgoding:a': { protocol_id: 0 },
                'spgoding:b': { protocol_id: 1 },
                'spgoding:c': { protocol_id: 2 }
            }
        },
        'minecraft:fluid': {
            protocol_id: 1,
            entries: {
                'minecraft:water': { protocol_id: 0 },
                'minecraft:lava': { protocol_id: 1 }
            }
        }
    }
    const manager = new ArgumentParserManager()
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['example:foo/bar'])
        })
    })
    describe('parse() Tests', () => {
        const cache = {
            bossbars: {
                'spgoding:bossbar/a': { def: [], ref: [] },
                'spgoding:bossbar/b': { def: [], ref: [] }
            },
            'tags/functions': {
                'spgoding:function/1': { def: [], ref: [] },
                'spgoding:function/2': { def: [], ref: [] }
            },
            'tags/fluids': {
                'spgoding:fluid/1': { def: [], ref: [] },
                'spgoding:fluid/2': { def: [], ref: [] }
            },
            'tags/entityTypes': {
                'spgoding:entity_type/1': { def: [], ref: [] },
                'spgoding:entity_type/2': { def: [], ref: [] }
            },
            'tags/blocks': {
                'spgoding:block/1': { def: [], ref: [] },
                'spgoding:block/2': { def: [], ref: [] }
            },
            'tags/items': {
                'spgoding:item/1': { def: [], ref: [] },
                'spgoding:item/2': { def: [], ref: [] }
            },
            'lootTables/block': {
                'spgoding:loot_table/block': { def: [], ref: [] }
            },
            'lootTables/generic': {
                'spgoding:loot_table/generic': { def: [], ref: [] }
            }
        }
        it('Should return data with single path', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader('spgoding:a'), undefined, manager)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['a']))
        })
        it('Should return data with multiple paths', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader('spgoding:a/b/c'), undefined, manager)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['a', 'b', 'c']))
        })
        it('Should return data without namespace', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader('a/b'), undefined, manager)
            assert.deepStrictEqual(actual.data, new Identity('minecraft', ['a', 'b']))
        })
        it('Should return data with tag ID', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:fluid', registries, true)
            const actual = parser.parse(new StringReader('#spgoding:fluid/a'), undefined, manager)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['fluid', 'a'], true))
        })
        it('Should return completions for registry entries', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader(''), 0, manager)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:a' },
                    { label: 'spgoding:b' },
                    { label: 'spgoding:c' }
                ]
            )
        })
        it('Should return completions for cache units', () => {
            const parser = new NamespacedIDArgumentParser('$bossbars', registries)
            const actual = parser.parse(new StringReader(''), 0, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:bossbar/a' },
                    { label: 'spgoding:bossbar/b' }
                ]
            )
        })
        it('Should return completions for generic loot tables', () => {
            const parser = new NamespacedIDArgumentParser('$lootTables/block', registries)
            const actual = parser.parse(new StringReader(''), 0, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:loot_table/block' },
                    { label: 'spgoding:loot_table/generic' }
                ]
            )
        })
        it('Should return completions for tag symbol', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:fluid', registries, true)
            const actual = parser.parse(new StringReader(''), 0, manager)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: '#' },
                    { label: 'minecraft:water' },
                    { label: 'minecraft:lava' }
                ]
            )
        })
        it('Should return completions for fluid tags', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:fluid', registries, true)
            const actual = parser.parse(new StringReader('#'), 1, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:fluid/1' },
                    { label: 'spgoding:fluid/2' }
                ]
            )
        })
        it('Should return completions for function tags', () => {
            const parser = new NamespacedIDArgumentParser('$functions', registries, true)
            const actual = parser.parse(new StringReader('#'), 1, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:function/1' },
                    { label: 'spgoding:function/2' }
                ]
            )
        })
        it('Should return completions for item tags', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:item', registries, true)
            const actual = parser.parse(new StringReader('#'), 1, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:item/1' },
                    { label: 'spgoding:item/2' }
                ]
            )
        })
        it('Should return completions for block tags', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:block', registries, true)
            const actual = parser.parse(new StringReader('#'), 1, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:block/1' },
                    { label: 'spgoding:block/2' }
                ]
            )
        })
        it('Should return completions for entity type tags', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:entity_type', registries, true)
            const actual = parser.parse(new StringReader('#'), 1, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:entity_type/1' },
                    { label: 'spgoding:entity_type/2' }
                ]
            )
        })
        it('Should not return completions for tags when the cursor is not at the point', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:entity_type', registries, true)
            const actual = parser.parse(new StringReader('#'), undefined, manager)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions, [])
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader(''), undefined, manager)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a namespaced ID but got nothing', false)
            ])
        })
        it('Should return warning when the id cannot be resolved in cache category', () => {
            const parser = new NamespacedIDArgumentParser('$bossbars', registries)
            const actual = parser.parse(new StringReader('foo'), undefined, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['foo']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'faild to resolve namespaced ID ‘minecraft:foo’ in cache category ‘bossbars’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return warning when the id cannot be resolved in loot table cache', () => {
            const parser = new NamespacedIDArgumentParser('$lootTables/block', registries)
            const actual = parser.parse(new StringReader('foo'), undefined, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['foo']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'faild to resolve namespaced ID ‘minecraft:foo’ in cache category ‘lootTables/block’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return warning when the id cannot be resolved in tag cache category', () => {
            const parser = new NamespacedIDArgumentParser('$functions', registries, true)
            const actual = parser.parse(new StringReader('#spgoding:function/114514'), undefined, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['function', '114514'], true))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 25 }, 'faild to resolve namespaced ID ‘spgoding:function/114514’ in cache category ‘tags/functions’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return warning when the id cannot be resolved in registry', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader('qux'), undefined, manager)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['qux']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'faild to resolve namespaced ID ‘minecraft:qux’ in registry ‘spgoding:test’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return cache when the id is already defined', () => {
            const parser = new NamespacedIDArgumentParser('$bossbars', registries)
            const actual = parser.parse(new StringReader('spgoding:bossbar/a'), undefined, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['bossbar', 'a']))
            assert.deepStrictEqual(actual.cache, {
                bossbars: {
                    'spgoding:bossbar/a': {
                        def: [],
                        ref: [{ start: 0, end: 18 }]
                    }
                }
            })
        })
        it('Should return empty cache when the id is undefined', () => {
            const parser = new NamespacedIDArgumentParser('$bossbars', registries)
            const actual = parser.parse(new StringReader('spgoding:bossbar/c'), undefined, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['bossbar', 'c']))
            assert.deepStrictEqual(actual.cache, {})
        })
        it('Should throw error when the type does not have a corresponding tag type', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries, true)
            try {
                parser.parse(new StringReader('#'), 1, manager)
                fail()
            } catch (e) {
                assert(e.message === 'faild to find a tag type for ‘spgoding:test’')
            }
        })
        it('Should throw error when tag are not allowed here', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:entity_type', registries)
            const actual = parser.parse(new StringReader('#test'), undefined, manager, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity('minecraft', ['test'], true))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'tags are not allowed here')
            ])
        })
    })
})
