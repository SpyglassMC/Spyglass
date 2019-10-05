import * as assert from 'power-assert'
import NbtSchemaWalker from '../../utils/NbtSchemaWalker'
import ParsingError from '../../types/ParsingError'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { NBTNode, ValueList, CompoundNode, RootNode } from 'mc-nbt-paths'

describe('NbtSchemaWalker Tests', () => {
    const schemas: { [key: string]: NBTNode | ValueList } = {
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
                '../ref/lockable.json',
                '../ref/test.json'
            ],
            children: {
                Primary: {
                    type: 'int',
                    suggestions: [
                        {
                            values: '../misc_group/effect_id.json'
                        }
                    ]
                },
                Secondary: {
                    type: 'int',
                    suggestions: [
                        {
                            values: '../misc_group/effect_id.json'
                        }
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
                Command: {
                    type: 'string',
                    description: 'The command to run',
                    suggestions: [
                        {
                            function: {
                                id: 'command'
                            }
                        }
                    ]
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
                '$../block/group/command_block.json': {
                    ref: '../block/command_block.json'
                },
                'minecraft:banner': {
                    ref: '../block/banner.json'
                },
                'minecraft:beacon': {
                    ref: '../block/beacon.json'
                }
            }
        }
    }
    let walker: NbtSchemaWalker
    beforeEach(() => {
        walker = new NbtSchemaWalker(schemas)
    })
    describe('goFile() Tests', () => {
        it('Should go to file correctly', () => {
            walker
                .goFile('roots/blocks.json')
                .goFile('../block/banner.json')
            const actual = walker.filePath.full
            assert(actual === 'block/banner.json')
        })
        it('Should stay with empty relative path', () => {
            walker
                .goFile('block/banner.json')
                .goFile('')
            const actual = walker.filePath.full
            assert(actual === 'block/banner.json')
        })
        it("Should throw error when the path does't exist", () => {
            try {
                walker.
                    goFile('parent')
                fail()
            } catch ({ message }) {
                assert(message === 'Path not found: join(‘’, ‘parent’) => ‘parent’')
            }
        })
    })
    describe('goAnchor() Tests', () => {
        it('Should go to anchor correctly', () => {
            walker.goAnchor('minecraft:banner')
            const actual = walker.anchorPath.full
            assert(actual === 'minecraft:banner')
        })
    })
    describe('go() Tests', () => {
        it('Should go correctly', () => {
            walker.go('roots/blocks.json#minecraft:banner')
            const actualAnchorPath = walker.anchorPath.full
            const actualFilePath = walker.filePath.full
            assert(actualAnchorPath === 'minecraft:banner')
            assert(actualFilePath === 'roots/blocks.json')
        })
    })
    describe('read() Tests', () => {
        it('Should return a ValueList', () => {
            const actual = walker
                .go('block/group/command_block.json')
                .read()
            assert(actual === schemas['block/group/command_block.json'])
        })
        it('Should return RootNode', () => {
            const actual = walker
                .go('roots/blocks.json')
                .read()
            assert(actual === schemas['roots/blocks.json'])
        })
        it('Should handle regular anchors for RootNode', () => {
            const actual = walker
                .go('roots/blocks.json#minecraft:banner')
                .read()
            assert(actual === schemas['block/banner.json'])
        })
        it('Should handle anchors beginning with $ for RootNode', () => {
            const actual = walker
                .go('roots/blocks.json#minecraft:repeating_command_block')
                .read()
            assert(actual === schemas['block/command_block.json'])
        })
        it('Should handle child_ref in a CompoundNode', () => {
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
                                { values: '../misc_group/effect_id.json' }
                            ]
                        },
                        Secondary: {
                            type: 'int',
                            suggestions: [
                                { values: '../misc_group/effect_id.json' }
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
            const actual = walker
                .go('roots/blocks.json#minecraft:banner/list/[]')
                .read()
            assert.deepStrictEqual(actual, { type: 'no-nbt' })
        })
        it('Should handle anchors to references', () => {
            const actual = walker
                .go('roots/blocks.json#minecraft:banner/refTest/foo')
                .read()
            assert.deepStrictEqual(actual, { type: 'no-nbt', description: 'references test' })
        })
        it("Should throw error when the anchor doen't exist for a CompoundNode", () => {
            try {
                walker
                    .go('roots/blocks.json#minecraft:banner/non-existent')
                    .read()
                fail()
            } catch ({ message }) {
                assert(message === 'Path not found: ‘roots/blocks.json#minecraft:banner/non-existent’ [‘non-existent’].')
            }
        })
        it("Should throw error when the anchor doen't exist for a RootNode", () => {
            try {
                walker
                    .go('roots/blocks.json#non-existent')
                    .read()
                fail()
            } catch ({ message }) {
                assert(message === 'Path not found: ‘roots/blocks.json#non-existent’ [‘non-existent’].')
            }
        })
        it("Should throw error when the anchor doen't exist for a ListNode", () => {
            try {
                walker
                    .go('roots/blocks.json#minecraft:banner/list/oops')
                    .read()
                fail()
            } catch ({ message }) {
                assert(message === 'Path not found: ‘roots/blocks.json#minecraft:banner/list/oops’ [‘oops’].')
            }
        })
        it("Should throw error when the anchor doen't exist in the references", () => {
            try {
                walker
                    .go('roots/blocks.json#minecraft:banner/refTest/non-existent')
                    .read()
                fail()
            } catch ({ message }) {
                assert(message === 'Path not found: ‘roots/blocks.json#minecraft:banner/refTest/non-existent’ [‘non-existent’].')
            }
        })
    })
    describe('static Tests', () => {
        it('isRootNode() should return correctly', () => {
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
        it('isFunctionNode() should return correctly', () => {
            const actualF = NbtSchemaWalker.isFunctionNode(schemas['block/banner.json'])
            const actualT = NbtSchemaWalker.isFunctionNode({ function: { id: 'a' } })
            assert(actualF === false)
            assert(actualT === true)
        })
        it('isRefNode() should return correctly', () => {
            const actualF = NbtSchemaWalker.isRefNode(schemas['block/banner.json'])
            const actualT = NbtSchemaWalker.isRefNode(
                (schemas['roots/blocks.json'] as RootNode).children['minecraft:banner']
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
    })
})
