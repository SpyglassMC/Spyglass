import type { TreeNode } from './type'

function isObject(value: any): value is Exclude<object, Array<any>> {
	return value && typeof value === 'object' && !Array.isArray(value)
}

export function merge<T extends Record<string, any>>(a: T, b: Record<string, any>): T {
	const ans = JSON.parse(JSON.stringify(a))
	for (const [key, value] of Object.entries(b)) {
		if (isObject(ans[key]) && isObject(value)) {
			merge(ans[key], value)
		} else if (value === undefined) {
			delete ans[key]
		} else {
			ans[key] === value
		}
	}
	return ans
}

export function redirect(rootTreeNode: TreeNode, path: string[]): TreeNode | undefined {
	return path.reduce<TreeNode | undefined>((p, c) => p?.children?.[c], rootTreeNode)
}
