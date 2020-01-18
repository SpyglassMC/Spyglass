import assert = require('power-assert')
import ArgumentParserManager from '../../parsers/ArgumentParserManager'
import NbtSchemaWalker from '../../utils/NbtSchemaWalker'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { NbtSchemaNode, ValueList, NbtRootSchemaNode } from '../../types/NbtSchema'
import StringReader from '../../utils/StringReader'
import LiteralArgumentParser from '../../parsers/LiteralArgumentParser'
import { CompletionItemKind } from 'vscode-languageserver'
import ParsingContext, { constructContext } from '../../types/ParsingContext'

describe('NbtSchemaWalker Tests', () => {
    const schemas: { [key: string]: NbtSchemaNode | ValueList } = {
        'block/banner.json': {
            type: 'compound',
            children: {
                Base: {
                    type: 'int',
                    description: 'The base color of the banner'
                },
                list: {
                    type: 'list',
                    item: { type: 'no-nbt' }
                },
                refTest: {
                    type: 'no-nbt',
                    references: {
                        foo: { type: 'no-nbt', description: 'references test' }
                    }
                }
            }
        },
        'block/beacon.json': {
            type: 'compound',
            child_ref: [
                'ref/lockable.json',
                'ref/test.json'
            ],
            children: {
                Primary: {
                    type: 'int',
                    suggestions: [
                        { parser: 'NumericID', params: ['minecraft:mob_effect'] }
                    ]
                },
                Secondary: {
                    type: 'int',
                    suggestions: [
                        { parser: 'NumericID', params: ['minecraft:mob_effect'] }
                    ]
                }
            }
        },
        'block/command_block.json': {
            type: 'compound',
            children: {
                auto: {
                    type: 'byte',
                    description: 'Whether the command block should be automatically powered'
                },
                conditionMet: {
                    type: 'byte',
                    description: 'If the command block executed last time it was powered (True if not conditional)'
                },
                LastExecution: {
                    type: 'long',
                    description: 'Tick the chain command block last executed'
                },
                LastOutput: {
                    type: 'string',
                    description: 'The description of the last output'
                },
                powered: {
                    type: 'byte',
                    description: 'If the command block is powered by redstone'
                },
                SuccessCount: {
                    type: 'int',
                    description: 'The success count of the command run'
                },
                TrackOutput: {
                    type: 'byte',
                    description: 'Should the command block should write to LastOutput'
                },
                UpdateLastExecution: {
                    type: 'byte',
                    description: 'Should the command block only execute once a tick'
                }
            }
        },
        'block/group/command_block.json': [
            'minecraft:command_block',
            'minecraft:chain_command_block',
            {
                description: 'A purple command block',
                value: 'minecraft:repeating_command_block'
            }
        ],
        'ref/lockable.json': {
            type: 'compound',
            children: {
                Lock: {
                    type: 'string',
                    description: 'The name of the item a player has to be holding to open this container'
                }
            }
        },
        'ref/test.json': {
            type: 'compound',
            additionalChildren: true,
            children: {
                foo: {
                    type: 'string'
                }
            }
        },
        'roots/blocks.json': {
            type: 'root',
            children: {
                none: {
                    type: 'no-nbt'
                },
                '$block/group/command_block.json': {
                    ref: 'block/command_block.json'
                },
                'minecraft:banner': {
                    ref: 'block/banner.json'
                },
                'minecraft:beacon': {
                    ref: 'block/beacon.json'
                }
            }
        },
        'suggestionsTest.json': {
            type: 'no-nbt',
            references: {
                raw: {
                    type: 'no-nbt',
                    suggestions: ['foo']
                },
                detailed: {
                    type: 'no-nbt',
                    suggestions: [{ value: 'bar', description: 'The Bar' }]
                },
                argumentParser: {
                    type: 'no-nbt',
                    suggestions: [{ parser: 'Literal', params: ['baz', 'qux'] }]
                },
                argumentParserWithVariables: {
                    type: 'no-nbt',
                    suggestions: [{ parser: 'NamespacedID', params: ['$bossbars', undefined, '%isPredicate%'] }]
                },
                lineParser: {
                    type: 'no-nbt',
                    suggestions: [{
                        parser: '#',
                        params: [
                            true,
                            'commands',
                            {
                                commands: { execute: { parser: new LiteralArgumentParser('foo'), executable: true } }
                            }
                        ]
                    }]
                }
            }
        }
    }
    describe('goFile() Tests', () => {
        it('Should go to file correctly', () => {
            const walker = new NbtSchemaWalker(schemas)
            walker
                .goFile('roots/blocks.json')
                .goFile('block/banner.json')
            const actual = walker.filePath
            assert(actual === 'block/banner.json')
        })
        it("Should throw error when the path does't exist", () => {
            const walker = new NbtSchemaWalker(schemas)
            try {
                walker.
                    goFile('parent')
                fail()
            } catch ({ message }) {
                assert(message === 'path not found: ‘parent’')
            }
        })
    })
    describe('goAnchor() Tests', () => {
        it('Should go to anchor correctly', () => {
            const walker = new NbtSchemaWalker(schemas)
            walker
                .goAnchor('minecraft:banner')
                .goAnchor('test')
            const actual = walker.anchorPath.full
            assert(actual === 'minecraft:banner/test')
        })
    })
    describe('get path() Tests', () => {
        it('Should return correctly', () => {
            const walker = new NbtSchemaWalker(schemas)
            walker
                .goAnchor('minecraft:banner')
                .goAnchor('test')
            const actual = walker.path
            assert(actual === '#minecraft:banner/test')
        })
    })
    describe('go() Tests', () => {
        it('Should go correctly', () => {
            const walker = new NbtSchemaWalker(schemas)
            walker.go('roots/blocks.json#minecraft:banner')
            const actualAnchorPath = walker.anchorPath.full
            const actualFilePath = walker.filePath
            assert(actualAnchorPath === 'minecraft:banner')
            assert(actualFilePath === 'roots/blocks.json')
        })
    })
    describe('read() Tests', () => {
        it('Should return the cache to improve performance', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual1 = walker
                .go('block/group/command_block.json')
                .read()
            const actual2 = walker
                .go('block/group/command_block.json')
                .read()
            assert(actual1 === actual2)
        })
        it('Should return a ValueList', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('block/group/command_block.json')
                .read()
            assert(actual === schemas['block/group/command_block.json'])
        })
        it('Should return NbtRootSchemaNode', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('roots/blocks.json')
                .read()
            assert(actual === schemas['roots/blocks.json'])
        })
        it('Should handle regular anchors for NbtRootSchemaNode', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('roots/blocks.json#minecraft:banner')
                .read()
            assert(actual === schemas['block/banner.json'])
        })
        it('Should handle anchors beginning with $ for NbtRootSchemaNode', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('roots/blocks.json#minecraft:repeating_command_block')
                .read()
            assert(actual === schemas['block/command_block.json'])
        })
        it('Should handle child_ref in a CompoundNode', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('block/beacon.json')
                .read()
            assert.deepStrictEqual(
                actual,
                {
                    type: 'compound',
                    additionalChildren: true,
                    children: {
                        Primary: {
                            type: 'int',
                            suggestions: [
                                { parser: 'NumericID', params: ['minecraft:mob_effect'] }
                            ]
                        },
                        Secondary: {
                            type: 'int',
                            suggestions: [
                                { parser: 'NumericID', params: ['minecraft:mob_effect'] }
                            ]
                        },
                        Lock: {
                            type: 'string',
                            description: 'The name of the item a player has to be holding to open this container'
                        },
                        foo: {
                            type: 'string'
                        }
                    }
                }
            )
        })
        it('Should handle [] anchor for a ListNode', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('roots/blocks.json#minecraft:banner/list/[]')
                .read()
            assert.deepStrictEqual(actual, { type: 'no-nbt' })
        })
        it('Should handle anchors to references', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('roots/blocks.json#minecraft:banner/refTest/foo')
                .read()
            assert.deepStrictEqual(actual, { type: 'no-nbt', description: 'references test' })
        })
        it("Should throw error when the anchor doen't exist for a CompoundNode", () => {
            const walker = new NbtSchemaWalker(schemas)
            try {
                walker
                    .go('roots/blocks.json#minecraft:banner/non-existent')
                    .read()
                fail()
            } catch ({ message }) {
                assert(message === 'path not found: ‘roots/blocks.json#minecraft:banner/non-existent’ [‘non-existent’]')
            }
        })
        it("Should throw error when the anchor doen't exist for a NbtRootSchemaNode", () => {
            const walker = new NbtSchemaWalker(schemas)
            try {
                walker
                    .go('roots/blocks.json#non-existent')
                    .read()
                fail()
            } catch ({ message }) {
                assert(message === 'path not found: ‘roots/blocks.json#non-existent’ [‘non-existent’]')
            }
        })
        it("Should throw error when the anchor doen't exist for a ListNode", () => {
            const walker = new NbtSchemaWalker(schemas)
            try {
                walker
                    .go('roots/blocks.json#minecraft:banner/list/oops')
                    .read()
                fail()
            } catch ({ message }) {
                assert(message === 'path not found: ‘roots/blocks.json#minecraft:banner/list/oops’ [‘oops’]')
            }
        })
        it("Should throw error when the anchor doen't exist in the references", () => {
            const walker = new NbtSchemaWalker(schemas)
            try {
                walker
                    .go('roots/blocks.json#minecraft:banner/refTest/non-existent')
                    .read()
                fail()
            } catch ({ message }) {
                assert(message === 'path not found: ‘roots/blocks.json#minecraft:banner/refTest/non-existent’ [‘non-existent’]')
            }
        })
    })

    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        ctx = await constructContext({ parsers })
    })
    describe('getParserResult() Tests', () => {
        it('Should return empty completions when there are not any suggestions', async () => {
            const ctx = await constructContext({ parsers, cursor: 0 })
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('block/banner.json')
                .getParserResult(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions, [])
        })
        it('Should return empty completions for raw suggestions when the cursor is not at the point', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('suggestionsTest.json#raw')
                .getParserResult(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions, [])
        })
        it('Should return completions for raw suggestions', async () => {
            const ctx = await constructContext({ parsers, cursor: 0 })
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('suggestionsTest.json#raw')
                .getParserResult(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions, [
                { label: 'foo' }
            ])
        })
        it('Should return empty completions for detailed suggestions when the cursor is not at the point', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('suggestionsTest.json#detailed')
                .getParserResult(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions, [])
        })
        it('Should return completions for detailed suggestions', async () => {
            const ctx = await constructContext({ parsers, cursor: 0 })
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('suggestionsTest.json#detailed')
                .getParserResult(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions, [
                { label: 'bar', documentation: 'The Bar' }
            ])
        })
        it('Should return completions for argument parser suggestions', async () => {
            const ctx = await constructContext({ parsers, cursor: 0 })
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('suggestionsTest.json#argumentParser')
                .getParserResult(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions, [
                { label: 'baz' },
                { label: 'qux' }
            ])
        })
        it('Should return completions for argument parser suggestions with variables', async () => {
            const cache = {
                bossbars: {
                    'minecraft:foo': {
                        def: [],
                        ref: []
                    }
                }
            }
            const ctx = await constructContext({ parsers, cache, cursor: 0 })
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('suggestionsTest.json#argumentParserWithVariables')
                .getParserResult(new StringReader(''), ctx, { isPredicate: true })
            assert.deepStrictEqual(actual.completions, [
                {
                    label: 'minecraft',
                    kind: CompletionItemKind.Module,
                    commitCharacters: [
                        ':'
                    ]
                }
            ])
        })
        it('Should return completions for line parser suggestions', async () => {
            const ctx = await constructContext({ parsers, cursor: 0 })
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('suggestionsTest.json#lineParser')
                .getParserResult(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions, [
                { label: '/' }
            ])
        })
        it('Should return empty completions when the result completions of line parser is undefined', () => {
            const walker = new NbtSchemaWalker(schemas)
            const actual = walker
                .go('suggestionsTest.json#lineParser')
                .getParserResult(new StringReader(''), ctx)
            assert.deepStrictEqual(actual.completions, [])
        })
    })
    describe('static Tests', () => {
        it('isNbtRootSchemaNode() should return correctly', () => {
            const actualF = NbtSchemaWalker.isRootNode(schemas['block/banner.json'])
            const actualT = NbtSchemaWalker.isRootNode(schemas['roots/blocks.json'])
            assert(actualF === false)
            assert(actualT === true)
        })
        it('isCompoundNode() should return correctly', () => {
            const actualF = NbtSchemaWalker.isCompoundNode(schemas['roots/blocks.json'])
            const actualT = NbtSchemaWalker.isCompoundNode(schemas['block/banner.json'])
            assert(actualF === false)
            assert(actualT === true)
        })
        it('isListNode() should return correctly', () => {
            const actualF = NbtSchemaWalker.isListNode(schemas['block/banner.json'])
            const actualT = NbtSchemaWalker.isListNode({ type: 'list', item: { type: 'no-nbt' } })
            assert(actualF === false)
            assert(actualT === true)
        })
        it('isRefNode() should return correctly', () => {
            const actualF = NbtSchemaWalker.isRefNode(schemas['block/banner.json'])
            const actualT = NbtSchemaWalker.isRefNode(
                (schemas['roots/blocks.json'] as NbtRootSchemaNode).children['minecraft:banner']
            )
            assert(actualF === false)
            assert(actualT === true)
        })
        it('isValueList() should return correctly', () => {
            const actualF = NbtSchemaWalker.isValueList(schemas['block/banner.json'])
            const actualT = NbtSchemaWalker.isValueList(schemas['block/group/command_block.json'])
            assert(actualF === false)
            assert(actualT === true)
        })
        it('isNoPropertyNode() should return correctly', () => {
            const actualF = NbtSchemaWalker.isNoPropertyNode(schemas['block/banner.json'])
            const actualT = NbtSchemaWalker.isNoPropertyNode(
                (schemas['block/banner.json'] as any).children.Base
            )
            assert(actualF === false)
            assert(actualT === true)
        })
        it('getString() should return correctly', () => {
            const actual1 = NbtSchemaWalker.getString('byte')
            const actual2 = NbtSchemaWalker.getString('int_array')
            assert(actual1 === 'a byte tag')
            assert(actual2 === 'an int array tag')
        })
    })
})
