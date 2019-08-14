import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { CommandTree, CommandTreeNode, getChildren } from '../CommandTree'
import { fail } from 'assert'

describe('CommandTree Tests', () => {
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
        it('Should throw error when gets neither `redirect` nor `parser`', () => {
            const node: CommandTreeNode<any> = {}
            try {
                getChildren(tree, node)
                fail()
            } catch (e) {
                assert(e.message === 'Unexpected error. Got neither `redirect` nor `parser` in node.')
            }
        })
    })
})
