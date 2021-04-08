import type { InfallibleParser, ParserContext, Source } from '@spyglassmc/core'
import { Range } from '@spyglassmc/core'
import type { IdentPathToken } from '../../node'
import { identifier } from './identifier'

export function identPath(): InfallibleParser<IdentPathToken> {
	return (src: Source, ctx: ParserContext): IdentPathToken => {
		const ans: IdentPathToken = {
			type: 'nbtdoc:ident_path',
			fromGlobalRoot: false,
			children: [],
			range: Range.create(src),
		}

		if (src.trySkip('::')) {
			ans.fromGlobalRoot = true
		}

		do {
			const start = src.cursor
			if (src.trySkip('super')) {
				ans.children.push({
					type: 'nbtdoc:literal',
					range: Range.create(start, src),
					value: 'super',
				})
			} else {
				ans.children.push(identifier()(src, ctx))
			}
		} while (src.trySkip('::'))

		ans.range.end = src.cursor

		return ans
	}
}
