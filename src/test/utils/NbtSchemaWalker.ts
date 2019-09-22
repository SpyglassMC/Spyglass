import * as assert from 'power-assert'
import NbtSchemaWalker from '../../utils/NbtSchemaWalker'
import ParsingError from '../../types/ParsingError'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { NBTNode, ValueList } from 'mc-nbt-paths'

describe.only('NbtSchemaWalker Tests', () => {
    const schemas: { [key: string]: NBTNode | ValueList } = {
        "block/banner.json": {
            "type": "compound",
            "child_ref": [
                "../ref/block_entity.json",
                "../ref/nameable.json"
            ],
            "children": {
                "Base": {
                    "type": "int",
                    "description": "The base color of the banner"
                },
                "Patterns": {
                    "type": "compound",
                    "children": {
                        "Color": {
                            "type": "int",
                            "description": "The color of the pattern"
                        },
                        "Pattern": {
                            "type": "string",
                            "description": "The name of the pattern",
                            "suggestions": [
                                {
                                    "value": "bs",
                                    "description": "Bottom Stripe (Base)"
                                },
                                {
                                    "value": "bl",
                                    "description": "Bottom Left Corner (Base dexter canton)"
                                },
                                {
                                    "value": "gru",
                                    "description": "Gradient upside-down (Base gradient)"
                                },
                                {
                                    "value": "bts",
                                    "description": "Bottom Triangle Sawtooth (Base indented)"
                                },
                                {
                                    "value": "br",
                                    "description": "Bottom Right Corner (Base sinister canton)"
                                },
                                {
                                    "value": "drs",
                                    "description": "Down Right Stripe (Bend)"
                                },
                                {
                                    "value": "dls",
                                    "description": "Down Left Stripe (Bend sinister)"
                                },
                                {
                                    "value": "bo",
                                    "description": "Border (Bordure)"
                                },
                                {
                                    "value": "cbo",
                                    "description": "Curly Border (Bordure indented)"
                                },
                                {
                                    "value": "bt",
                                    "description": "Bottom Triangle (Chevron)"
                                },
                                {
                                    "value": "ts",
                                    "description": "Top Stripe (Chief)"
                                },
                                {
                                    "value": "tl",
                                    "description": "Top Left Corner (Chief dexter canton)"
                                },
                                {
                                    "value": "tts",
                                    "description": "Top Triangle Sawtooth (Chief indented)"
                                }
                            ]
                        }
                    }
                }
            }
        },
        "block/beacon.json": {
            "type": "compound",
            "child_ref": [
                "../ref/block_entity.json",
                "../ref/lockable.json"
            ],
            "children": {
                "Levels": {
                    "type": "int",
                    "description": "The number of pyramid steps this beacon is on",
                    "suggestions": [
                        "0",
                        "1",
                        "2",
                        "3",
                        "4"
                    ]
                },
                "Primary": {
                    "type": "int",
                    "suggestions": [
                        {
                            "values": "../misc_group/effect_id.json"
                        }
                    ]
                },
                "Secondary": {
                    "type": "int",
                    "suggestions": [
                        {
                            "values": "../misc_group/effect_id.json"
                        }
                    ]
                }
            }
        },
        "block/group/command_block.json": [
            "minecraft:command_block",
            "minecraft:chain_command_block",
            "minecraft:repeating_command_block"
        ],
        "roots/blocks.json": {
            "type": "root",
            "children": {
                "any": {
                    "ref": "../block/any.json"
                },
                "none": {
                    "type": "no-nbt"
                },
                "$../block/group/command_block.json": {
                    "ref": "../block/command_block.json"
                },
                "minecraft:banner": {
                    "ref": "../block/banner.json"
                },
                "minecraft:beacon": {
                    "ref": "../block/beacon.json"
                }
            }
        }
    }
    let walker: NbtSchemaWalker
    beforeEach(() => {
        walker = new NbtSchemaWalker(schemas)
    })
    describe('read() Tests', () => {
        it('Should return a ValueList', () => {
            const value = walker.read(undefined, 'block/group/command_block.json')
            assert.deepStrictEqual(value , [
                "minecraft:command_block",
                "minecraft:chain_command_block",
                "minecraft:repeating_command_block"
            ])
        })
    })
})
