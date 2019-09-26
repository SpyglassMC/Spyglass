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
            child_ref: [
                '../ref/block_entity.json',
                '../ref/nameable.json'
            ],
            children: {
                Base: {
                    type: 'int',
                    description: 'The base color of the banner'
                },
                Patterns: {
                    type: 'compound',
                    children: {
                        Color: {
                            type: 'int',
                            description: 'The color of the pattern'
                        },
                        Pattern: {
                            type: 'string',
                            description: 'The name of the pattern',
                            suggestions: [
                                {
                                    value: 'bs',
                                    description: 'Bottom Stripe (Base)'
                                },
                                {
                                    value: 'bl',
                                    description: 'Bottom Left Corner (Base dexter canton)'
                                },
                                {
                                    value: 'gru',
                                    description: 'Gradient upside-down (Base gradient)'
                                },
                                {
                                    value: 'bts',
                                    description: 'Bottom Triangle Sawtooth (Base indented)'
                                },
                                {
                                    value: 'br',
                                    description: 'Bottom Right Corner (Base sinister canton)'
                                },
                                {
                                    value: 'drs',
                                    description: 'Down Right Stripe (Bend)'
                                },
                                {
                                    value: 'dls',
                                    description: 'Down Left Stripe (Bend sinister)'
                                },
                                {
                                    value: 'bo',
                                    description: 'Border (Bordure)'
                                },
                                {
                                    value: 'cbo',
                                    description: 'Curly Border (Bordure indented)'
                                },
                                {
                                    value: 'bt',
                                    description: 'Bottom Triangle (Chevron)'
                                },
                                {
                                    value: 'ts',
                                    description: 'Top Stripe (Chief)'
                                },
                                {
                                    value: 'tl',
                                    description: 'Top Left Corner (Chief dexter canton)'
                                },
                                {
                                    value: 'tts',
                                    description: 'Top Triangle Sawtooth (Chief indented)'
                                }
                            ]
                        }
                    }
                }
            }
        },
        'block/beacon.json': {
            type: 'compound',
            child_ref: [
                '../ref/block_entity.json',
                '../ref/lockable.json'
            ],
            children: {
                Levels: {
                    type: 'int',
                    description: 'The number of pyramid steps this beacon is on',
                    suggestions: [
                        '0',
                        '1',
                        '2',
                        '3',
                        '4'
                    ]
                },
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
            child_ref: [
                '../ref/block_entity.json',
                '../ref/nameable.json'
            ],
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
    describe('resolve() Tests', () => {
        it('Should resolve correctly', () => {
            const actual1 = walker.resolve('block', 'banner.json')
            const actual2 = walker.resolve('./block', './banner.json')
            const actual3 = walker.resolve('block/banner.json', '')
            const actual4 = walker.resolve('', 'block/banner.json')
            const actual5 = walker.resolve('roots/blocks.json', '../block/banner.json')
            const actual6 = walker.resolve('block/beacon.json', './banner.json')
            assert(actual1 === 'block/banner.json')
            assert(actual2 === 'block/banner.json')
            assert(actual3 === 'block/banner.json')
            assert(actual4 === 'block/banner.json')
            assert(actual5 === 'block/banner.json')
            assert(actual6 === 'block/banner.json')
        })
        it("Should throw error when the path does't exist", () => {
            try {
                walker.resolve('parent', 'child')
                fail()
            } catch ({ message }) {
                assert(message === 'Path not found: join(`parent`, `child`) => `parent/child`')
            }
        })
    })
    describe('read() Tests', () => {
        it('Should return a ValueList', () => {
            const actual = walker.read(undefined, 'block/group/command_block.json')
            assert(actual === schemas['block/group/command_block.json'])
        })
        it('Should return RootNode', () => {
            const actual = walker.read(undefined, 'roots/blocks.json')
            assert(actual === schemas['roots/blocks.json'])
        })
        it('Should handle regular anchors for RootNode', () => {
            const actual = walker.read(undefined, 'roots/blocks.json#minecraft:banner')
            assert(actual === schemas['block/banner.json'])
        })
        it('Should handle anchors beginning with $ for RootNode', () => {
            const actual = walker.read(undefined, 'roots/blocks.json#minecraft:repeating_command_block')
            assert(actual === schemas['block/command_block.json'])
        })
        it("Should throw error when the anchor doen't exist", () => {
            try {
                walker.read(undefined, 'roots/blocks.json#non-existent')
                fail()
            } catch ({ message }) {
                assert(message === 'Unknown anchor ‘non-existent’ in path ‘roots/blocks.json’')
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
