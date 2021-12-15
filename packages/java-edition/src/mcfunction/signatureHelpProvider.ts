import * as core from '@spyglassmc/core'
import * as mcf from '@spyglassmc/mcfunction'
import type { CommandNode, McfunctionNode } from './node'

/**
 * Only command options that can be satisfied by the current command node will be listed in `signatures`.
 * Only parameters at and immediately after the `offset` will be listed in `parameters`.
 */
export function signatureHelpProvider(commandTreeName: string): core.SignatureHelpProvider<core.FileNode<McfunctionNode>> {
	const rootTreeNode = mcf.CommandTreeRegistry.instance.get(commandTreeName)

	return (fileNode, ctx) => {
		if (fileNode.children[0]?.type !== 'mcfunction:entry') {
			// Not mcfunction.
			return undefined
		}

		const node = getSelectedCommandNode(fileNode, ctx.offset)
		if (!node) {
			// No selected command node.
			return undefined
		}

		const options = getOptions(rootTreeNode, node)
		if (options.length === 0) {
			// Not matching any syntax at all.
			return undefined
		}

		const selectedIndex = core.findChildIndex(node, ctx.offset, true)
		if (selectedIndex < 0 || selectedIndex >= options[0].length) {
			// No matching syntax for the selected argument node.
			return undefined
		}

		const ans: core.SignatureHelp = {
			activeSignature: 0,
			signatures: [],
		}

		ans.signatures = options.map(v => {
			const part1 = v[selectedIndex]
			const part2 = selectedIndex + 1 < v.length ? ` ${v[selectedIndex + 1]}` : ''
			const label = `${part1}${part2}`
			return {
				label,
				activeParameter: 0,
				// documentation: localize('mcfunction.signature-help.command-documentation', v[0]),
				parameters: [
					{ label: [0, part1.length] },
					{ label: [part1.length, label.length] },
				],
			}
		})

		return ans
	}
}

function getSelectedCommandNode(fileNode: core.FileNode<McfunctionNode>, offset: number): CommandNode | undefined {
	return core.findChild(fileNode.children[0], offset, true) as CommandNode | undefined
}

function getOptions(rootTreeNode: mcf.RootTreeNode, node: CommandNode): string[][] {
	const current: string[] = []
	let treeNode: mcf.TreeNode | undefined = rootTreeNode

	for (const childNode of node.children) {
		treeNode = mcf.resolveTreeNode(treeNode, rootTreeNode)?.children?.[childNode.name]
		if (!treeNode) {
			break
		}
		current.push(mcf.parser.treeNodeToString(childNode.name, treeNode))
	}

	if (treeNode) {
		treeNode = mcf.resolveTreeNode(treeNode, rootTreeNode)
		if (treeNode?.children) {
			return mcf.parser.treeNodeChildrenToStringArray(treeNode.children, treeNode.executable).map(v => [...current, v])
		}
	}

	return current.length ? [current] : []
}
