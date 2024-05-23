import * as core from '@spyglassmc/core'
import type {
	MacroGapNode,
	MacroKeyNode,
	MacroSignNode,
	MacroVariableNode,
} from '../node/macro'

export const macroChild: core.Colorizer<
	MacroGapNode | MacroVariableNode | MacroSignNode
> = (node, ctx) => {
	const color = node.type === 'mcfunction:macro/gap'
		? 'string'
		: 'literal'
	if (node.children) {
		const colorizer = ctx.meta.getColorizer(node.children[0].type)
		const result = colorizer(node.children[0], ctx)
		return core.ColorToken.fillGap(
			result,
			node.range,
			color,
		)
	} else {
		return [
			core.ColorToken.create(node, color),
		]
	}
}

export const macroKey: core.Colorizer<MacroKeyNode> = (node) => {
	return [core.ColorToken.create(node, 'property')]
}
