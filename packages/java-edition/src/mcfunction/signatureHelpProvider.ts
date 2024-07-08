import * as core from '@spyglassmc/core'
import * as mcf from '@spyglassmc/mcfunction'
import type { RootTreeNode } from '../dependency/index.js'

/**
 * Only command options that can be satisfied by the current command node will be listed in `signatures`.
 * Only parameters at and immediately after the `offset` will be listed in `parameters`.
 */
export function signatureHelpProvider(
	rootTreeNode: RootTreeNode,
): core.SignatureHelpProvider<core.FileNode<mcf.McfunctionNode>> {
	return (fileNode, ctx) => {
		if (fileNode.children[0]?.type !== 'mcfunction:entry') {
			// Not mcfunction.
			return undefined
		}

		const node = getSelectedCommandNode(fileNode, ctx.offset)
		if (!mcf.CommandNode.is(node)) {
			// Not a command node.
			return undefined
		}
		const argumentNodes = node ? node.children : []

		const options = getOptions(rootTreeNode, argumentNodes)
		if (options.length === 0) {
			// Not matching any syntax at all.
			return undefined
		}

		let selectedIndex = 0
		for (const child of argumentNodes) {
			if (ctx.offset > child.range.end) {
				selectedIndex += 1
			} else {
				break
			}
		}
		if (selectedIndex >= options[0].length) {
			// No matching syntax for the selected argument node.
			return undefined
		}

		const ans: core.SignatureHelp = { activeSignature: 0, signatures: [] }

		ans.signatures = options.map((v) => {
			const part1 = v[selectedIndex]
			const part2 = selectedIndex + 1 < v.length ? ` ${v[selectedIndex + 1]}` : ''
			const label = `${part1}${part2}`
			return {
				label,
				activeParameter: 0,
				// documentation: localize('mcfunction.signature-help.command-documentation', v[0]),
				parameters: [{ label: [0, part1.length] }, { label: [part1.length, label.length] }],
			}
		})

		return ans
	}
}

function getSelectedCommandNode(
	fileNode: core.DeepReadonly<core.FileNode<mcf.McfunctionNode>>,
	offset: number,
) {
	return core.AstNode.findChild(fileNode.children[0], offset, true)
}

function getOptions(
	rootTreeNode: mcf.RootTreeNode,
	argumentNodes: core.DeepReadonly<mcf.CommandNode['children']>,
): string[][] {
	const current: string[] = []
	let treeNode: mcf.TreeNode | undefined = rootTreeNode

	for (const argumentNode of argumentNodes) {
		const name = argumentNode.path[argumentNode.path.length - 1]
		if (!name) {
			break
		}
		treeNode = mcf.resolveParentTreeNode(treeNode, rootTreeNode).treeNode?.children?.[name]
		if (!treeNode) {
			break
		}
		current.push(mcf.treeNodeToString(name, treeNode))
	}

	if (treeNode) {
		treeNode = mcf.resolveParentTreeNode(treeNode, rootTreeNode).treeNode
		if (treeNode?.children) {
			return mcf.treeNodeChildrenToStringArray(treeNode.children, treeNode.executable).map((
				v,
			) => [...current, v])
		}
	}

	return current.length ? [current] : []
}
