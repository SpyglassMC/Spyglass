export type CommandPermissionLevel =
	| 'normal'
	| 'moderators'
	| 'gamemasters'
	| 'admins'
	| 'owners'

export interface TreeNodePermissions<L extends CommandPermissionLevel = CommandPermissionLevel> {
	type: 'minecraft:always_pass' | 'minecraft:require'
	permission?: {
		type: 'minecraft:command_level'
		level: L
	}
}

interface BaseTreeNode<L extends CommandPermissionLevel = CommandPermissionLevel> {
	// The following properties are provided in `commands.json` created by the data generator.
	type: string
	children?: { [name: string]: TreeNode<L> }
	executable?: boolean
	redirect?: readonly string[]

	// The following properties are custom.
	permissions?: TreeNodePermissions<L>
}

export interface ArgumentTreeNode<L extends CommandPermissionLevel = CommandPermissionLevel>
	extends BaseTreeNode<L>
{
	type: 'argument'
	argument: ArgumentTreeData
}

export interface ArgumentTreeData {
	type: string
	[name: string]: unknown
}

export interface LiteralTreeNode<L extends CommandPermissionLevel = CommandPermissionLevel>
	extends BaseTreeNode<L>
{
	type: 'literal'
}

export interface RootTreeNode<L extends CommandPermissionLevel = CommandPermissionLevel>
	extends BaseTreeNode<L>
{
	type: 'root'
}

export type TreeNode<L extends CommandPermissionLevel = CommandPermissionLevel> =
	| ArgumentTreeNode<L>
	| LiteralTreeNode<L>
	| RootTreeNode<L>

/**
 * A command tree node that is known to require the given permission level.
 */
export type TreeNodeWithPermissionLevel<L extends CommandPermissionLevel> = TreeNode<L> & {
	permissions: TreeNodePermissions<L> & {
		permission: {
			type: 'minecraft:command_level'
			level: L
		}
	}
}

type RecursivePartial<T> = T extends object ? { [K in keyof T]?: RecursivePartial<T[K]> } : T

export type PartialTreeNode<L extends CommandPermissionLevel = CommandPermissionLevel> =
	RecursivePartial<TreeNode<L>>
export type PartialRootTreeNode<L extends CommandPermissionLevel = CommandPermissionLevel> =
	RecursivePartial<RootTreeNode<L>>
