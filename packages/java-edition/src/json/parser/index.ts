import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { TextureSlotKind, TextureSlotNode } from '../node/index.js'

export function textureSlotParser(kind: TextureSlotKind): core.InfallibleParser<TextureSlotNode> {
	return (src, ctx) => {
		const start = src.cursor
		const ans: TextureSlotNode = {
			type: 'java_edition:texture_slot',
			range: core.Range.create(start),
			kind,
			children: [],
		}
		if (kind === 'definition') {
			const slot = core.symbol({ category: 'texture_slot', usageType: 'definition' })(src, ctx)
			ans.children.push(slot)
			ans.slot = slot
		} else if (src.tryPeek('#')) {
			ans.children.push(core.literal('#')(src, ctx))
			const slot = core.symbol({ category: 'texture_slot', usageType: 'reference' })(src, ctx)
			ans.children.push(slot)
			ans.slot = slot
		} else if (kind === 'reference') {
			ctx.err.report(localize('expected', '#'), ans)
		} else {
			const id = core.resourceLocation({ category: 'texture', usageType: 'reference' })(src, ctx)
			ans.children.push(id)
			ans.id = id
		}
		ans.range = core.Range.create(start, src)
		return ans
	}
}
