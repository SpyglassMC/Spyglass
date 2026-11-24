import {
	type CommandTreeNode,
	type McmetaCommands,
	ReleaseVersion,
} from '../../dependency/index.js'
import { type NodeMigrationRule, Migrations } from './migrations/index.js'

export function migrateCommandTree(tree: McmetaCommands, version: ReleaseVersion) {
	for (const rule of Migrations) {
		if (
			(rule.since === undefined || ReleaseVersion.cmp(version, rule.since) >= 0)
			&& (rule.until === undefined || ReleaseVersion.cmp(version, rule.until) < 0)
		) {
			migrateNode(tree, rule)
		}
	}
}

function migrateNode(node: CommandTreeNode, rule: NodeMigrationRule) {
	// Migrate this node
	rule.apply(node)
	// Migrate children
	if (node.children !== undefined) {
		for (const child of Object.values(node.children)) {
			migrateNode(child, rule)
		}
	}
}
