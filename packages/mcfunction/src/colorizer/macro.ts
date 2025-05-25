import * as core from '@spyglassmc/core'
import type { MacroNode } from '../node/macro.js'

export const macro: core.Colorizer<MacroNode> = (node, ctx) => {
	const tokens: core.ColorToken[] = []
	for (const child of node.children) {
		if (child.type === 'mcfunction:macro/prefix') {
			tokens.push(core.ColorToken.create(child.range, 'literal'))
		} else if (child.type === 'mcfunction:macro/other') {
			tokens.push(core.ColorToken.create(child.range, 'string'))
		} else {
			const { start, end } = child.range
			// $(
			tokens.push(core.ColorToken.create(core.Range.create(start, start + 2), 'literal'))
			// Key
			tokens.push(core.ColorToken.create(core.Range.create(start + 2, end - 1), 'property'))
			// )
			tokens.push(core.ColorToken.create(core.Range.create(end - 1, end), 'literal'))
		}
	}
	return tokens
}
