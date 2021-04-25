import { localize } from '@spyglassmc/locales'
import type { Mutable } from '../node'
import type { LiteralNode, LiteralOptions } from '../node/LiteralNode'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { InfallibleParser } from './Parser'

export function literal(...pool: string[]): InfallibleParser<LiteralNode>
export function literal(options: LiteralOptions): InfallibleParser<LiteralNode>
export function literal(...param: [LiteralOptions] | string[]): InfallibleParser<LiteralNode> {
	const options = getOptions(param)
	return (src: Source, ctx: ParserContext): LiteralNode => {
		const ans: Mutable<LiteralNode> = {
			type: 'literal',
			range: Range.create(src),
			options,
			value: '',
		}

		for (const expected of options.pool) {
			if (src.trySkip(expected)) {
				ans.value = expected
				ans.range.end = src.cursor
				return ans
			}
		}

		ctx.err.report(localize('expected', options.pool), ans)

		return ans
	}
}

function getOptions(param: string[] | [LiteralOptions]): LiteralOptions {
	let ans: LiteralOptions
	if (typeof param[0] === 'object') {
		ans = param[0]
	} else {
		ans = {
			pool: param as string[],
		}
	}
	// Sort the pool from longest to shortest.
	ans.pool = ans.pool.sort((a, b) => b.length - a.length)
	return ans
}
