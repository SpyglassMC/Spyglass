import rfdc from 'rfdc'
import type { RootTreeNode, TreeNode } from './type'

function isObject(value: unknown): value is Exclude<object, Array<any>> {
	return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function merge<T extends Record<string, any>>(a: T, b: Record<string, any>): T {
	const ans = rfdc()(a)
	for (const [key, value] of Object.entries(b) as [keyof typeof ans, any][]) {
		if (isObject(ans[key]) && isObject(value)) {
			ans[key] = merge(ans[key], value)
		} else if (value === undefined) {
			delete ans[key]
		} else {
			ans[key] = value
		}
	}
	return ans
}

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
