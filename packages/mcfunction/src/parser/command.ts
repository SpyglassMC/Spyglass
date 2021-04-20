import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { ArgumentNode, CommandNode } from '../node'
import type { ArgumentTreeNode, LiteralTreeNode, RootTreeNode, TreeNode } from '../tree/type'

export function command(tree: RootTreeNode): core.Parser<CommandNode> {
	throw 'TODO'
}

function dispatch(children: TreeNode['children']): core.Parser<ArgumentNode | null> {
	return (src, ctx): ArgumentNode | null => {
		if (!children) {
			ctx.err.report(localize('expected', localize('mcfunction.parser.eoc')), src)
			return null
		}
		const a = Object.entries(children)
		core.any([])
		throw 'TODO'
	}
}
