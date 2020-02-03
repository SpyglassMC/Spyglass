import assert = require('power-assert')
import NamespacedIDArgumentParser from '../../parsers/NamespacedIDArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity, CompletionItemKind } from 'vscode-languageserver'
import Registry from '../../types/Registry'
import Identity from '../../types/Identity'
import { fail } from 'assert'
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

describe('NamespacedIDArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test')
            const actual = parser.getExamples()
            assert.deepStrictEqual(actual, ['example:foo/bar'])
        })
    })

    const registries: Registry = {
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
        },
        'minecraft:item': {
            protocol_id: 2,
            entries: {
                'minecraft:stick': { protocol_id: 0 }
            }
        },
        'minecraft:block': {
            protocol_id: 3,
            entries: {
                'minecraft:stone': { protocol_id: 0 }
            }
        },
        'minecraft:entity_type': {
            protocol_id: 4,
            entries: {
                'minecraft:area_effect_cloud': { protocol_id: 0 }
            }
        },
        'spgoding:seg_completion_test': {
            protocol_id: 5,
            entries: {
                'spgoding:foo': { protocol_id: 0 },
                'spgoding:foo/bar': { protocol_id: 1 },
                'spgoding:foo/bar/baz': { protocol_id: 2 },
                'minecraft:foo': { protocol_id: 3 },
                'minecraft:foo/bar': { protocol_id: 4 },
                'minecraft:foo/bar/baz': { protocol_id: 5 },
            }
        }
    }
    const parsers = new ArgumentParserManager()
    const cache = {
        advancements: {
            'spgoding:advancement': { def: [], ref: [] }
        },
        bossbars: {
            'spgoding:bossbar/a': { def: [], ref: [] },
            'spgoding:bossbar/b': { def: [], ref: [] }
        },
        'tags/functions': {
            'spgoding:function/1': { def: [], ref: [] },
            'spgoding:function/2': { def: [], ref: [] }
        },
        'tags/fluids': {
            'minecraft:fluid_tag': { def: [], ref: [] }
        },
        'tags/entityTypes': {
            'spgoding:entity_type/1': { def: [], ref: [] },
            'spgoding:entity_type/2': { def: [], ref: [] }
        },
        'tags/blocks': {
            'minecraft:block/1': { def: [], ref: [] }
        },
        'tags/items': {
            'spgoding:item/1': { def: [], ref: [] },
            'spgoding:item/2': { def: [], ref: [] }
        },
        lootTables: {
            'spgoding:loot_table/foo': { def: [], ref: [] }
        }
    }
    const config = constructConfig({
        lint: {
            omitDefaultNamespace: true
        }
    })
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ registries, parsers, cache, config })
    })
    describe('parse() Tests', () => {
        it('Should return data with single path', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test')
            const actual = parser.parse(new StringReader('spgoding:a'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['a']))
        })
        it('Should return data with multiple paths', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test')
            const actual = parser.parse(new StringReader('spgoding:a/b/c'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['a', 'b', 'c']))
        })
        it('Should return data without namespace', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test')
            const actual = parser.parse(new StringReader('a/b'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('minecraft', ['a', 'b']))
        })
        it('Should return data with tag ID', () => {
            const parser = new NamespacedIDArgumentParser('minecraft:fluid', true)
            const actual = parser.parse(new StringReader('#minecraft:fluid_tag'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('minecraft', ['fluid_tag'], true))
        })
        it('Should return completions for registry entries', async () => {
            const ctx = await constructContext({ registries, parsers, cache, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('spgoding:test')
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'spgoding',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    }
                ]
            )
        })
        it('Should return completions for cache units', async () => {
            const ctx = await constructContext({ registries, parsers, cache, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('$bossbars')
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'spgoding',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    }
                ]
            )
        })
        it('Should return completions for advancements with special kind', async () => {
            const ctx = await constructContext({ registries, parsers, cache, cursor: 9 })
            const parser = new NamespacedIDArgumentParser('$advancements')
            const actual = parser.parse(new StringReader('spgoding:'), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'advancement',
                        kind: CompletionItemKind.Event,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for functions with special kind', async () => {
            const ctx = await constructContext({ registries, parsers, cache, cursor: 19 })
            const parser = new NamespacedIDArgumentParser('$functions', true)
            const actual = parser.parse(new StringReader('#spgoding:function/'), ctx)
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: '1',
                        kind: CompletionItemKind.Function,
                        commitCharacters: [' ']
                    },
                    {
                        label: '2',
                        kind: CompletionItemKind.Function,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for fluid and fluid tags', async () => {
            const ctx = await constructContext({ registries, parsers, cache, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('minecraft:fluid', true)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: '#minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: '#fluid_tag',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    },
                    {
                        label: 'water',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    },
                    {
                        label: 'lava',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for functions and function tags', async () => {
            const ctx = await constructContext({ registries, parsers, cache, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('$functions', true)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: '#spgoding',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    }
                ]
            )
        })
        it('Should return completions for items and item tags', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('minecraft:item', true)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: '#spgoding',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'stick',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for blocks and block tags', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('minecraft:block', true)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: '#minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: '#block',
                        kind: CompletionItemKind.Folder,
                        commitCharacters: ['/']
                    },
                    {
                        label: 'stone',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for entity types and entity type tags', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('minecraft:entity_type', true)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: '#spgoding',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'area_effect_cloud',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for namespaces and the first path in default namespace', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('spgoding:seg_completion_test')
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'spgoding',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'foo',
                        kind: CompletionItemKind.Folder,
                        commitCharacters: ['/']
                    },
                    {
                        label: 'foo',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should only return completions for namespaces when cannot omit namespaces', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 0 })
            const parser = new NamespacedIDArgumentParser('spgoding:seg_completion_test', undefined, true)
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'spgoding',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    },
                    {
                        label: 'minecraft',
                        kind: CompletionItemKind.Module,
                        commitCharacters: [':']
                    }
                ]
            )
        })
        it('Should return completions for the first path in non-default namespace', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 9 })
            const parser = new NamespacedIDArgumentParser('spgoding:seg_completion_test')
            const actual = parser.parse(new StringReader('spgoding:'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['']))
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'foo',
                        kind: CompletionItemKind.Folder,
                        commitCharacters: ['/']
                    },
                    {
                        label: 'foo',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for the second path in non-default namespace', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 13 })
            const parser = new NamespacedIDArgumentParser('spgoding:seg_completion_test')
            const actual = parser.parse(new StringReader('spgoding:foo/'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['foo', '']))
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'bar',
                        kind: CompletionItemKind.Folder,
                        commitCharacters: ['/']
                    },
                    {
                        label: 'bar',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for the third path in non-default namespace', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 17 })
            const parser = new NamespacedIDArgumentParser('spgoding:seg_completion_test')
            const actual = parser.parse(new StringReader('spgoding:foo/bar/'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['foo', 'bar', '']))
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'baz',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return completions for the second path in default namespace', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 4 })
            const parser = new NamespacedIDArgumentParser('spgoding:seg_completion_test')
            const actual = parser.parse(new StringReader('foo/'), ctx)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['foo', '']))
            assert.deepStrictEqual(actual.completions,
                [
                    {
                        label: 'bar',
                        kind: CompletionItemKind.Folder,
                        commitCharacters: ['/']
                    },
                    {
                        label: 'bar',
                        kind: CompletionItemKind.Field,
                        commitCharacters: [' ']
                    }
                ]
            )
        })
        it('Should return untolerable error when the input is empty', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('spgoding:test')
            const actual = parser.parse(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'Expected a namespaced ID but got nothing', false)
            ])
        })
        it('Should return errors for non [a-z0-9/._-] characters', async () => {
            const config = constructConfig({ lint: { strictBossbarCheck: false, omitDefaultNamespace: false } })
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('$bossbars')
            const actual = parser.parse(new StringReader('spgoding:QwQ'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['QwQ']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 9, end: 12 }, 'Found non [a-z0-9/._-] character(s)')
            ])
        })
        it('Should return warning when the id cannot be resolved in cache category', async () => {
            const config = constructConfig({ lint: { strictBossbarCheck: true, omitDefaultNamespace: true } })
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('$bossbars')
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['foo']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Failed to resolve namespaced ID ‘minecraft:foo’ in cache category ‘bossbars’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return warning when the id cannot be resolved in loot table cache', async () => {
            const config = constructConfig({ lint: { strictLootTableCheck: true, omitDefaultNamespace: true } })
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('$lootTables')
            const actual = parser.parse(new StringReader('foo'), ctx)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['foo']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Failed to resolve namespaced ID ‘minecraft:foo’ in cache category ‘lootTables’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return warning when the id cannot be resolved in tag cache category', async () => {
            const config = constructConfig({ lint: { strictFunctionTagCheck: true, omitDefaultNamespace: true } })
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('$functions', true)
            const actual = parser.parse(new StringReader('#spgoding:function/114514'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['function', '114514'], true))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 25 }, 'Failed to resolve namespaced ID ‘spgoding:function/114514’ in cache category ‘tags/functions’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return warning when the id cannot be resolved in registry', async () => {
            const config = constructConfig({ lint: { strictBlockCheck: 'always', omitDefaultNamespace: true } })
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('minecraft:block')
            const actual = parser.parse(new StringReader('qux'), ctx)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['qux']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'Failed to resolve namespaced ID ‘minecraft:qux’ in registry ‘minecraft:block’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return cache when the id is already defined', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('$bossbars')
            const actual = parser.parse(new StringReader('spgoding:bossbar/a'), ctx)
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
        it('Should return empty cache when the id is undefined', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('$bossbars')
            const actual = parser.parse(new StringReader('spgoding:bossbar/c'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['bossbar', 'c']))
            assert.deepStrictEqual(actual.cache, {})
        })
        it('Should throw error when the type does not have a corresponding tag type', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config, cursor: 1 })
            const parser = new NamespacedIDArgumentParser('spgoding:test', true)
            try {
                parser.parse(new StringReader('#'), ctx)
                fail()
            } catch (e) {
                assert(e.message === 'faild to find a tag type for ‘spgoding:test’')
            }
        })
        it('Should throw error when tags are not allowed here', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('minecraft:entity_type')
            const actual = parser.parse(new StringReader('#spgoding:entity_type/1'), ctx)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['entity_type', '1'], true))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'Tags are not allowed here')
            ])
        })
        it('Should throw error when namespace cannot be omitted here', async () => {
            const ctx = await constructContext({ registries, parsers, cache, config })
            const parser = new NamespacedIDArgumentParser('minecraft:block', undefined, true)
            const actual = parser.parse(new StringReader('stone'), ctx)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['stone']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 5 }, 'Default namespace cannot be omitted here')
            ])
        })
    })
})
