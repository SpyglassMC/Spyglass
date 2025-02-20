import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { TextureSlotKind, TextureSlotNode, TranslationValueNode } from '../node/index.js'

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
			ctx.err.report(localize('expected', localeQuote('#')), src)
		} else {
			const id = core.resourceLocation({ category: 'texture', usageType: 'reference' })(src, ctx)
			ans.children.push(id)
			ans.id = id
		}
		ans.range = core.Range.create(start, src)
		return ans
	}
}

export const translationValueParser: core.InfallibleParser<TranslationValueNode> = (src, ctx) => {
	const start = src.cursor
	const ans: TranslationValueNode = {
		type: 'java_edition:translation_value',
		range: core.Range.create(start),
		children: [],
		value: '',
	}
	while (src.canRead()) {
		src.skipUntilOrEnd('%')
		const argStart = src.cursor
		if (src.trySkip('%')) {
			if (src.trySkip('%')) {
				const token = src.sliceToCursor(argStart)
				ans.children.push({
					type: 'literal',
					range: core.Range.create(argStart, src),
					options: { pool: [token], colorTokenType: 'escape' },
					value: token,
				})
				continue
			}
			let hasInteger = false
			while (src.canRead() && core.Source.isDigit(src.peek())) {
				src.skip()
				hasInteger = true
			}
			if (hasInteger && !src.trySkip('$')) {
				ctx.err.report(
					localize(
						'java-edition.translation-value.percent-escape-hint',
						localize('expected', localeQuote('$')),
					),
					src,
				)
			}
			if (!src.trySkip('s')) {
				ctx.err.report(
					localize(
						'java-edition.translation-value.percent-escape-hint',
						localize('expected', localeQuote('s')),
					),
					src,
				)
			}
			const token = src.sliceToCursor(argStart)
			ans.children.push({
				type: 'literal',
				range: core.Range.create(argStart, src),
				options: { pool: [token] },
				value: token,
			})
		}
	}
	ans.value = src.sliceToCursor(start)
	ans.range = core.Range.create(start, src)
	return ans
}
