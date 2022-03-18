import * as core from '@spyglassmc/core'
import type { CommandNode, McfunctionNode } from '../node'
import type { RootTreeNode } from '../tree'
import { CommandTreeRegistry } from '../tree'

export function entry(commandTreeName: string): core.Completer<McfunctionNode> {
	return (node, ctx) => {
		const tree = CommandTreeRegistry.instance.get(commandTreeName)
		const childNode = core.AstNode.findChild(node, ctx.offset, true)
		if (core.CommentNode.is(childNode)) {
			return []
		} else if (!childNode) {
			return Object
				.keys(tree.children ?? {})
				.map(v => core.CompletionItem.create(v, ctx.offset))
		} else {
			return command(tree)(childNode, ctx)
		}
	}
}

export function command(tree: RootTreeNode): core.Completer<CommandNode> {
	return (node, ctx) => {
		const childNode = core.AstNode.findChild(node, ctx.offset, true)
		if (!childNode) {
			return []
		} else {
			return core.completer.fallback(childNode, ctx)
		}
	}
}
