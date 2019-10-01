import * as assert from 'power-assert'
import NbtTagArgumentParser from '../../parsers/NbtTagArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { constructConfig, VanillaConfig } from '../../types/Config'
import GlobalCache from '../../types/GlobalCache'
import { getNbtStringTag, getNbtByteTag, getNbtShortTag, getNbtIntTag, getNbtLongTag, getNbtFloatTag, getNbtDoubleTag, getNbtCompoundTag } from '../../types/NbtTag'
import BigNumber from 'bignumber.js'

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
            // Use `deepEqual` instead of `deepStrictEqual`, because each tag has a unique function depending on `val`.
            assert.deepEqual(data, getNbtStringTag('bar"'))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should handle errors for quoted string tags', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader("'bar")
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtStringTag(''))
            assert.deepStrictEqual(errors, [new ParsingError({ start: 4, end: 5 }, "expected an ending quote ‘'’ but got nothing")])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should handle errors for empty input', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtStringTag(''))
            assert.deepStrictEqual(errors, [new ParsingError({ start: 0, end: 1 }, 'expected a tag but got nothing')])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return regular unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('foo:')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtStringTag('foo'))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return byte', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1b}')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtByteTag(1))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat false as byte', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('false')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtByteTag(0))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat true as byte', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('true')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtByteTag(1))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return short', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('32767s')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtShortTag(32767))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return int', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1234567')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtIntTag(1234567))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return long', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('-1234567890L')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtLongTag(new BigNumber('-1234567890')))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return float', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1.23f')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtFloatTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return double', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1.23d')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtDoubleTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return double from a string using scientific notation', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('123E-2d')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtDoubleTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should recognize double implicited by decimal place', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('1.23')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtDoubleTag(1.23))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range byte as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('233b')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtStringTag('233b'))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 4 },
                'expected a number between -128 and 127 but got ‘233’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range short as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('32768s')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtStringTag('32768s'))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 6 },
                'expected a number between -32,768 and 32,767 but got ‘32768’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range int as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('12345678901234')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtStringTag('12345678901234'))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 14 },
                'expected a number between -2,147,483,648 and 2,147,483,647 but got ‘12345678901234’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should treat an out-of-range long as unquoted string', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('-9223372036854775809L')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            assert.deepEqual(data, getNbtStringTag('-9223372036854775809L'))
            assert.deepStrictEqual(errors, [new ParsingError(
                { start: 0, end: 21 },
                'expected a number between -9,223,372,036,854,775,808 and 9,223,372,036,854,775,807 but got ‘-9223372036854775809’',
                true,
                DiagnosticSeverity.Warning
            )])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
        it('Should return a compound', () => {
            const parser = new NbtTagArgumentParser('string', 'blocks')
            const reader = new StringReader('{ foo: "bar", baz: {qux: 1b} }')
            const { data, errors, cache, completions } = parser.parse(reader, undefined, VanillaConfig, globalCache)
            const expected = getNbtCompoundTag({
                foo: getNbtStringTag('bar'),
                baz: getNbtCompoundTag({
                    qux: getNbtByteTag(1)
                })
            })
            assert.deepEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, { def: {}, ref: {} })
            assert.deepStrictEqual(completions, [])
        })
    })
})
