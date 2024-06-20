import { localeQuote, localize } from '@spyglassmc/locales'
import type { AstNode, PrefixedNode } from '../node/index.js'
import type { ParserContext } from '../service/index.js'
import type { Source } from '../source/index.js'
import { Range } from '../source/index.js'
import { literal } from './literal.js'
import type { InfallibleParser, Parser, Result } from './Parser.js'
import { Failure } from './Parser.js'

export interface Options<C extends AstNode> {
	prefix: string
	child: Parser<C>
}

export function prefixed<C extends AstNode>(
	options: Options<C>,
): InfallibleParser<PrefixedNode<C>> {
	return (src: Source, ctx: ParserContext): PrefixedNode<C> => {
		const ans: PrefixedNode<C> = {
			type: 'prefixed',
			range: Range.create(src),
			prefix: options.prefix,
			children: [],
		}

		const prefix = literal(options.prefix)(src, ctx)
		ans.children.push(prefix)
		ans.range.end = src.cursor

		const child = options.child(src, ctx)
		if (child !== Failure) {
			ans.children.push(child)
		}
		ans.range.end = src.cursor

		return ans
	}
}
