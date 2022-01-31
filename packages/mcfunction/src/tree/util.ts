import type { RootTreeNode, TreeNode } from './type'

export function redirect(rootTreeNode: TreeNode, path: string[]): TreeNode | undefined {
	return path.reduce<TreeNode | undefined>((p, c) => p?.children?.[c], rootTreeNode)
}

/**
 * @returns A `TreeNode` whose `children` property, if exists, contains its subsequent `TreeNode`s.
 */
export function resolveTreeNode(treeNode: TreeNode, rootTreeNode: RootTreeNode): TreeNode | undefined {
	return treeNode.redirect
		? redirect(rootTreeNode, treeNode.redirect)
		: (treeNode.children || treeNode.executable)
			? treeNode
			// The `execute.run` literal tree node doesn't have any property.
			// We should use children from the root tree node in this case.
			: rootTreeNode
}
