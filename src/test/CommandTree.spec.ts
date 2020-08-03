import assert = require('power-assert')
import { describe, it } from 'mocha'
import { fillSingleTemplate, getArgOrDefault, getChildren } from '../CommandTree'
import { NodeRange } from '../nodes/ArgumentNode'
import { BlockNode } from '../nodes/BlockNode'
import { BlockStateNode } from '../nodes/BlockStateNode'
import { EntityNode } from '../nodes/EntityNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { NbtPathNode } from '../nodes/NbtPathNode'
import { StringNode } from '../nodes/StringNode'
import { VectorElementNode, VectorElementType, VectorNode } from '../nodes/VectorNode'
import { LineParser } from '../parsers/LineParser'
import { CommandTree, CommandTreeNode } from '../types/CommandTree'
import { } from '../types/nbtdoc'
import { constructContext, ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { StringReader } from '../utils/StringReader'
import { TestArgumentParser } from './parsers/LineParser.spec'
import { $, assertCompletions } from './utils.spec'
import { DeclarableCacheTypes } from '../types'

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
    let ctx: ParsingContext
    before(async () => {
        const cache = {
            advancement: {
                'minecraft:test': { def: [], ref: [] }
            }
        }
        ctx = constructContext({ cache })
    })
    describe('Just fucking parse', () => {
        it('advancement gr', async () => {
            const ctx = constructContext({ cursor: 13 })
            const parser = new LineParser(false)
            const reader = new StringReader('advancement gr')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'gr', parser: 'literal' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement'],
                options: [['grant|revoke', ['<targets: entity>']]]
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, [
                new ParsingError({ start: 12, end: 14 }, 'Expected “grant” or “revoke” but got “gr”'),
                new ParsingError({ start: 14, end: 16 }, 'Expected more arguments but got nothing')
            ])
            assertCompletions(reader, data.completions, [
                { label: 'grant', t: 'advancement grant' },
                { label: 'revoke', t: 'advancement revoke' }
            ])
        })
        it('advancement grant|revoke <targets> everything', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('advancement grant @s everything')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'grant', parser: 'literal' },
                { data: $(new EntityNode(undefined, 's'), [18, 20]), parser: 'entity' },
                { data: 'everything', parser: 'literal' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement', 'grant|revoke', '<targets: entity>', 'everything'],
                options: []
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, undefined)
            assert(data.completions === undefined)
        })
        it('advancement grant|revoke <targets> only <advancement>', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('advancement grant @s only minecraft:test')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'grant', parser: 'literal' },
                { data: $(new EntityNode(undefined, 's'), [18, 20]), parser: 'entity' },
                { data: 'only', parser: 'literal' },
                { data: $(new IdentityNode('minecraft', ['test']), [26, 40]), parser: 'identity' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement', 'grant|revoke', '<targets: entity>', 'only', '<advancement: namespaced ID>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, {
                advancement: {
                    'minecraft:test': { ref: [{ start: 26, end: 40 }] }
                }
            })
            assert.deepStrictEqual(data.errors, undefined)
            assert(data.completions === undefined)
        })
        it('advancement grant|revoke <targets> only <advancement> <criterion>', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('advancement grant @s only minecraft:test aaa')
            const { data } = parser.parse(reader, ctx)
            const expectedId = new IdentityNode('minecraft', ['test'])
            expectedId[NodeRange] = { start: 26, end: 40 }
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'grant', parser: 'literal' },
                { data: $(new EntityNode(undefined, 's'), [18, 20]), parser: 'entity' },
                { data: 'only', parser: 'literal' },
                { data: expectedId, parser: 'identity' },
                { data: $(new StringNode('aaa', 'aaa', { start: 41 }), [41, 44]), parser: 'string' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement', 'grant|revoke', '<targets: entity>', 'only', '<advancement: namespaced ID>', '<criterion: string>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, {
                advancement: {
                    'minecraft:test': { ref: [{ start: 26, end: 40 }] }
                }
            })
            assert.deepStrictEqual(data.errors, undefined)
            assert(data.completions === undefined)
        })
        it('advancement grant|revoke <targets> from|through|until <advancement>', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('advancement revoke @s through minecraft:test')
            const { data } = parser.parse(reader, ctx)
            const expectedId = new IdentityNode('minecraft', ['test'])
            expectedId[NodeRange] = { start: 30, end: 44 }
            assert.deepStrictEqual(data.args, [
                { data: 'advancement', parser: 'literal' },
                { data: 'revoke', parser: 'literal' },
                { data: $(new EntityNode(undefined, 's'), [19, 21]), parser: 'entity' },
                { data: 'through', parser: 'literal' },
                { data: expectedId, parser: 'identity' }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['advancement', 'grant|revoke', '<targets: entity>', 'from|through|until', '<advancement: namespaced ID>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, {
                advancement: {
                    'minecraft:test': { ref: [{ start: 30, end: 44 }] }
                }
            })
            assert.deepStrictEqual(data.errors, undefined)
            assert(data.completions === undefined)
        })
        it('data get block <targetPos> <path>', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('data get block ~ ~ ~ CustomName')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args[0], { data: 'data', parser: 'literal' })
            assert.deepStrictEqual(data.args[1], { data: 'get', parser: 'literal' })
            assert.deepStrictEqual(data.args[2], { data: 'block', parser: 'literal' })
            assert.deepStrictEqual(data.args[3], {
                data: $(new VectorNode(), [15, 20], {
                    length: 3,
                    0: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [15, 16]),
                    1: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [17, 18]),
                    2: $(new VectorElementNode(VectorElementType.Relative, 0, ''), [19, 20])
                }),
                parser: 'vector.3D'
            })
            assert(data.args[4].parser === 'nbtPath')
            assert(data.args[4].data instanceof NbtPathNode)
            assert.deepStrictEqual(data.args[4].data[NodeRange], { start: 21, end: 31 })
            assert.deepStrictEqual(data.hint, {
                fix: ['data', 'get', 'block', '<pos: 3D vector>', '<path: NBT path>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, undefined)
            assert(data.completions === undefined)
        })
        it('setblock ~ ~ ~ minecraft:grass_block[]', async () => {
            const ctx = constructContext({ cursor: 37 })
            const parser = new LineParser(false)
            const reader = new StringReader('setblock ~ ~ ~ minecraft:grass_block[]')
            const { data } = parser.parse(reader, ctx)
            assert.deepStrictEqual(data.args, [
                { data: 'setblock', parser: 'literal' },
                {
                    data: $(new VectorNode(), [9, 14], v => {
                        v.push(
                            $(new VectorElementNode(VectorElementType.Relative, 0, ''), [9, 10]),
                            $(new VectorElementNode(VectorElementType.Relative, 0, ''), [11, 12]),
                            $(new VectorElementNode(VectorElementType.Relative, 0, ''), [13, 14])
                        )
                        return v
                    }),
                    parser: 'vector.3D'
                },
                {
                    data: $(new BlockNode(
                        $(new IdentityNode('minecraft', ['grass_block']), [15, 36]),
                        $(new BlockStateNode(), [36, 38])
                    ), [15, 38]),
                    parser: 'block'
                }
            ])
            assert.deepStrictEqual(data.hint, {
                fix: ['setblock', '<pos: 3D vector>'],
                options: [['<block: block>', ['[destroy|keep|replace]']]]
            })
            assert.deepStrictEqual(data.cache, undefined)
            assert.deepStrictEqual(data.errors, undefined)
            assertCompletions(reader, data.completions, [
                { label: 'snowy', t: 'setblock ~ ~ ~ minecraft:grass_block[snowy]' }
            ])
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
                fix: ['#declare|#define|#register', DeclarableCacheTypes.join('|'), '<id: string>'],
                options: []
            })
            assert.deepStrictEqual(data.cache, {
                entity: {
                    SPGoding: {
                        dcl: [{ start: 15, end: 23 }]
                    }
                }
            })
            assert.deepStrictEqual(data.errors, undefined)
            assert(data.completions === undefined)
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
            assert(data.completions === undefined)
        })
    })
})
