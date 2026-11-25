import type * as core from '@spyglassmc/core'
import { AlwaysPass } from '@spyglassmc/mcfunction'
import type {
	ArgumentTreeData,
	CommandTreeNode,
	LegacyParserOptions,
	LiteralTreeNode,
	McmetaCommands,
	McmetaVersions,
	MigratableCommandTreeNode,
	MigratableLiteralTreeNode,
	MigratableMcmetaCommands,
	MigratableRootTreeNode,
	RootTreeNode,
} from '../../dependency/index.js'
import { getDataPackFormat, PackFormat } from '../../dependency/index.js'

export type CommandTreeMigration =
	| {
		since: string
		until?: string
		handle: (tree: McmetaCommands) => McmetaCommands
	}
	| {
		since?: string
		until: string
		handle: (tree: McmetaCommands) => McmetaCommands
	}

const Migrations: CommandTreeMigration[] = []

function migrate(migration: CommandTreeMigration): void {
	Migrations.push(migration)
}

// 26.4-snapshot-8/9 changed the format of the command tree: argument nodes from this point carry their
// parser type and options in the `argument` property, instead of the `parser` and `properties` properties.
// Some parser types were renamed, and some of their options were replaced.
migrate({
	until: '26.4-snapshot-8',
	handle: (tree: MigratableMcmetaCommands): McmetaCommands => {
		const SplitStringParserTypes: { [oldType: string]: string | undefined } = {
			word: 'minecraft:word',
			phrase: 'minecraft:quoted_string',
			greedy: 'minecraft:greedy_string',
		}
		const RenamedParserTypes: { [oldType: string]: string | undefined } = {
			'brigadier:bool': 'minecraft:bool',
			'brigadier:double': 'minecraft:double',
			'brigadier:float': 'minecraft:float',
			'brigadier:integer': 'minecraft:integer',
			'minecraft:resource_key': 'minecraft:resource',
			'minecraft:resource_or_tag_key': 'minecraft:resource_or_tag',
		}
		function convertArgument(
			parser: string,
			options: LegacyParserOptions,
		): { type: string; options: LegacyParserOptions } {
			switch (parser) {
				case 'brigadier:string': {
					const { type, ...rest } = options
					return {
						type: SplitStringParserTypes[type ?? 'greedy'] ?? 'minecraft:greedy_string',
						options: rest,
					}
				}
				case 'minecraft:entity': {
					const { type, amount, ...rest } = options
					return {
						type: parser,
						options: {
							...rest,
							players_only: type === 'players',
							single_result: amount === 'single',
						},
					}
				}
				case 'minecraft:score_holder': {
					const { amount, ...rest } = options
					return {
						type: parser,
						options: { ...rest, multiple: amount === 'multiple' },
					}
				}
				default:
					return {
						type: RenamedParserTypes[parser] ?? parser,
						options,
					}
			}
		}
		function migrateNode(node: MigratableCommandTreeNode): CommandTreeNode {
			switch (node.type) {
				case 'argument': {
					const { parser, properties, argument: oldArgument, children, ...rest } = node
					let argument: ArgumentTreeData
					if (parser === undefined) {
						argument = oldArgument ?? { type: 'minecraft:unknown' }
					} else {
						const { type, options } = convertArgument(parser, properties ?? {})
						argument = { type, ...options, ...oldArgument }
					}
					return assignDefined(rest, {
						argument,
						children: migrateChildren(children, migrateNode),
					})
				}
				case 'literal':
					return migrateLiteralNode(node, migrateNode)
				case 'root':
					return migrateRootNode(node, migrateNode)
			}
		}

		return migrateRootNode(tree, migrateNode)
	},
})

// 26.4-snapshot-8/9 started to mark every command tree node with its permissions.
migrate({
	since: '25w41a',
	until: '26.4-snapshot-8',
	handle: (tree: McmetaCommands): McmetaCommands => {
		function migrateNode(node: MigratableCommandTreeNode): CommandTreeNode {
			switch (node.type) {
				case 'literal':
				case 'argument': {
					const { permissions, children, ...rest } = node
					return assignDefined(rest, {
						permissions: permissions ?? AlwaysPass,
						children: migrateChildren(children, migrateNode),
					}) as CommandTreeNode
				}
				case 'root':
					return migrateRootNode(tree, migrateNode)
			}
		}

		return migrateNode(tree) as RootTreeNode
	},
})

/**
 * Applies all migrations that apply to the given data pack format, in the order they are declared.
 *
 * @param tree The command tree to migrate.
 * @param packFormat The data pack format of the version in use.
 * @param versions All known MC versions, used to bind `since` and `until` to pack formats.
 */
export function applyMigrations(
	tree: McmetaCommands,
	packFormat: PackFormat,
	versions: McmetaVersions,
	logger?: core.Logger,
): McmetaCommands {
	let result = tree
	for (const migration of Migrations) {
		if (!appliesTo(migration, packFormat, versions, logger)) {
			continue
		}
		result = migration.handle(result)
	}
	return result
}

/**
 * @returns `true` if the migration applies to the given data pack format.
 */
function appliesTo(
	migration: CommandTreeMigration,
	packFormat: PackFormat,
	versions: McmetaVersions,
	logger?: core.Logger,
): boolean {
	if (migration.since !== undefined) {
		const since = getDataPackFormat(migration.since, versions)
		if (since === undefined) {
			logger?.warn(
				`[je][mcfunction][migrations] Unknown version '${migration.since}', skipping migration`,
			)
			return false
		}
		if (PackFormat.cmp(packFormat, since) < 0) {
			return false
		}
	}
	if (migration.until !== undefined) {
		const until = getDataPackFormat(migration.until, versions)
		if (until === undefined) {
			logger?.warn(
				`[je][mcfunction][migrations] Unknown version '${migration.until}', skipping migration`,
			)
			return false
		}
		if (PackFormat.cmp(packFormat, until) >= 0) {
			return false
		}
	}
	return true
}

/**
 * Merges the properties into the base object, skipping the ones whose value is `undefined`.
 */
function assignDefined<T extends object, U extends object>(
	base: T,
	properties: Partial<U>,
): T & U {
	const result = { ...base } as T & U
	for (const [key, value] of Object.entries(properties)) {
		if (value !== undefined) {
			;(result as Record<string, unknown>)[key] = value
		}
	}
	return result
}

function migrateChildren<T, R>(
	children: { [name: string]: T } | undefined,
	migrateNode: (node: T) => R,
): { [name: string]: R } | undefined {
	if (children === undefined) {
		return undefined
	}
	const migrated: { [name: string]: R } = Object.create(null)
	for (const [key, value] of Object.entries(children)) {
		migrated[key] = migrateNode(value)
	}
	return migrated
}

function migrateRootNode(
	node: MigratableRootTreeNode,
	migrateNode: (node: MigratableCommandTreeNode) => CommandTreeNode,
): RootTreeNode {
	const { children, ...rest } = node
	return {
		...rest,
		children: migrateChildren(
			children,
			(child) => migrateLiteralNode(child, migrateNode),
		) as RootTreeNode['children'],
	}
}

function migrateLiteralNode(
	node: MigratableLiteralTreeNode,
	migrateNode: (node: MigratableCommandTreeNode) => CommandTreeNode,
): LiteralTreeNode {
	const { children, ...rest } = node
	return assignDefined(rest, { children: migrateChildren(children, migrateNode) })
}
