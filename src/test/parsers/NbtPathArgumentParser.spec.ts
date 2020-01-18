import assert = require('power-assert')
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import NbtPath, { NbtPathIndexBegin, NbtPathIndexEnd, NbtPathSep } from '../../types/NbtPath'
import NbtPathArgumentParser from '../../parsers/NbtPathArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import { describe, it } from 'mocha'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { getNbtByteTag, getNbtCompoundTag } from '../../types/NbtTag'
import { NbtSchemaNode, ValueList } from '../../types/NbtSchema'

describe('NbtPathArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples respectfully', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const examples = parser.getExamples()
            assert.deepEqual(examples, ['foo', 'foo.bar', 'foo[0]', '[0]', '[]', '{foo:bar}'])
        })
    })

    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ parsers })
    })
    describe('parse() Tests', () => {
        it('Should parse a simple key', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const reader = new StringReader('foo')
            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepEqual(data, new NbtPath(['foo']))
            assert.deepEqual(errors, [])
            assert.deepEqual(cache, {})
            assert.deepEqual(completions, [])
        })
        it('Should parse a simple compound filter', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const reader = new StringReader('{ foo : 1b }')
            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepEqual(data, new NbtPath(
                [getNbtCompoundTag({ foo: getNbtByteTag(1) })]
            ))
            assert.deepEqual(errors, [])
            assert.deepEqual(cache, {})
            assert.deepEqual(completions, [])
        })
        it('Should parse a simple number index', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const reader = new StringReader('[ -1 ]')
            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepEqual(data, new NbtPath(
                [NbtPathIndexBegin, -1, NbtPathIndexEnd]
            ))
            assert.deepEqual(errors, [])
            assert.deepEqual(cache, {})
            assert.deepEqual(completions, [])
        })
        it('Should parse a compound filter in index', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const reader = new StringReader('[ { foo : 1b } ]')
            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepEqual(data, new NbtPath(
                [NbtPathIndexBegin, getNbtCompoundTag({ foo: getNbtByteTag(1) }), NbtPathIndexEnd]
            ))
            assert.deepEqual(errors, [])
            assert.deepEqual(cache, {})
            assert.deepEqual(completions, [])
        })
        it('Should parse a compound filter after key', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const reader = new StringReader('foo{ foo : 1b }')
            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepEqual(data, new NbtPath(
                ['foo', getNbtCompoundTag({ foo: getNbtByteTag(1) })]
            ))
            assert.deepEqual(errors, [])
            assert.deepEqual(cache, {})
            assert.deepEqual(completions, [])
        })
        it('Should parse a crazy key after key', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const reader = new StringReader('foo."crazy key"')
            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepEqual(data, new NbtPath(
                ['foo', NbtPathSep, 'crazy key']
            ))
            assert.deepEqual(errors, [])
            assert.deepEqual(cache, {})
            assert.deepEqual(completions, [])
        })
        it('Should parse a key after compound filter', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const reader = new StringReader('{ foo : 1b }.foo')
            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepEqual(data, new NbtPath(
                [getNbtCompoundTag({ foo: getNbtByteTag(1) }), NbtPathSep, 'foo']
            ))
            assert.deepEqual(errors, [])
            assert.deepEqual(cache, {})
            assert.deepEqual(completions, [])
        })
        it('Should parse a key after index', () => {
            const parser = new NbtPathArgumentParser('blocks')
            const reader = new StringReader('[].foo')
            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepEqual(data, new NbtPath(
                [NbtPathIndexBegin, NbtPathIndexEnd, NbtPathSep, 'foo']
            ))
            assert.deepEqual(errors, [])
            assert.deepEqual(cache, {})
            assert.deepEqual(completions, [])
        })

        const nbt: { [key: string]: NbtSchemaNode | ValueList } = {
            'block/banner.json': {
                type: 'compound',
                children: {
                    list: {
                        type: 'list',
                        item: {
                            type: 'compound',
                            additionalChildren: true,
                            children: {
                                foo: { type: 'no-nbt' },
                                bar: { type: 'no-nbt' }
                            }
                        }
                    },
                    byteArray: {
                        type: 'byte_array'
                    }
                }
            },
            'roots/blocks.json': {
                type: 'root',
                children: {
                    'minecraft:banner': {
                        ref: 'block/banner.json'
                    }
                }
            }
        }
        let ctx: ParsingContext
        before(async () => {
            ctx = await constructContext({ parsers, nbt })
        })
        describe('schema Tests', () => {
            it('Should return warning when the key is not in compound tags', () => {
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner/list')
                const reader = new StringReader('foo')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    ['foo']
                ))
                assert.deepEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 1 },
                        'keys are only used for compound tags',
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [])
            })
            it('Should return warning when the compound filter is not in compound tags', () => {
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner/list')
                const reader = new StringReader('{  }')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    [getNbtCompoundTag({})]
                ))
                assert.deepEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 1 },
                        'compound filters are only used for compound tags',
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [])
            })
            it('Should return warning when the index is not in list tags', () => {
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner')
                const reader = new StringReader('[]')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    [NbtPathIndexBegin, NbtPathIndexEnd]
                ))
                assert.deepEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 1 },
                        'indexes are only used for lists/arrays tags',
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [])
            })
            it('Should return error when the input is empty', () => {
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner')
                const reader = new StringReader('')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    []
                ))
                assert.deepEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 1 },
                        'expected a compound filter, a key, or an index but got nothing'
                    )
                ])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [])
            })
            it('Should return completions for key', async () => {
                const ctx = await constructContext({ parsers, nbt, cursor: 0 })
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner')
                const reader = new StringReader('')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    []
                ))
                assert.deepEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 1 },
                        'expected a compound filter, a key, or an index but got nothing'
                    )
                ])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [
                    { label: 'list' },
                    { label: 'byteArray' }
                ])
            })
            it('Should return completions for sub keys under list tag', async () => {
                const ctx = await constructContext({ parsers, nbt, cursor: 14 })
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner')
                const reader = new StringReader('{ }.list[ 1 ].')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    [getNbtCompoundTag({}), NbtPathSep, 'list', NbtPathIndexBegin, 1, NbtPathIndexEnd, NbtPathSep]
                ))
                assert.deepEqual(errors, [
                    new ParsingError(
                        { start: 14, end: 15 },
                        'expected a key or an index but got nothing'
                    )
                ])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [
                    { label: 'foo' },
                    { label: 'bar' }
                ])
            })
            it('Should return warnings for unknown key', () => {
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner')
                const reader = new StringReader('foo')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    ['foo']
                ))
                assert.deepEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 3 },
                        'unknown key ‘foo’',
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [])
            })
            it('Should not return warnings for unknown key when the compound tag allows additional children', () => {
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner/list/[]')
                const reader = new StringReader('non-existent')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    ['non-existent']
                ))
                assert.deepEqual(errors, [])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [])
            })
            it('Should return warnings for indexes under non-list tags', () => {
                const parser = new NbtPathArgumentParser('blocks', 'minecraft:banner')
                const reader = new StringReader('byteArray.[ { } ]')
                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepEqual(data, new NbtPath(
                    ['byteArray', NbtPathSep, NbtPathIndexBegin, getNbtCompoundTag({}), NbtPathIndexEnd]
                ))
                assert.deepEqual(errors, [
                    new ParsingError(
                        { start: 12, end: 13 },
                        "the current tag doesn't have extra items",
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepEqual(cache, {})
                assert.deepEqual(completions, [])
            })
        })
    })
})
