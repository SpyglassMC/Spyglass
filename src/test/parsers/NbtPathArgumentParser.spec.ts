import assert = require('power-assert')
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import NbtPathNode, { NbtPathIndexBegin, NbtPathIndexEnd, NbtPathSep } from '../../types/nodes/NbtPathNode'
import NbtPathArgumentParser from '../../parsers/NbtPathArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import ParsingContext, { constructContext } from '../../types/ParsingContext'
import { describe, it } from 'mocha'
import { DiagnosticSeverity, CompletionItemKind } from 'vscode-languageserver'
import NbtCompoundNode from '../../types/nodes/map/NbtCompoundNode'
import { NodeRange } from '../../types/nodes/ArgumentNode'
import NbtByteNode from '../../types/nodes/nbt/NbtByteNode'
import { TestNbtdoc } from '../utils/NbtdocHelper.spec'
import { Keys } from '../../types/nodes/map/MapNode'
import NbtCompoundKeyNode from '../../types/nodes/map/NbtCompoundKeyNode'

describe('NbtPathArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples respectfully', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const examples = parser.getExamples()
            assert.deepStrictEqual(examples, ['foo', 'foo.bar', 'foo[0]', '[0]', '[]', '{foo:bar}'])
        })
    })

    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ parsers })
    })
    describe('parse() Tests', () => {
        it('Should parse a simple key', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('foo')

            const expectedKey = new NbtCompoundKeyNode(null, 'foo', 'foo', [0, 1, 2])
            expectedKey[NodeRange] = { start: 0, end: 3 }
            const expected = new NbtPathNode([expectedKey])
            expected[NodeRange] = { start: 0, end: 3 }

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a simple compound filter', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('{ foo : 1b }')

            const expectedCompound = new NbtCompoundNode(null)
            expectedCompound[NodeRange] = { start: 0, end: 12 }
            const expectedFoo = new NbtByteNode(expectedCompound, 1, '1')
            expectedFoo[NodeRange] = { start: 8, end: 10 }
            expectedCompound.foo = expectedFoo
            const expectedFooKey = new NbtCompoundKeyNode(expectedCompound, 'foo', 'foo', [2, 3, 4])
            expectedFooKey[NodeRange] = { start: 2, end: 5 }
            expectedCompound[Keys].foo = expectedFooKey
            const expected = new NbtPathNode([expectedCompound])
            expected[NodeRange] = { start: 0, end: 12 }

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a simple number index', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('[ -1 ]')

            const expected = new NbtPathNode([NbtPathIndexBegin, -1, NbtPathIndexEnd])
            expected[NodeRange] = { start: 0, end: 6 }

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a compound filter in index', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('[ { foo : 1b } ]')

            const expectedCompound = new NbtCompoundNode(null)
            expectedCompound[NodeRange] = { start: 2, end: 14 }
            const expectedFoo = new NbtByteNode(expectedCompound, 1, '1')
            expectedFoo[NodeRange] = { start: 10, end: 12 }
            expectedCompound.foo = expectedFoo
            const expectedFooKey = new NbtCompoundKeyNode(expectedCompound, 'foo', 'foo', [4, 5, 6])
            expectedFooKey[NodeRange] = { start: 4, end: 7 }
            expectedCompound[Keys].foo = expectedFooKey
            const expected = new NbtPathNode([NbtPathIndexBegin, expectedCompound, NbtPathIndexEnd])
            expected[NodeRange] = { start: 0, end: 16 }

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a compound filter after key', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('foo{ foo : 1b }')

            const expectedKey = new NbtCompoundKeyNode(null, 'foo', 'foo', [0, 1, 2])
            expectedKey[NodeRange] = { start: 0, end: 3 }

            const expectedCompound = new NbtCompoundNode(null)
            expectedCompound[NodeRange] = { start: 3, end: 15 }
            const expectedFoo = new NbtByteNode(expectedCompound, 1, '1')
            expectedFoo[NodeRange] = { start: 11, end: 13 }
            expectedCompound.foo = expectedFoo
            const expectedFooKey = new NbtCompoundKeyNode(expectedCompound, 'foo', 'foo', [5, 6, 7])
            expectedFooKey[NodeRange] = { start: 5, end: 8 }
            expectedCompound[Keys].foo = expectedFooKey

            const expected = new NbtPathNode([expectedKey, expectedCompound])
            expected[NodeRange] = { start: 0, end: 15 }

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a crazy key after key', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('foo."crazy key"')

            const expectedKey1 = new NbtCompoundKeyNode(null, 'foo', 'foo', [0, 1, 2])
            expectedKey1[NodeRange] = { start: 0, end: 3 }
            const expectedKey2 = new NbtCompoundKeyNode(null, 'crazy key', '"crazy key"', [5, 6, 7, 8, 9, 10, 11, 12, 13])
            expectedKey2[NodeRange] = { start: 4, end: 15 }

            const expected = new NbtPathNode([expectedKey1, NbtPathSep, expectedKey2])
            expected[NodeRange] = { start: 0, end: 15 }

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a key after compound filter', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('{ foo : 1b }.foo')

            const expectedKey = new NbtCompoundKeyNode(null, 'foo', 'foo', [13, 14, 15])
            expectedKey[NodeRange] = { start: 13, end: 16 }

            const expectedCompound = new NbtCompoundNode(null)
            expectedCompound[NodeRange] = { start: 0, end: 12 }
            const expectedFoo = new NbtByteNode(expectedCompound, 1, '1')
            expectedFoo[NodeRange] = { start: 8, end: 10 }
            expectedCompound.foo = expectedFoo
            const expectedFooKey = new NbtCompoundKeyNode(expectedCompound, 'foo', 'foo', [2, 3, 4])
            expectedFooKey[NodeRange] = { start: 2, end: 5 }
            expectedCompound[Keys].foo = expectedFooKey

            const expected = new NbtPathNode([expectedCompound, NbtPathSep, expectedKey])
            expected[NodeRange] = { start: 0, end: 16 }

            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a key after index', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('[].foo')

            const expectedKey = new NbtCompoundKeyNode(null, 'foo', 'foo', [3, 4, 5])
            expectedKey[NodeRange] = { start: 3, end: 6 }

            const expected = new NbtPathNode([NbtPathIndexBegin, NbtPathIndexEnd, NbtPathSep, expectedKey])
            expected[NodeRange] = { start: 0, end: 6 }

            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })

        let ctx: ParsingContext
        before(async () => {
            ctx = await constructContext({ parsers, nbt: TestNbtdoc })
        })
        describe('schema Tests', () => {
            it('Should return warning when the key is not in compound tags', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:boolean')
                const reader = new StringReader('addition.foo')

                const expectedKey1 = new NbtCompoundKeyNode(null, 'addition', 'addition', [0, 1, 2, 3, 4, 5, 6, 7])
                expectedKey1[NodeRange] = { start: 0, end: 8 }

                const expectedKey2 = new NbtCompoundKeyNode(null, 'foo', 'foo', [9, 10, 11])
                expectedKey2[NodeRange] = { start: 9, end: 12 }

                const expected = new NbtPathNode([expectedKey1, NbtPathSep, expectedKey2])
                expected[NodeRange] = { start: 0, end: 12 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 9, end: 10 },
                        'Keys are only used for compound tags',
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [])
            })
            it('Should return warning when the compound filter is not in compound tags', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:boolean')
                const reader = new StringReader('addition{  }')

                const expectedKey = new NbtCompoundKeyNode(null, 'addition', 'addition', [0, 1, 2, 3, 4, 5, 6, 7])
                expectedKey[NodeRange] = { start: 0, end: 8 }

                const expectedCompound = new NbtCompoundNode(null)
                expectedCompound[NodeRange] = { start: 8, end: 12 }

                const expected = new NbtPathNode([expectedKey, expectedCompound])
                expected[NodeRange] = { start: 0, end: 12 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)

                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 8, end: 9 },
                        'Compound filters are only used for compound tags',
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [])
            })
            it('Should return warning when the index is not in list tags', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:boolean')
                const reader = new StringReader('addition[]')

                const expectedKey = new NbtCompoundKeyNode(null, 'addition', 'addition', [0, 1, 2, 3, 4, 5, 6, 7])
                expectedKey[NodeRange] = { start: 0, end: 8 }

                const expected = new NbtPathNode([expectedKey, NbtPathIndexBegin, NbtPathIndexEnd])
                expected[NodeRange] = { start: 0, end: 10 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 8, end: 9 },
                        'Indexes are only used for lists/arrays tags',
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [])
            })
            it('Should return error when the input is empty', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:boolean')
                const reader = new StringReader('')

                const expected = new NbtPathNode([])
                expected[NodeRange] = { start: 0, end: 0 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 1 },
                        'Expected a compound filter, a key, or an index but got nothing'
                    )
                ])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [])
            })
            it('Should return completions for key', async () => {
                const ctx = await constructContext({ parsers, nbt: TestNbtdoc, cursor: 0 })
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:boolean')
                const reader = new StringReader('')

                const expected = new NbtPathNode([])
                expected[NodeRange] = { start: 0, end: 0 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 1 },
                        'Expected a compound filter, a key, or an index but got nothing'
                    )
                ])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [
                    {
                        label: 'addition',
                        detail: 'Type: Boolean',
                        documentation: 'The additional boolean',
                        insertText: 'addition',
                        kind: CompletionItemKind.Property
                    },
                    {
                        label: 'CustomModelData',
                        detail: 'Type: Int',
                        documentation: 'The custom model data for this item',
                        insertText: 'CustomModelData',
                        kind: CompletionItemKind.Property
                    }
                ])
            })
            it('Should return completions for sub keys under list tag', async () => {
                const ctx = await constructContext({ parsers, nbt: TestNbtdoc, cursor: 18 })
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:list')
                const reader = new StringReader('{ }.addition[ 1 ].')

                const expectedKey = new NbtCompoundKeyNode(null, 'addition', 'addition', [4, 5, 6, 7, 8, 9, 10, 11])
                expectedKey[NodeRange] = { start: 4, end: 12 }

                const expectedCompound = new NbtCompoundNode(null)
                expectedCompound[NodeRange] = { start: 0, end: 3 }

                const expected = new NbtPathNode([expectedCompound, NbtPathSep, expectedKey, NbtPathIndexBegin, 1, NbtPathIndexEnd, NbtPathSep])
                expected[NodeRange] = { start: 0, end: 18 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)

                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 18, end: 19 },
                        'Expected a key or an index but got nothing'
                    )
                ])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [
                    {
                        label: 'foo',
                        detail: 'Type: Boolean',
                        documentation: 'The only field of this compound',
                        insertText: 'foo',
                        kind: CompletionItemKind.Property
                    }
                ])
            })
            it('Should return warnings for unknown key', () => {
                const parser = new NbtPathArgumentParser('minecraft:block', 'minecraft:one_boolean_field')
                const reader = new StringReader('bar')

                const expectedKey = new NbtCompoundKeyNode(null, 'bar', 'bar', [0, 1, 2])
                expectedKey[NodeRange] = { start: 0, end: 3 }

                const expected = new NbtPathNode([expectedKey])
                expected[NodeRange] = { start: 0, end: 3 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 0, end: 3 },
                        'Unknown key ‘bar’',
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [])
            })
            it('Should not return warnings for unknown key when the compound tag allows additional children', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:boolean')
                const reader = new StringReader('non-existent')

                const expectedKey = new NbtCompoundKeyNode(null, 'non-existent', 'non-existent', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                expectedKey[NodeRange] = { start: 0, end: 12 }

                const expected = new NbtPathNode([expectedKey])
                expected[NodeRange] = { start: 0, end: 12 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [])
            })
            it('Should return warnings for indexes under non-list tags', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:byte_array')
                const reader = new StringReader('addition.[ { } ]')

                const expectedKey = new NbtCompoundKeyNode(null, 'addition', 'addition', [0, 1, 2, 3, 4, 5, 6, 7])
                expectedKey[NodeRange] = { start: 0, end: 8 }

                const expectedCompound = new NbtCompoundNode(null)
                expectedCompound[NodeRange] = { start: 11, end: 14 }

                const expected = new NbtPathNode([expectedKey, NbtPathSep, NbtPathIndexBegin, expectedCompound, NbtPathIndexEnd])
                expected[NodeRange] = { start: 0, end: 16 }

                const { data, errors, cache, completions } = parser.parse(reader, ctx)

                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 11, end: 12 },
                        "The current tag doesn't have extra items",
                        true, DiagnosticSeverity.Warning
                    )
                ])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [])
            })
        })
    })
})
