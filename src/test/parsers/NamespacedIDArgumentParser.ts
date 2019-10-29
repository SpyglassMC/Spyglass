import * as assert from 'power-assert'
import NamespacedIDArgumentParser from '../../parsers/NamespacedIDArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { describe, it } from 'mocha'
import { constructConfig } from '../../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { Registries } from '../../types/VanillaRegistries'
import Identity from '../../types/Identity'

describe('NamespacedIDArgumentParser Tests', () => {
    const registries: Registries = {
        'spgoding:test': {
            protocol_id: 0,
            entries: {
                'spgoding:a': { protocol_id: 0 },
                'spgoding:b': { protocol_id: 1 },
                'spgoding:c': { protocol_id: 2 }
            }
        }
    }
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
            }
        }
        it('Should return data with single path', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader('spgoding:a'))
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['a']))
        })
        it('Should return data with multiple paths', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader('spgoding:a/b/c'))
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['a', 'b', 'c']))
        })
        it('Should return data without namespace', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader('a/b'))
            assert.deepStrictEqual(actual.data, new Identity('minecraft', ['a', 'b']))
        })
        it('Should return completions for registry entries', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader(''), 0)
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
            const actual = parser.parse(new StringReader(''), 0, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.completions,
                [
                    { label: 'spgoding:bossbar/a' },
                    { label: 'spgoding:bossbar/b' }
                ]
            )
        })
        it('Should return untolerable error when the input is empty', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader(''))
            assert.deepStrictEqual(actual.data, new Identity())
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 1 }, 'expected a namespaced ID but got nothing', false)
            ])
        })
        it('Should return warning when the id cannot be resolved in cache category', () => {
            const parser = new NamespacedIDArgumentParser('$bossbars', registries)
            const actual = parser.parse(new StringReader('foo'), undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['foo']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'faild to resolve namespaced ID ‘minecraft:foo’ in cache category ‘bossbars’', undefined, DiagnosticSeverity.Warning)
            ])
        })
        it('Should return error when the id cannot be resolved in registry', () => {
            const parser = new NamespacedIDArgumentParser('spgoding:test', registries)
            const actual = parser.parse(new StringReader('qux'), undefined)
            assert.deepStrictEqual(actual.data, new Identity(undefined, ['qux']))
            assert.deepStrictEqual(actual.errors, [
                new ParsingError({ start: 0, end: 3 }, 'faild to resolve namespaced ID ‘minecraft:qux’ in registry ‘spgoding:test’')
            ])
        })
        it('Should return cache when the id is already defined', () => {
            const parser = new NamespacedIDArgumentParser('$bossbars', registries)
            const actual = parser.parse(new StringReader('spgoding:bossbar/a'), undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['bossbar', 'a']))
            assert.deepStrictEqual(actual.cache, {
                bossbars: {
                    'spgoding:bossbar/a': {
                        def: [],
                        ref: [{ range: { start: 0, end: 18 } }]
                    }
                }
            })
        })
        it('Should return empty cache when the id is undefined', () => {
            const parser = new NamespacedIDArgumentParser('$bossbars', registries)
            const actual = parser.parse(new StringReader('spgoding:bossbar/c'), undefined, undefined, cache)
            assert.deepStrictEqual(actual.data, new Identity('spgoding', ['bossbar', 'c']))
            assert.deepStrictEqual(actual.cache, {})
        })
    })
})
