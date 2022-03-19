import * as core from '@spyglassmc/core'
import type { McfunctionNode } from '../node'
import { CommandNode } from '../node'
import type { ArgumentTreeNode, RootTreeNode } from '../tree'
import { categorizeTreeChildren, CommandTreeRegistry, redirect, resolveParentTreeNode } from '../tree'

export type ArgumentSuggester = (treeNode: ArgumentTreeNode, ctx: core.CompleterContext) => readonly core.CompletionItem[]

/**
 * @param parsersToNodes A map from Minecraft command argument parser IDs (e.g. `brigadier:boolean`) to Spyglass AST node
 * types (e.g. `boolean`).
 */
export function entry(commandTreeName: string, argument: ArgumentSuggester): core.Completer<McfunctionNode> {
	return (node, ctx) => {
		const tree = CommandTreeRegistry.instance.get(commandTreeName)
		const childNode = core.AstNode.findChild(node, ctx.offset, true)
		if (core.CommentNode.is(childNode)) {
			return []
		} else {
			return command(tree, argument)(childNode ?? CommandNode.mock(ctx.offset), ctx)
		}
	}
}

export function command(tree: RootTreeNode, argument: ArgumentSuggester): core.Completer<CommandNode> {
	return (node, ctx) => {
		const index = core.AstNode.findChildIndex(node, ctx.offset, true)
		const selectedChildNode: core.AstNode | undefined = node.children[index]?.children[0]
		if (selectedChildNode) {
			return core.completer.fallback(selectedChildNode, ctx)
		}

		const lastChildNode = core.AstNode.findLastChild(node, ctx.offset)
		if (!lastChildNode) {
			return Object
				.keys(tree.children ?? {})
				.map(v => core.CompletionItem.create(v, ctx.offset, { kind: core.CompletionKind.Keyword }))
		}

		const treePath = lastChildNode.path
		const { treeNode: parentTreeNode } = resolveParentTreeNode(redirect(tree, treePath), tree)
		if (!parentTreeNode?.children) {
			return []
		}

		const ans: core.CompletionItem[] = []
		const { literalTreeNodes, argumentTreeNodes } = categorizeTreeChildren(parentTreeNode.children)
		ans.push(
			...literalTreeNodes.map(
				([name]) => core.CompletionItem.create(name, ctx.offset, { kind: core.CompletionKind.Keyword })
			),
			...argumentTreeNodes.map(
				([_name, treeNode]) => {
					return argument(treeNode, ctx)
				}
			).flat()
		)

		return ans
	}
}
