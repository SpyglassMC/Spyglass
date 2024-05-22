import * as core from '@spyglassmc/core'
import type { MacroChildNode, MacroKeyNode } from '../node/macro'

export const macroChild: core.Colorizer<MacroChildNode> = (node, ctx) => {
	if (node.children) {
		const colorizer = ctx.meta.getColorizer(node.children[0].type)
		const result = colorizer(node.children[0], ctx)
		return core.ColorToken.fillGap(
			result,
			node.range,
			node.options.colorTokenType ?? 'string',
		)
	} else {
		return [core.ColorToken.create(node, node.options.colorTokenType ?? 'string')]
	}
}

export const macroKey: core.Colorizer<MacroKeyNode> = (node) => {
	return [core.ColorToken.create(node, node.colorTokenType ?? 'string')]
}