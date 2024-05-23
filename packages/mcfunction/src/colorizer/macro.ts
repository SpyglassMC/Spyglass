import * as core from '@spyglassmc/core'
import type { MacroNode } from '../node/macro'

export const macro: core.Colorizer<MacroNode> = (node, ctx) => {
	const tokens: core.ColorToken[] = []
	tokens.push(
		core.ColorToken.create(
			core.Range.create(node.range.start, node.range.start + 1),
			'literal',
		),
	) // Dollar Sign
	for (const child of node.children) {
		if (child.type === 'mcfunction:macro/other') {
			tokens.push(core.ColorToken.create(child.range, 'string')) // Other stuff is Orange
		} else {
			const start = child.range.start
			const end = child.range.end
			// $( is Dark Blue
			tokens.push(
				core.ColorToken.create(
					core.Range.create(start, start + 2),
					'literal',
				),
			)
			// Key is Light Blue
			tokens.push(
				core.ColorToken.create(
					core.Range.create(start + 2, end - 1),
					'property',
				),
			)
			// ) is Dark Blue
			tokens.push(
				core.ColorToken.create(core.Range.create(end - 1, end), 'literal'),
			)
		}
	}
	return tokens
}
