import type { InfallibleParser, ParserContext, Source } from '@spyglassmc/core'
import { map, Range } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { MinecraftIdentifierToken } from '../../node'
import { identifier } from './identifier'

const Regex = /^[0-9a-z_-]*$/

export function minecraftIdentifier(): InfallibleParser<MinecraftIdentifierToken> {
	return (src: Source, ctx: ParserContext): MinecraftIdentifierToken => {
		const start = src.cursor
		const ans: MinecraftIdentifierToken = {
			type: 'nbtdoc:minecraft_identifier',
			range: Range.create(start, src),
			namespace: minecraftIdentifierPart()(src, ctx),
			path: [],
		}

		if (src.peek() === ':') {
			src.skip()
			do {
				ans.path.push(minecraftIdentifierPart()(src, ctx))
			} while (src.peek() === '/' && src.skip())
		} else {
			ctx.err.report(
				localize('nbtdoc.parser.minecraft-identifier.colon-expected', [
					localize('punc.quote', [':']),
				]),
				src
			)
		}

		ans.range.end = src.cursor

		return ans
	}
}

function minecraftIdentifierPart(): InfallibleParser<string> {
	return map(
		identifier({ regex: Regex, allowEmpty: true }),
		res => res.value
	)
}
