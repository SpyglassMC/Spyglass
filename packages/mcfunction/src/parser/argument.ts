import * as core from '@spyglassmc/core'
import type { ArgumentNode, LiteralArgumentNode } from '../node'
import type { ArgumentTreeNode, LiteralTreeNode } from '../tree/type'

export function argument(name: string, node: LiteralTreeNode | ArgumentTreeNode): core.Parser<ArgumentNode> {
	if (node.type === 'literal') {
		return literal(name, node)
	} else {
		return (src, ctx): ArgumentNode => {
			throw 'TODO'
		}
	}
}

function literal(name: string, node: LiteralTreeNode): core.Parser<LiteralArgumentNode> {
	return core.map(
		core.fail<core.LiteralNode>(core.literal(name)),
		res => ({
			...res,
			type: 'mcfunction:argument/literal',
		} as LiteralArgumentNode)
	)
}
