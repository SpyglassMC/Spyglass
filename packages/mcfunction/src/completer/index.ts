import type { DeepReadonly } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import type { McfunctionNode } from '../node/index.js'
import { CommandNode, MacroNode } from '../node/index.js'
import type { ArgumentTreeNode, RootTreeNode } from '../tree/index.js'
import {
	categorizeTreeChildren,
	redirect,
	resolveParentTreeNode,
} from '../tree/index.js'

export type MockNodesGetter = (
	treeNode: ArgumentTreeNode,
	range: core.CompleterContext,
) => core.Arrayable<core.AstNode>

/**
 * @param getMockNodes A function that returns a mock AST Node from given {@link ArgumentTreeNode}. These mock nodes
 * will be used for completing the argument.
 */
export function entry(
	tree: RootTreeNode,
	getMockNodes: MockNodesGetter,
): core.Completer<McfunctionNode> {
	return (node, ctx) => {
		const childNode = core.AstNode.findChild(node, ctx.offset, true)
		if (core.CommentNode.is(childNode) || MacroNode.is(childNode)) {
			return []
		} else {
			return command(tree, getMockNodes)(
				childNode ?? CommandNode.mock(ctx.offset),
				ctx,
			)
		}
	}
}

export function command(
	tree: RootTreeNode,
	getMockNodes: MockNodesGetter,
): core.Completer<CommandNode> {
	return (node, ctx) => {
		const index = core.AstNode.findChildIndex(node, ctx.offset, true)
		const selectedChildNode: DeepReadonly<core.AstNode> | undefined = node
			.children[index]?.children[0]
		if (selectedChildNode) {
			return core.completer.dispatch(selectedChildNode, ctx)
		}

		const lastChildNode = core.AstNode.findLastChild(node, ctx.offset)
		if (!lastChildNode) {
			return Object.keys(tree.children ?? {}).map((v) =>
				core.CompletionItem.create(v, ctx.offset, {
					kind: core.CompletionKind.Keyword,
				})
			)
		}

		const treePath = lastChildNode.path
		const { treeNode: parentTreeNode } = resolveParentTreeNode(
			redirect(tree, treePath),
			tree,
		)
		if (!parentTreeNode?.children) {
			return []
		}

		const { literalTreeNodes, argumentTreeNodes } = categorizeTreeChildren(
			parentTreeNode.children,
		)

		return [
			...literalTreeNodes.map(([name]) =>
				core.CompletionItem.create(name, ctx.offset, {
					kind: core.CompletionKind.Keyword,
				})
			),
			...argumentTreeNodes.flatMap(([_name, treeNode]) =>
				core.Arrayable.toArray(getMockNodes(treeNode, ctx)).flatMap(
					(n) => core.completer.dispatch(n, ctx),
				)
			),
		]
	}
}
