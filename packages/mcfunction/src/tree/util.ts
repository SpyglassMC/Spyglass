import type {
	ArgumentTreeNode,
	LiteralTreeNode,
	RootTreeNode,
	TreeNode,
} from './type.js'

export function redirect(
	rootTreeNode: TreeNode,
	path: readonly string[],
): TreeNode | undefined {
	return path.reduce<TreeNode | undefined>(
		(p, c) => p?.children?.[c],
		rootTreeNode,
	)
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
	} else if (
		parentTreeNode &&
		!parentTreeNode.children &&
		!parentTreeNode.executable
	) {
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
