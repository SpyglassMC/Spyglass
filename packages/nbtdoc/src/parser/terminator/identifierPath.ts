import { InfallibleParser, ParserContext, Range, Source } from '@spyglassmc/core'
import { IdentifierPathToken } from '../../node'
import { identifier } from './identifier'

export function identifierPath(): InfallibleParser<IdentifierPathToken> {
	return (src: Source, ctx: ParserContext): IdentifierPathToken => {
		const ans: IdentifierPathToken = {
			type: 'nbtdoc:identifier_path',
			fromGlobalRoot: false,
			path: [],
			range: Range.create(src),
		}

		if (src.peek(2) === '::') {
			src.skip(2)
			ans.fromGlobalRoot = true
		}

		do {
			if (src.peek(5) === 'super') {
				const start = src.cursor
				src.skip(5)
				ans.path.push({
					type: 'nbtdoc:literal',
					range: Range.create(start, src),
					value: 'super',
				})
			} else {
				ans.path.push(identifier()(src, ctx))
			}
		} while (src.peek(2) === '::' && src.skip(2))

		ans.range.end = src.cursor

		return ans
	}
}
