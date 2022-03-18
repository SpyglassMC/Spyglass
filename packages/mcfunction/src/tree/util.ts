import type { RootTreeNode, TreeNode } from './type'

export function redirect(rootTreeNode: TreeNode, path: readonly string[]): TreeNode | undefined {
	return path.reduce<TreeNode | undefined>((p, c) => p?.children?.[c], rootTreeNode)
}

/**
 * @returns A `TreeNode` whose `children` property, if exists, contains its subsequent `TreeNode`s.
 */
export function resolveParentTreeNode(parentTreeNode: TreeNode | undefined, rootTreeNode: RootTreeNode): { treeNode: TreeNode | undefined, path: undefined }
export function resolveParentTreeNode(parentTreeNode: TreeNode | undefined, rootTreeNode: RootTreeNode, parentPath: string[]): { treeNode: TreeNode | undefined, path: string[] }
export function resolveParentTreeNode(parentTreeNode: TreeNode | undefined, rootTreeNode: RootTreeNode, parentPath?: string[]): { treeNode: TreeNode | undefined, path: string[] | undefined } {
	if (parentTreeNode?.redirect) {
		return { treeNode: redirect(rootTreeNode, parentTreeNode.redirect), path: [...parentTreeNode.redirect] }
	} else if (parentTreeNode && !parentTreeNode.children && !parentTreeNode.executable) {
		// The `execute.run` literal tree node doesn't have any property.
		// We should use children from the root tree node in this case.
		return { treeNode: rootTreeNode, path: [] }
	} else {
		return { treeNode: parentTreeNode, path: parentPath }
	}
}
