import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { MainNode } from '../node/MainNode'

export class MainParser implements Parser {
	parse(src: Source, ctx: ParserContext): MainNode {
		const start = src.cursor
		while (src.canRead()) {
			const keyword = src
				.skipWhitespace()
				.readUntilOrEnd('\r', '\n', ' ')
			switch (keyword) {
				case 'compound':

					break
				case 'enum':

					break
				case 'mod':

					break
				case 'use':

					break
				case 'describe':

					break
				case 'inject':

					break
				default:
					// error
					break
			}
		}
		throw new Error('Method not implemented.')
	}
}
