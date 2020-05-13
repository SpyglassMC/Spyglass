import assert = require('power-assert')
import { describe, it } from 'mocha'
import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { ArgumentParserManager } from '../../parsers/ArgumentParserManager'
import { NbtPathArgumentParser } from '../../parsers/NbtPathArgumentParser'
import { NodeDescription, NodeRange } from '../../nodes/ArgumentNode'
import { Keys, UnsortedKeys } from '../../nodes/MapNode'
import { NbtByteNode } from '../../nodes/NbtByteNode'
import { NbtCompoundKeyNode } from '../../nodes/NbtCompoundKeyNode'
import { NbtCompoundNode } from '../../nodes/NbtCompoundNode'
import { NbtPathNode } from '../../nodes/NbtPathNode'
import { NumberNode } from '../../nodes/NumberNode'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { NbtdocHelper } from '../../utils/NbtdocHelper'
import { StringReader } from '../../utils/StringReader'
import { $ } from '../utils.spec'
import { TestNbtdoc } from '../utils/NbtdocHelper.spec'

describe('NbtPathArgumentParser Tests', () => {
    describe('getExamples() Tests', () => {
        it('Should return examples respectfully', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const examples = parser.getExamples()
            assert.deepStrictEqual(examples, ['foo', 'foo.bar', 'foo[0]', '[0]', '[]', '{foo:bar}'])
        })
    })

    const parsers = new ArgumentParserManager()
    describe('parse() Tests', () => {
        it('Should parse a simple key', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('foo')

            const expectedKey = new NbtCompoundKeyNode(null, 'foo', 'foo', { start: 0 })
            expectedKey[NodeRange] = { start: 0, end: 3 }
            const expected = new NbtPathNode()
            expected[NodeRange] = { start: 0, end: 3 }
            expected.push(expectedKey)

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a simple compound filter', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('{ foo : 1b }')

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, $(new NbtPathNode(), [0, 12], {
                length: 1,
                0: $(new NbtCompoundNode(null), [0, 12], v => $(v, {
                    [UnsortedKeys]: ['foo'],
                    [Keys]: { foo: $(new NbtCompoundKeyNode(v, 'foo', 'foo', { start: 2 }), [2, 5]) },
                    foo: $(new NbtByteNode(v, 1, '1'), [8, 10])
                }))
            }))
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a simple number index', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('[ -1 ]')

            const expected = new NbtPathNode()
            expected[NodeRange] = { start: 0, end: 6 }
            expected.push(NbtPathNode.IndexBegin)
            expected.push($(new NumberNode(-1, '-1'), [2, 4]))
            expected.push(NbtPathNode.IndexEnd)

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
            const expectedFooKey = new NbtCompoundKeyNode(expectedCompound, 'foo', 'foo', { start: 4 })
            expectedFooKey[NodeRange] = { start: 4, end: 7 }
            expectedCompound[Keys].foo = expectedFooKey
            expectedCompound[UnsortedKeys].push('foo')
            const expected = new NbtPathNode()
            expected[NodeRange] = { start: 0, end: 16 }
            expected.push(NbtPathNode.IndexBegin)
            expected.push(expectedCompound)
            expected.push(NbtPathNode.IndexEnd)

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a compound filter after key', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('foo{ foo : 1b }')

            const expectedKey = new NbtCompoundKeyNode(null, 'foo', 'foo', { start: 0 })
            expectedKey[NodeRange] = { start: 0, end: 3 }

            const expectedCompound = new NbtCompoundNode(null)
            expectedCompound[NodeRange] = { start: 3, end: 15 }
            const expectedFoo = new NbtByteNode(expectedCompound, 1, '1')
            expectedFoo[NodeRange] = { start: 11, end: 13 }
            expectedCompound.foo = expectedFoo
            const expectedFooKey = new NbtCompoundKeyNode(expectedCompound, 'foo', 'foo', { start: 5 })
            expectedFooKey[NodeRange] = { start: 5, end: 8 }
            expectedCompound[Keys].foo = expectedFooKey
            expectedCompound[UnsortedKeys].push('foo')

            const expected = new NbtPathNode()
            expected[NodeRange] = { start: 0, end: 15 }
            expected.push(expectedKey)
            expected.push(expectedCompound)

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a crazy key after key', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('foo."crazy key"')

            const expectedKey1 = new NbtCompoundKeyNode(null, 'foo', 'foo', { start: 0 })
            expectedKey1[NodeRange] = { start: 0, end: 3 }
            const expectedKey2 = new NbtCompoundKeyNode(null, 'crazy key', '"crazy key"', { start: 5 })
            expectedKey2[NodeRange] = { start: 4, end: 15 }

            const expected = new NbtPathNode()
            expected[NodeRange] = { start: 0, end: 15 }
            expected.push(expectedKey1)
            expected.push(NbtPathNode.Sep)
            expected.push(expectedKey2)

            const { data, errors, cache, completions } = parser.parse(reader, ctx)

            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a key after compound filter', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('{ foo : 1b }.foo')

            const expectedKey = new NbtCompoundKeyNode(null, 'foo', 'foo', { start: 13 })
            expectedKey[NodeRange] = { start: 13, end: 16 }

            const expectedCompound = new NbtCompoundNode(null)
            expectedCompound[NodeRange] = { start: 0, end: 12 }
            const expectedFoo = new NbtByteNode(expectedCompound, 1, '1')
            expectedFoo[NodeRange] = { start: 8, end: 10 }
            expectedCompound.foo = expectedFoo
            const expectedFooKey = new NbtCompoundKeyNode(expectedCompound, 'foo', 'foo', { start: 2 })
            expectedFooKey[NodeRange] = { start: 2, end: 5 }
            expectedCompound[Keys].foo = expectedFooKey
            expectedCompound[UnsortedKeys].push('foo')

            const expected = new NbtPathNode()
            expected[NodeRange] = { start: 0, end: 16 }
            expected.push(expectedCompound)
            expected.push(NbtPathNode.Sep)
            expected.push(expectedKey)

            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })
        it('Should parse a key after index', () => {
            const parser = new NbtPathArgumentParser('minecraft:block')
            const reader = new StringReader('[].foo')

            const expectedKey = new NbtCompoundKeyNode(null, 'foo', 'foo', { start: 3 })
            expectedKey[NodeRange] = { start: 3, end: 6 }

            const expected = new NbtPathNode()
            expected[NodeRange] = { start: 0, end: 6 }
            expected.push(NbtPathNode.IndexBegin)
            expected.push(NbtPathNode.IndexEnd)
            expected.push(NbtPathNode.Sep)
            expected.push(expectedKey)

            const { data, errors, cache, completions } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data, expected)
            assert.deepStrictEqual(errors, [])
            assert.deepStrictEqual(cache, {})
            assert.deepStrictEqual(completions, [])
        })

        let ctx: ParsingContext
        before(async () => {
            ctx = constructContext({ parsers, nbtdoc: TestNbtdoc })
        })
        describe('schema Tests', () => {
            it('Should parse an existing child key without errors (#442)', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:complex')
                const reader = new StringReader('addition.foo')
                const { errors } = parser.parse(reader, ctx)

                assert.deepStrictEqual(errors, [])
            })
            it('Should return warning when the key is not in compound tags', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:complex')
                const reader = new StringReader('addition.foo')

                const expectedKey1 = new NbtCompoundKeyNode(null, 'addition', 'addition', { start: 0 })
                expectedKey1[NodeRange] = { start: 0, end: 8 }
                expectedKey1[NodeDescription] = NbtdocHelper.getKeyDescription({ Compound: 0 }, ' The additional complex compound')

                const expectedKey2 = new NbtCompoundKeyNode(null, 'foo', 'foo', { start: 9 })
                expectedKey2[NodeRange] = { start: 9, end: 12 }
                expectedKey2[NodeDescription] = NbtdocHelper.getKeyDescription('Boolean', ' The only field of this compound')

                const expected = new NbtPathNode()
                expected[NodeRange] = { start: 0, end: 12 }
                expected.push(expectedKey1)
                expected.push(NbtPathNode.Sep)
                expected.push(expectedKey2)

                const { data, errors, cache, completions } = parser.parse(reader, ctx)

                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [
                    new ParsingError(
                        { start: 9, end: 12 },
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

                const expectedKey = new NbtCompoundKeyNode(null, 'addition', 'addition', { start: 0 })
                expectedKey[NodeRange] = { start: 0, end: 8 }
                expectedKey[NodeDescription] = NbtdocHelper.getKeyDescription('Boolean', ' The additional boolean')

                const expectedCompound = new NbtCompoundNode(null)
                expectedCompound[NodeRange] = { start: 8, end: 12 }

                const expected = new NbtPathNode()
                expected[NodeRange] = { start: 0, end: 12 }
                expected.push(expectedKey)
                expected.push(expectedCompound)

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

                const expectedKey = new NbtCompoundKeyNode(null, 'addition', 'addition', { start: 0 })
                expectedKey[NodeRange] = { start: 0, end: 8 }
                expectedKey[NodeDescription] = NbtdocHelper.getKeyDescription('Boolean', ' The additional boolean')

                const expected = new NbtPathNode()
                expected[NodeRange] = { start: 0, end: 10 }
                expected.push(expectedKey)
                expected.push(NbtPathNode.IndexBegin)
                expected.push(NbtPathNode.IndexEnd)

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

                const { errors, cache, completions } = parser.parse(reader, ctx)
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
                const ctx = constructContext({ parsers, nbtdoc: TestNbtdoc, cursor: 0 })
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:boolean')
                const reader = new StringReader('')

                const { errors, cache, completions } = parser.parse(reader, ctx)
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
                        detail: 'Type: boolean',
                        documentation: 'The additional boolean',
                        insertText: 'addition',
                        kind: CompletionItemKind.Property
                    },
                    {
                        label: 'CustomModelData',
                        detail: 'Type: int',
                        documentation: 'The custom model data for this item',
                        insertText: 'CustomModelData',
                        kind: CompletionItemKind.Property
                    }
                ])
            })
            // FIXME: after MC-175504 is fixed.
            // it('Should return completions for key in single quotation marks', async () => {
            //     const ctx = constructContext({ parsers, nbt: TestNbtdoc, cursor: 1 })
            //     const parser = new NbtPathArgumentParser('minecraft:block', 'minecraft:one_boolean_field')
            //     const reader = new StringReader("''")

            //     const { completions } = parser.parse(reader, ctx)
            //     assert.deepStrictEqual(completions, [
            //         {
            //             label: 'foo',
            //             detail: 'Type: boolean',
            //             documentation: 'The only field of this compound',
            //             insertText: 'foo',
            //             kind: CompletionItemKind.Property
            //         }
            //     ])
            // })
            it('Should return completions for key in double quotation marks', async () => {
                const ctx = constructContext({ parsers, nbtdoc: TestNbtdoc, cursor: 1 })
                const parser = new NbtPathArgumentParser('minecraft:block', 'minecraft:one_boolean_field')
                const reader = new StringReader('""')

                const { completions } = parser.parse(reader, ctx)
                assert.deepStrictEqual(completions, [
                    {
                        label: 'foo',
                        detail: 'Type: boolean',
                        documentation: 'The only field of this compound',
                        insertText: 'foo',
                        kind: CompletionItemKind.Property
                    }
                ])
            })
            it('Should return completions for sub keys under list tag', async () => {
                const ctx = constructContext({ parsers, nbtdoc: TestNbtdoc, cursor: 18 })
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:list')
                const reader = new StringReader('{ }.addition[ 1 ].')

                const expectedKey = new NbtCompoundKeyNode(null, 'addition', 'addition', { start: 4 })
                expectedKey[NodeRange] = { start: 4, end: 12 }
                expectedKey[NodeDescription] = NbtdocHelper.getKeyDescription(
                    { List: { length_range: null, value_type: { Compound: 1 } } },
                    ' The additional complex list'
                )

                const expectedCompound = new NbtCompoundNode(null)
                expectedCompound[NodeRange] = { start: 0, end: 3 }

                const expected = new NbtPathNode()
                expected[NodeRange] = { start: 0, end: 18 }
                expected.push(expectedCompound)
                expected.push(NbtPathNode.Sep)
                expected.push(expectedKey)
                expected.push(NbtPathNode.IndexBegin)
                expected.push($(new NumberNode(1, '1'), [14, 15]))
                expected.push(NbtPathNode.IndexEnd)
                expected.push(NbtPathNode.Sep)

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
                        detail: 'Type: boolean',
                        documentation: 'The only field of this compound',
                        insertText: 'foo',
                        kind: CompletionItemKind.Property
                    }
                ])
            })
            it('Should return warnings for unknown key', () => {
                const parser = new NbtPathArgumentParser('minecraft:block', 'minecraft:one_boolean_field')
                const reader = new StringReader('bar')

                const expectedKey = new NbtCompoundKeyNode(null, 'bar', 'bar', { start: 0 })
                expectedKey[NodeRange] = { start: 0, end: 3 }

                const expected = new NbtPathNode()
                expected[NodeRange] = { start: 0, end: 3 }
                expected.push(expectedKey)

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

                const expectedKey = new NbtCompoundKeyNode(null, 'non-existent', 'non-existent', { start: 0 })
                expectedKey[NodeRange] = { start: 0, end: 12 }

                const expected = new NbtPathNode()
                expected[NodeRange] = { start: 0, end: 12 }
                expected.push(expectedKey)

                const { data, errors, cache, completions } = parser.parse(reader, ctx)
                assert.deepStrictEqual(data, expected)
                assert.deepStrictEqual(errors, [])
                assert.deepStrictEqual(cache, {})
                assert.deepStrictEqual(completions, [])
            })
            it('Should return warnings for indexes under non-list tags', () => {
                const parser = new NbtPathArgumentParser('minecraft:item', 'minecraft:byte_array')
                const reader = new StringReader('addition.[ { } ]')

                const expectedKey = new NbtCompoundKeyNode(null, 'addition', 'addition', { start: 0 })
                expectedKey[NodeRange] = { start: 0, end: 8 }
                expectedKey[NodeDescription] = NbtdocHelper.getKeyDescription(
                    { ByteArray: { length_range: null, value_range: null } },
                    ' The additional byte array'
                )

                const expectedCompound = new NbtCompoundNode(null)
                expectedCompound[NodeRange] = { start: 11, end: 14 }

                const expected = new NbtPathNode()
                expected[NodeRange] = { start: 0, end: 16 }
                expected.push(expectedKey, NbtPathNode.Sep, NbtPathNode.IndexBegin, expectedCompound, NbtPathNode.IndexEnd)

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
