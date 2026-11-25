import { describe, it } from 'node:test'
import type { TreeNode } from '../../lib/tree/index.js'
import { getPermissionLevel, isPermissionLevel } from '../../lib/tree/util.js'

const Node = (permissions?: TreeNode['permissions']): TreeNode => ({
	type: 'literal',
	permissions,
})

describe('mcfunction tree util', () => {
	describe('getPermissionLevel()', () => {
		it('Should return the permission level of the node', (t) => {
			t.assert.equal(getPermissionLevel(Node()), undefined)
			t.assert.equal(
				getPermissionLevel(Node({ type: 'minecraft:always_pass' })),
				'normal',
			)
			t.assert.equal(
				getPermissionLevel(
					Node({
						type: 'minecraft:require',
						permission: { type: 'minecraft:command_level', level: 'admins' },
					}),
				),
				'admins',
			)
		})
	})

	describe('isPermissionLevel()', () => {
		it('Should tell whether the node requires the given permission level', (t) => {
			const node = Node({
				type: 'minecraft:require',
				permission: { type: 'minecraft:command_level', level: 'owners' },
			})
			t.assert.equal(isPermissionLevel(node, 'owners'), true)
			t.assert.equal(isPermissionLevel(node, 'admins'), false)
			t.assert.equal(isPermissionLevel(Node(), 'normal'), false)
		})
	})
})
