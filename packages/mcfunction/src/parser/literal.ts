import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { LiteralNode } from '../node'

export function literal(names: string[], isRoot = false): core.Parser<LiteralNode> {
	const options: core.LiteralOptions = {
		pool: names,
		colorTokenType: isRoot ? 'keyword' : 'literal',
	}
	return (src, ctx): core.Result<LiteralNode> => {
		const start = src.cursor
		const value = src.readUntil(' ', '\r', '\n')

		if (!value.length) {
			return core.Failure
		}

		const ans: core.Mutable<LiteralNode> = {
			type: 'mcfunction:literal',
			range: core.Range.create(start, src),
			options,
			name: value,
			value,
		}

		if (!names.includes(value)) {
			ctx.err.report(localize('expected', names), ans)
		}

		return ans
	}
}
