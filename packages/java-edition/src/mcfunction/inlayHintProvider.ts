import * as core from '@spyglassmc/core'
import type { McfunctionNode } from './node'
import { ArgumentNode } from './node'

export const inlayHintProvider: core.InlayHintProvider<core.FileNode<McfunctionNode>> = (node, ctx) => {
	if (node.children[0]?.type !== 'mcfunction:entry') {
		return []
	}
	const ans: core.InlayHint[] = []
	core.traversePreOrder(node, _ => true, ArgumentNode.is,
		n => {
			const node = n as ArgumentNode
			const config = ctx.config.env.feature.inlayHint
			const parser = ArgumentNode.getParserId(node)
			if (config === true || (typeof config === 'object' && config.enabledParsers.includes(parser))) {
				ans.push({ offset: node.range.start, text: `${node.name}:` })
			}
		}
	)
	return ans
}
