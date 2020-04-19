import assert = require('power-assert')
import { describe, it } from 'mocha'
import { getChildren, fillSingleTemplate, getArgOrDefault, getNbtdocRegistryId } from '../CommandTree'
import { TestArgumentParser } from './parsers/LineParser.spec'
import { } from '../types/nbtdoc'
import ArgumentParserManager from '../parsers/ArgumentParserManager'
import BlockNode from '../types/nodes/BlockNode'
import EntityNode from '../types/nodes/EntityNode'
import IdentityNode from '../types/nodes/IdentityNode'
import LineParser from '../parsers/LineParser'
import NbtPathNode from '../types/nodes/NbtPathNode'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import VectorNode, { VectorElementNode, VectorElementType } from '../types/nodes/VectorNode'
import CommandTree, { CommandTreeNode } from '../types/CommandTree'
import ParsingContext, { constructContext } from '../types/ParsingContext'
import SelectorArgumentsNode from '../types/nodes/map/SelectorArgumentMapNode'
import { NodeRange } from '../types/nodes/ArgumentNode'
import NbtCompoundKeyNode from '../types/nodes/map/NbtCompoundKeyNode'
import { $ } from './utils'

describe('CommandTree Tests', () => {
    describe('getArgOrDefault() Tests', () => {
        it('Should return the arg data', () => {
            const actual = getArgOrDefault<string>([{ data: 'foo', parser: 'literal' }], 1, 'bar')
            assert(actual === 'foo')
        })
        it('Should return the fallback value', () => {
            const actual = getArgOrDefault<string>([{ data: 'foo', parser: 'literal' }], 2, 'bar')
            assert(actual === 'bar')
        })
    })
    describe('getChildren() Tests', () => {
        const tree: CommandTree = {
            line: { command: { redirect: 'commands' } },
            commands: { execute: { executable: true } }
        }
        it('Should return node.children if it exists', () => {
            const node: CommandTreeNode<any> = { children: { foo: {} } }
            const actual = getChildren(tree, node)
            assert.deepStrictEqual(actual, { foo: {} })
        })
        it('Should handle redirect', () => {
            const node: CommandTreeNode<any> = { redirect: 'line.command' }
            const actual = getChildren(tree, node)
            assert.deepStrictEqual(actual, { execute: { executable: true } })
        })
        it('Should handle single template', () => {
            const node: CommandTreeNode<any> = { template: 'line.command' }
            const actual = getChildren(tree, node)
            assert.deepStrictEqual(actual, { execute: { executable: true } })
        })
        it('Should handle children template', () => {
            const node: CommandTreeNode<any> = { template: 'line', description: 'test' }
            const actual = getChildren(tree, node)
            assert.deepStrictEqual(actual, { command: { redirect: 'commands', description: 'test' } })
        })
        it('Should return undefined when the template does not exist', () => {
            const node: CommandTreeNode<any> = { template: 'line.wtf' }
            const actual = getChildren(tree, node)
            assert(actual === undefined)
        })
        it('Should return undefined when none of `children`, `redirect` and `template` was found.', () => {
            const node: CommandTreeNode<any> = {}
            const actual = getChildren(tree, node)
            assert(actual === undefined)
        })
    })
    describe('fillSingleTemplate() Tests', () => {
        it('Should fill children', () => {
            const template: CommandTreeNode<any> = {
                template: '',
                children: {
                    foo: {
                        executable: true
                    }
                }
            }
            const single: CommandTreeNode<any> = {
                description: 'test'
            }
            const actual = fillSingleTemplate(template, single)
            assert.deepStrictEqual(actual, {
                description: 'test',
                children: {
                    foo: {
                        executable: true
                    }
                }
            })
        })
        it('Should fill description', () => {
            const template: CommandTreeNode<any> = {
                template: '',
                description: 'haha'
            }
            const single: CommandTreeNode<any> = {
                description: 'test'
            }
            const actual = fillSingleTemplate(template, single)
            assert.deepStrictEqual(actual, {
                description: 'haha'
            })
        })
        it('Should fill executable', () => {
            const template: CommandTreeNode<any> = {
                template: '',
                executable: true
            }
            const single: CommandTreeNode<any> = {
                description: 'test'
            }
            const actual = fillSingleTemplate(template, single)
            assert.deepStrictEqual(actual, {
                executable: true,
                description: 'test'
            })
        })
        it('Should fill parser', () => {
            const parser = new TestArgumentParser()
            const template: CommandTreeNode<any> = {
                template: '',
                parser: parser
            }
            const single: CommandTreeNode<any> = {
                description: 'test'
            }
            const actual = fillSingleTemplate(template, single)
            assert.deepStrictEqual(actual, {
                parser, description: 'test'
            })
        })
        it('Should fill permission', () => {
            const template: CommandTreeNode<any> = {
                template: '',
                permission: 4
            }
            const single: CommandTreeNode<any> = {
                description: 'test'
            }
            const actual = fillSingleTemplate(template, single)
            assert.deepStrictEqual(actual, {
                description: 'test',
                permission: 4
            })
        })
        it('Should fill recursively', () => {
            const template: CommandTreeNode<any> = {
                template: '',
                children: {
                    bar: {
                        executable: true
                    }
                }
            }
            const single: CommandTreeNode<any> = {
                description: 'test',
                children: {
                    foo: {
                        description: 'foo'
                    }
                }
            }
            const actual = fillSingleTemplate(template, single)
            assert.deepStrictEqual(actual, {
                description: 'test',
                children: {
                    foo: {
                        description: 'foo',
                        children: {
                            bar: {
                                executable: true
                            }
                        }
                    }
                }
            })
        })
    })
    describe('getSchemaAnchor() Tests', () => {
        it('Should return the respective id', () => {
            const id = new IdentityNode('minecraft', ['spgoding'])
            const argument = new SelectorArgumentsNode()
            argument.type = [id]
            const entity = new EntityNode(undefined, 'e', argument)
            const actual = getNbtdocRegistryId(entity)
            assert(actual === 'minecraft:spgoding')
        })
    })
    const parsers = new ArgumentParserManager()
    let ctx: ParsingContext
    before(async () => {
        const cache = {
            advancements: {
                'minecraft:test': { def: [], ref: [] }
            }
        }
        ctx = await constructContext({ parsers, cache })
    })
    describe('Just fucking parse', () => {
        const parsers = new ArgumentParserManager()
        it('advancement g', async () => {
            const ctx = await constructContext({ parsers, cursor: 13 })
            const parser = new LineParser(false)
            const reader = new StringReader('advancement g')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'g', parser: 'literal' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement'],
                options: [['(grant|revoke)', ['<targets: entity>']]]
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, [
                new ParsingError({ start: 12, end: 13 }, 'Expected ‘grant’ or ‘revoke’ but got ‘g’'),
                new ParsingError({ start: 13, end: 15 }, 'Expected more arguments but got nothing')
            ])
            assert.deepStrictEqual(data.completions, [{ label: 'grant' }])
        })
        it('advancement (grant|revoke) <targets> everything', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('advancement grant @s everything')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'grant', parser: 'literal' },
                { data: new EntityNode(undefined, 's'), parser: 'entity' },
                { data: 'everything', parser: 'literal' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement', '(grant|revoke)', '<targets: entity>', 'everything'],
                options: []
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, undefined)
            assert.deepStrictEqual(data.completions, undefined)
        })
        it('advancement (grant|revoke) <targets> only <advancement>', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('advancement grant @s only minecraft:test')
            const { data } = parser.parse(reader, ctx)
            const expectedId = new IdentityNode('minecraft', ['test'])
            expectedId[NodeRange] = { start: 26, end: 40 }
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'grant', parser: 'literal' },
                { data: new EntityNode(undefined, 's'), parser: 'entity' },
                { data: 'only', parser: 'literal' },
                { data: expectedId[NodeRange], parser: 'namespacedID' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement', '(grant|revoke)', '<targets: entity>', 'only', '<advancement: namespacedID>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, {
                advancements: {
                    'minecraft:test': { def: [], ref: [{ start: 26, end: 40 }] }
                }
            })
            assert.deepStrictEqual(data.errors, undefined)
            assert.deepStrictEqual(data.completions, undefined)
        })
        it('advancement (grant|revoke) <targets> only <advancement> <criterion>', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('advancement grant @s only minecraft:test aaa')
            const { data } = parser.parse(reader, ctx)
            const expectedId = new IdentityNode('minecraft', ['test'])
            expectedId[NodeRange] = { start: 26, end: 40 }
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'grant', parser: 'literal' },
                { data: new EntityNode(undefined, 's'), parser: 'entity' },
                { data: 'only', parser: 'literal' },
                { data: expectedId, parser: 'namespacedID' },
                { data: 'aaa', parser: 'string' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement', '(grant|revoke)', '<targets: entity>', 'only', '<advancement: namespacedID>', '<criterion: string>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, {
                advancements: {
                    'minecraft:test': { def: [], ref: [{ start: 26, end: 40 }] }
                }
            })
            assert.deepStrictEqual(data.errors, undefined)
            assert.deepStrictEqual(data.completions, undefined)
        })
        it('advancement (grant|revoke) <targets> (from|through|until) <advancement>', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('advancement revoke @s through minecraft:test')
            const { data } = parser.parse(reader, ctx)
            const expectedId = new IdentityNode('minecraft', ['test'])
            expectedId[NodeRange] = { start: 30, end: 44 }
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'revoke', parser: 'literal' },
                { data: new EntityNode(undefined, 's'), parser: 'entity' },
                { data: 'through', parser: 'literal' },
                { data: expectedId, parser: 'namespacedID' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement', '(grant|revoke)', '<targets: entity>', '(from|through|until)', '<advancement: namespacedID>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, {
                advancements: {
                    'minecraft:test': { def: [], ref: [{ start: 30, end: 44 }] }
                }
            })
            assert.deepStrictEqual(data.errors, undefined)
            assert.deepStrictEqual(data.completions, undefined)
        })
        it('data get block <targetPos> <path>', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('data get block ~ ~ ~ CustomName')
            const { data } = parser.parse(reader, ctx)
            const expectedKey = new NbtCompoundKeyNode(null, 'CustomName', 'CustomName', [21, 22, 23, 24, 25, 26, 27, 28, 29, 30])
            assert.deepStrictEqual(data.args, [
                { data: 'data', parser: 'literal' },
                { data: 'get', parser: 'literal' },
                { data: 'block', parser: 'literal' },
                {
                    data: $(new VectorNode(), [15, 20], {
                        length: 3,
                        0: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [15, 16]),
                        1: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [17, 18]),
                        2: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [19, 20])
                    }),
                    parser: 'vector.3D'
                },
                { data: new NbtPathNode([expectedKey]), parser: 'nbtPath' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['data', 'get', 'block', '<pos: 3D vector>', '<path: NBT path>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, undefined)
            assert.deepStrictEqual(data.completions, undefined)
        })
        it('setblock ~ ~ ~ minecraft:grass_block[]', async () => {
            const ctx = await constructContext({ parsers, cursor: 37 })
            const parser = new LineParser(false)
            const reader = new StringReader('setblock ~ ~ ~ minecraft:grass_block[]')
            const { data } = parser.parse(reader, ctx)
            const expectedId = new IdentityNode('undefined', ['grass_block'])
            expectedId[NodeRange] = { start: 15, end: 36 }
            assert.deepStrictEqual(data.args, [
                { data: 'setblock', parser: 'literal' },
                {
                    data: $(new VectorNode(), [15, 20], {
                        length: 3,
                        0: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [15, 16]),
                        1: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [17, 18]),
                        2: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [19, 20])
                    }),
                    parser: 'vector.3D'
                },
                { data: new BlockNode(expectedId), parser: 'block' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['setblock', '<pos: 3D vector>'],
                options: [['<block: block>', ['[destroy|keep|replace]']]]
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, undefined)
            assert.deepStrictEqual(data.completions, [{ label: 'snowy' }])
        })
        it('#define entity SPGoding', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('#define entity SPGoding')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args, [
                { data: '#define', parser: 'literal' },
                { data: 'entity', parser: 'literal' },
                { data: 'SPGoding', parser: 'string' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['#define', '(bossbar|entity|objective|storage|tag|team)', '<id: string>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, {
                entities: {
                    SPGoding: {
                        def: [{ start: 15, end: 23 }],
                        ref: []
                    }
                }
            })
            assert.deepStrictEqual(data.errors, undefined)
            assert.deepStrictEqual(data.completions, undefined)
        })
        it('# This is a comment.', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('# This is a comment.')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args, [
                { data: '# This is a comment.', parser: 'string' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: [],
                options: []
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, undefined)
            assert.deepStrictEqual(data.completions, undefined)
        })
    })
})
