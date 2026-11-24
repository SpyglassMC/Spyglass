import { describe, it } from 'node:test'
import rfdc from 'rfdc'
import type { McmetaCommands } from '../../../lib/dependency/mcmeta/index.js'
import { migrateCommandTree } from '../../../lib/mcfunction/tree/migration.js'

/**
 * The command tree format used before 26.4-snapshot-8, where argument nodes carry their parser
 * type in the `parser` property and their parser options in the `properties` property.
 */
const OldFormatTree = {
	type: 'root',
	children: {
		execute: {
			type: 'literal',
			children: {
				run: { type: 'literal' },
			},
		},
		say: {
			type: 'literal',
			children: {
				message: {
					type: 'argument',
					executable: true,
					parser: 'brigadier:string',
					properties: { type: 'greedy' },
				},
			},
		},
		scoreboard: {
			type: 'literal',
			children: {
				targets: {
					type: 'argument',
					parser: 'minecraft:entity',
					properties: { type: 'players', amount: 'single' },
				},
				objective: {
					type: 'argument',
					executable: true,
					parser: 'brigadier:integer',
					properties: { min: 0, max: 2147483647 },
				},
			},
		},
	},
} as unknown as McmetaCommands

const clone = rfdc()

/**
 * The command tree format used since 26.4-snapshot-8, where argument nodes carry their parser
 * type in the `argument` property.
 */
const NewFormatTree = {
	type: 'root',
	children: {
		execute: {
			type: 'literal',
			children: {
				run: { type: 'literal' },
			},
		},
		say: {
			type: 'literal',
			children: {
				message: {
					type: 'argument',
					executable: true,
					argument: { type: 'minecraft:greedy_string' },
				},
			},
		},
		scoreboard: {
			type: 'literal',
			children: {
				targets: {
					type: 'argument',
					argument: { type: 'minecraft:entity', players_only: true, single_result: true },
				},
				objective: {
					type: 'argument',
					executable: true,
					argument: { type: 'minecraft:integer', min: 0, max: 2147483647 },
				},
			},
		},
	},
} as unknown as McmetaCommands

function getNode(tree: McmetaCommands, path: readonly string[]): any {
	return path.reduce<any>((node, key) => node?.children?.[key], tree)
}

describe('mcfunction tree migrations', () => {
	describe('migrateCommandTree()', () => {
		it('Should migrate the old command tree format before 26.4-snapshot-8', (t) => {
			const tree = clone(OldFormatTree)
			migrateCommandTree(tree, '26.3')
			t.assert.deepEqual(getNode(tree, ['say', 'message']).argument, {
				type: 'minecraft:greedy_string',
			})
			t.assert.deepEqual(getNode(tree, ['scoreboard', 'targets']).argument, {
				type: 'minecraft:entity',
				players_only: true,
				single_result: true,
			})
			t.assert.deepEqual(getNode(tree, ['scoreboard', 'objective']).argument, {
				type: 'minecraft:integer',
				min: 0,
				max: 2147483647,
			})
		})

		it('Should not migrate the old command tree format since 26.4-snapshot-8', (t) => {
			const tree = clone(OldFormatTree)
			migrateCommandTree(tree, '26.4')
			t.assert.equal(getNode(tree, ['say', 'message']).parser, 'brigadier:string')
			t.assert.equal('argument' in getNode(tree, ['say', 'message']), false)
		})

		it('Should not migrate the new command tree format', (t) => {
			const tree = clone(NewFormatTree)
			migrateCommandTree(tree, '26.4')
			t.assert.deepEqual(tree, NewFormatTree)
		})

		it('Should not add children to nodes without any', (t) => {
			for (const release of ['26.3', '26.4'] as const) {
				const tree = clone(release === '26.3' ? OldFormatTree : NewFormatTree)
				migrateCommandTree(tree, release)
				const run = getNode(tree, ['execute', 'run'])
				t.assert.equal('children' in run, false)
			}
		})

		it('Should mark the nodes without permissions as always pass', (t) => {
			const tree = clone(OldFormatTree)
			migrateCommandTree(tree, '26.3')
			t.assert.deepEqual(getNode(tree, ['scoreboard', 'objective']).permissions, {
				type: 'minecraft:always_pass',
			})
		})

		it('Should keep the permissions of the nodes that have them', (t) => {
			const tree = clone({
				...OldFormatTree,
				children: {
					...OldFormatTree.children,
					op: {
						type: 'literal',
						permissions: {
							type: 'minecraft:require',
							permission: { type: 'minecraft:command_level', level: 'admins' },
						},
					},
				},
			} as McmetaCommands)
			migrateCommandTree(tree, '26.3')
			t.assert.deepEqual(getNode(tree, ['op']).permissions, {
				type: 'minecraft:require',
				permission: { type: 'minecraft:command_level', level: 'admins' },
			})
		})

		it('Should not mark the nodes without permissions before 25w41a', (t) => {
			const tree = clone(OldFormatTree)
			migrateCommandTree(tree, '1.21.10')
			t.assert.equal('permissions' in getNode(tree, ['scoreboard', 'objective']), false)
		})
	})
})
