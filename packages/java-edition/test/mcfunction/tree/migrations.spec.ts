import { describe, it } from 'node:test'
import type { McmetaCommands, McmetaVersions } from '../../../lib/dependency/mcmeta/index.js'
import { applyMigrations } from '../../../lib/mcfunction/tree/migrations.js'

const Versions = [
	{ id: '25w41a', data_pack_version: 89, data_pack_version_minor: 0 },
	{ id: '26.4-snapshot-7', data_pack_version: 126, data_pack_version_minor: 0 },
	{ id: '26.4-snapshot-8', data_pack_version: 127, data_pack_version_minor: 0 },
	{ id: '26.4-snapshot-9', data_pack_version: 128, data_pack_version_minor: 0 },
] as unknown as McmetaVersions

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
	describe('applyMigrations()', () => {
		it('Should migrate the old command tree format before 26.4-snapshot-8', (t) => {
			const actual = applyMigrations(OldFormatTree, { major: 126, minor: 0 }, Versions)
			t.assert.deepEqual(getNode(actual, ['say', 'message']).argument, {
				type: 'minecraft:greedy_string',
			})
			t.assert.deepEqual(getNode(actual, ['scoreboard', 'targets']).argument, {
				type: 'minecraft:entity',
				players_only: true,
				single_result: true,
			})
			t.assert.deepEqual(getNode(actual, ['scoreboard', 'objective']).argument, {
				type: 'minecraft:integer',
				min: 0,
				max: 2147483647,
			})
		})

		it('Should not migrate the old command tree format since 26.4-snapshot-8', (t) => {
			const actual = applyMigrations(OldFormatTree, { major: 127, minor: 0 }, Versions)
			t.assert.equal(getNode(actual, ['say', 'message']).parser, 'brigadier:string')
			t.assert.equal('argument' in getNode(actual, ['say', 'message']), false)
		})

		it('Should not migrate the new command tree format', (t) => {
			const actual = applyMigrations(NewFormatTree, { major: 128, minor: 0 }, Versions)
			t.assert.deepEqual(actual, NewFormatTree)
		})

		it('Should not add children to nodes without any', (t) => {
			for (const packFormat of [{ major: 126, minor: 0 }, { major: 128, minor: 0 }]) {
				const tree = packFormat.major < 127 ? OldFormatTree : NewFormatTree
				const actual = applyMigrations(tree, packFormat, Versions)
				const run = getNode(actual, ['execute', 'run'])
				t.assert.equal('children' in run, false)
			}
		})

		it('Should mark the nodes without permissions as always pass', (t) => {
			const actual = applyMigrations(OldFormatTree, { major: 126, minor: 0 }, Versions)
			t.assert.deepEqual(getNode(actual, ['scoreboard', 'objective']).permissions, {
				type: 'minecraft:always_pass',
			})
		})

		it('Should keep the permissions of the nodes that have them', (t) => {
			const tree = {
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
			} as unknown as McmetaCommands
			const actual = applyMigrations(tree, { major: 126, minor: 0 }, Versions)
			t.assert.deepEqual(getNode(actual, ['op']).permissions, {
				type: 'minecraft:require',
				permission: { type: 'minecraft:command_level', level: 'admins' },
			})
		})

		it('Should not mark the nodes without permissions before 25w41a', (t) => {
			const actual = applyMigrations(OldFormatTree, { major: 88, minor: 0 }, Versions)
			t.assert.equal('permissions' in getNode(actual, ['scoreboard', 'objective']), false)
		})

		it('Should skip migrations with unknown versions', (t) => {
			const actual = applyMigrations(OldFormatTree, { major: 126, minor: 0 }, [
				...Versions.slice(3),
			] as unknown as McmetaVersions)
			t.assert.equal(getNode(actual, ['say', 'message']).parser, 'brigadier:string')
		})
	})
})
