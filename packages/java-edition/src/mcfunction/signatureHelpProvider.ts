import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
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
			return undefined
		}

		const node = getSelectedCommandNode(fileNode, ctx.offset)
		if (!node) {
			return undefined
		}

		const ans: core.SignatureHelp = {
			activeSignature: 0,
			signatures: [],
		}

		const options = getOptions(rootTreeNode, node)
		// FIXME
		if (options.options.length > 0) {
			ans.signatures = options.options.map(v => {
				const label = [...options.current, v].join(' ')
				return {
					label,
					activeParameter: 0,
					parameters: [
						{
							label: [0, label.length],
							documentation: localize('mcfunction.signature-help.command-documentation', 'advancement'),
						},
						// FIXME
					],
				}
			})
		} else {
			const label = options.current.join(' ')
			ans.signatures = [{
				label,
				activeParameter: 0,
				parameters: [
					{
						label: [0, label.length],
						documentation: localize('mcfunction.signature-help.command-documentation', 'advancement'),
					},
					// FIXME
				],
			}]
		}

		return ans
	}
}

function getSelectedCommandNode(fileNode: core.FileNode<McfunctionNode>, offset: number): CommandNode | undefined {
	let { node } = core.selectedNode(fileNode, offset)

	while (node && !mcf.CommandNode.is(node)) {
		node = node.parent
	}

	return node
}

function getOptions(rootTreeNode: mcf.RootTreeNode, node: CommandNode): { current: string[], options: string[] } {
	const ans: ReturnType<typeof getOptions> = {
		current: [],
		options: [],
	}
	let treeNode: mcf.TreeNode | undefined = rootTreeNode

	for (const childNode of node.children) {
		treeNode = mcf.resolveTreeNode(treeNode, rootTreeNode)?.children?.[childNode.name]
		if (!treeNode) {
			break
		}
		ans.current.push(mcf.parser.treeNodeToString(childNode.name, treeNode))
	}

	if (treeNode) {
		treeNode = mcf.resolveTreeNode(treeNode, rootTreeNode)!
		ans.options = treeNode.children
			? mcf.parser.treeNodeChildrenToStringArray(treeNode.children, treeNode.executable)
			: []
	}

	return ans
}
