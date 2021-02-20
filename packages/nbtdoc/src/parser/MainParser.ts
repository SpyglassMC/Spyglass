import { arrayToMessage, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { MainNode } from '../node/MainNode'

export class MainParser implements Parser {
	parse(src: Source, ctx: ParserContext): MainNode {
		const start = src.cursor
		while (src.canRead()) {
			const key = src
				.skipWhitespace()
				.peek()
			switch (key) {
				case 'c':
					// Compound definition.
					
					break
				case 'e':
					// Enum definition.

					break
				case 'm':
					// Module declaration.

					break
				case 'u':
					// Use clause.

					break
				case 'd':
					// Describe clause.

					break
				case 'i':
					// Inject clause.

					break
				default:
					ctx.err.report(
						localize('expected-got', [
							arrayToMessage(['compound', 'enum', 'module', 'use', 'describe', 'inject']),
							localize('punc.quote', [key]),
						]),
						Range.create(start, src.cursor)
					)
					break
			}
		}
		throw new Error('Method not implemented.')
	}
}
