import type {
	ArgumentTreeNode,
	CommandPermissionLevel,
	LiteralTreeNode,
	RootTreeNode,
	TreeNode,
	TreeNodePermissions,
	TreeNodeWithPermissionLevel,
} from './type.js'

/**
 * All permission levels, from the least to the most restrictive.
 */
export const CommandPermissionLevels: readonly CommandPermissionLevel[] = [
	'normal',
	'moderators',
	'gamemasters',
	'admins',
	'owners',
]

/**
 * The permissions of a node that anyone can use.
 */
export const AlwaysPass: TreeNodePermissions = {
	type: 'minecraft:always_pass',
}

/**
 * @returns The permissions of a node that requires the given permission level.
 */
export function requirePermission(level: CommandPermissionLevel): TreeNodePermissions {
	return {
		type: 'minecraft:require',
		permission: {
			type: 'minecraft:command_level',
			level,
		},
	}
}

/**
 * @returns The permission level required by the node, or `undefined` if the node doesn't require
 * any specific permission level.
 */
export function getPermissionLevel(node: TreeNode): CommandPermissionLevel | undefined {
	const permissions = node.permissions
	if (!permissions) {
		return undefined
	}
	if (permissions.type === 'minecraft:always_pass') {
		return 'normal'
	}
	if (permissions.permission?.type !== 'minecraft:command_level') {
		return undefined
	}
	return permissions.permission.level
}

/**
 * @returns `true` if the node requires the given permission level.
 */
export function isPermissionLevel<L extends CommandPermissionLevel>(
	node: TreeNode,
	level: L,
): node is TreeNodeWithPermissionLevel<L> {
	return getPermissionLevel(node) === level
}

export function redirect(rootTreeNode: TreeNode, path: readonly string[]): TreeNode | undefined {
	return path.reduce<TreeNode | undefined>((p, c) => p?.children?.[c], rootTreeNode)
}

/**
 * @returns A `TreeNode` whose `children` property, if exists, contains its subsequent `TreeNode`s.
 */
export function resolveParentTreeNode(
	parentTreeNode: TreeNode | undefined,
	rootTreeNode: RootTreeNode,
): { treeNode: TreeNode | undefined; path: undefined }
export function resolveParentTreeNode(
	parentTreeNode: TreeNode | undefined,
	rootTreeNode: RootTreeNode,
	parentPath: string[],
): { treeNode: TreeNode | undefined; path: string[] }
export function resolveParentTreeNode(
	parentTreeNode: TreeNode | undefined,
	rootTreeNode: RootTreeNode,
	parentPath?: string[],
): { treeNode: TreeNode | undefined; path: string[] | undefined } {
	if (parentTreeNode?.redirect) {
		return {
			treeNode: redirect(rootTreeNode, parentTreeNode.redirect),
			path: [...parentTreeNode.redirect],
		}
	} else if (parentTreeNode && !parentTreeNode.children && !parentTreeNode.executable) {
		// The `execute.run` literal tree node doesn't have any property.
		// We should use children from the root tree node in this case.
		return { treeNode: rootTreeNode, path: [] }
	} else {
		return { treeNode: parentTreeNode, path: parentPath }
	}
}

/**
 * Categorize command tree children to literal entries and argument entries.
 */
export function categorizeTreeChildren(
	children: Exclude<TreeNode['children'], undefined>,
): {
	literalTreeNodes: [string, LiteralTreeNode][]
	argumentTreeNodes: [string, ArgumentTreeNode][]
} {
	const ans = {
		literalTreeNodes: [] as [string, LiteralTreeNode][],
		argumentTreeNodes: [] as [string, ArgumentTreeNode][],
	}
	for (const e of Object.entries(children)) {
		/* istanbul ignore else */
		if (e[1].type === 'literal') {
			ans.literalTreeNodes.push(e as [string, LiteralTreeNode])
		} else if (e[1].type === 'argument') {
			ans.argumentTreeNodes.push(e as [string, ArgumentTreeNode])
		}
	}
	return ans
}
