import * as assert from 'power-assert'
import NbtTagArgumentParser from '../../parsers/NbtTagArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { CompletionItemKind } from 'vscode-languageserver'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { constructConfig, VanillaConfig } from '../../types/Config'
import GlobalCache from '../../types/GlobalCache'
import { NbtStringTag, NbtByteTag, NbtShortTag, NbtIntTag, NbtLongTag, NbtFloatTag, NbtDoubleTag } from '../../types/NbtTag'
import Long from 'long'

describe('NbtTagArgumentParser Tests', () => {
    const globalCache: any = {

    }
    describe('getExamples() Tests', () => {
        it('Should return examples respectfully', () => {
            const parser = new NbtTagArgumentParser(['byte', 'compound', 'long_array'], 'blocks')
            const examples = parser.getExamples()
            assert.deepStrictEqual(examples, ['0b', '{}', '{foo: bar}', '[L; 0L]'])
        })
    })
    describe('parse() Tests', () => {
        it('Should parse quoted string tags', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('"bar\\""}')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtStringTag('bar"'))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should handle errors for quoted string tags', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader("'bar")
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtStringTag(''))
            assert.deepStrictEqual(errors, [new ParsingError({ start: 4, end: 5 }, "expected an ending quote ‘'’ but got nothing")])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should handle errors for empty input', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtStringTag(''))
            assert.deepStrictEqual(errors, [new ParsingError({ start: 0, end: 1 }, 'expected a tag but got nothing')])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return regular unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('foo:')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtStringTag('foo'))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return byte', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1b}')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtByteTag(1))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat false as byte', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('false')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtByteTag(0))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat true as byte', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('true')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtByteTag(1))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range number as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('233b')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtStringTag('233b'))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return short', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('32767s')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtShortTag(32767))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return int', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1234567')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtIntTag(1234567))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return long', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1234567890L')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtLongTag(Long.fromString('1234567890')))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return float', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1.23f')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtFloatTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return double', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1.23d')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtDoubleTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should recognize implicit double', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1.23')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepStrictEqual(data, new NbtDoubleTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
    })
})
