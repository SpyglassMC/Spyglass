import * as core from '@spyglassmc/core'
import type { JsonNode } from '../node/index.js'
import { array } from './array.js'
import { boolean } from './boolean.js'
import { null_ } from './null.js'
import { number } from './number.js'
import { object } from './object.js'
import { string } from './string.js'

const LegalNumberStart = new Set([
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'-',
])
function jsonParser(dumpErrors: boolean): core.Parser<JsonNode> {
	return (src, ctx) => {
		const result = core.select([
			{ predicate: (src) => src.tryPeek('['), parser: array },
			{
				predicate: (src) => src.tryPeek('false') || src.tryPeek('true'),
				parser: boolean,
			},
			{ predicate: (src) => src.tryPeek('null'), parser: null_ },
			{
				predicate: (src) => LegalNumberStart.has(src.peek()),
				parser: number,
			},
			{ predicate: (src) => src.tryPeek('{'), parser: object },
			{ parser: string },
		])(src, ctx)

		if (dumpErrors) {
			ctx.err.dump()
		}
		return result
	}
}

/**
 * A JSON parser that dumps any parser errors after it finishes parsing.
 * This should be used when it is the root parser, e.g. for this package's
 * initialization method (the JSON package).
 */
export const entry = jsonParser(true)

/**
 * A JSON parser that doesn't dump parser errors after it finishes parsing.
 * This should be used when it is a child parser under another parent parser,
 * e.g. in the JSON `array` parser.
 *
 * Since this parser doesn't dump its errors when it's done, those errors
 * should be subsequently absorbed by the parent parser's `ParserContext`.
 */
export const json = jsonParser(false)
