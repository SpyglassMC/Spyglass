import * as core from '@spyglassmc/core'
import type { JsonNode } from '../node'
import { array } from './array'
import { boolean } from './boolean'
import { null_ } from './null'
import { number } from './number'
import { object } from './object'
import { string } from './string'

const LegalNumberStart = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'])
export function json(dumpErrors = false): core.Parser<JsonNode> {
	return (src, ctx) => {
		const result = core.select([
			{ predicate: src => src.tryPeek('['), parser: array },
			{ predicate: src => src.tryPeek('false') || src.tryPeek('true'), parser: boolean },
			{ predicate: src => src.tryPeek('null'), parser: null_ },
			{ predicate: src => LegalNumberStart.has(src.peek()), parser: number },
			{ predicate: src => src.tryPeek('{'), parser: object },
			{ parser: string },
		])(src, ctx)

		if (dumpErrors) {
			ctx.err.dump()
		}
		return result
	}
}

export const entry: core.Parser<JsonNode> = json(true)
