import * as core from '@spyglassmc/core'
import type { CommandNode, McfunctionNode } from '../node'
import type { RootTreeNode } from '../tree'
import { CommandTreeRegistry, redirect, resolveParentTreeNode } from '../tree'

/**
 * @param parsersToNodes A map from Minecraft command argument parser IDs (e.g. `brigadier:boolean`) to Spyglass AST node
 * types (e.g. `boolean`).
 */
export function entry(commandTreeName: string, parsersToNodes: Map<core.FullResourceLocation, string>): core.Completer<McfunctionNode> {
	return (node, ctx) => {
		const tree = CommandTreeRegistry.instance.get(commandTreeName)
		const childNode = core.AstNode.findChild(node, ctx.offset, true)
		if (core.CommentNode.is(childNode)) {
			return []
		} else {
			return command(tree, parsersToNodes)(childNode, ctx)
		}
	}
}

export function command(tree: RootTreeNode, parsersToNodes: Map<core.FullResourceLocation, string>): core.StartableCompleter<CommandNode> {
	return core.StartableCompleter.create((node, ctx) => {
		if (!node) {
			return Object
				.keys(tree.children ?? {})
				.map(v => core.CompletionItem.create(v, ctx.offset, { kind: core.CompletionKind.Keyword }))
		}
		const index = core.AstNode.findChildIndex(node, ctx.offset, true)
		const selectedChildNode: core.AstNode | undefined = node.children[index]?.children[0]
		if (selectedChildNode) {
			return core.completer.fallback(selectedChildNode, ctx)
		}

		const lastChildNode = core.AstNode.findLastChild(node, ctx.offset)
		if (!lastChildNode) {
			return []
		}

		const treePath = lastChildNode.path
		const { treeNode: parentTreeNode } = resolveParentTreeNode(redirect(tree, treePath), tree)
		if (!parentTreeNode?.children) {
			return []
		}

		// FIXME
		return Object
			.keys(parentTreeNode.children)
			.map(v => core.CompletionItem.create(v, ctx.offset, { kind: core.CompletionKind.Keyword }))
	})
}
