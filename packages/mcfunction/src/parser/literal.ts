import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { LiteralCommandChildNode } from '../node/index.js'

export function literal(names: string[], isRoot = false): core.Parser<LiteralCommandChildNode> {
	const options: core.LiteralOptions = {
		pool: names,
		colorTokenType: isRoot ? 'keyword' : 'literal',
	}
	return (src, ctx): core.Result<LiteralCommandChildNode> => {
		const start = src.cursor
		const value = src.readUntil(' ', '\r', '\n')

		if (!value.length) {
			return core.Failure
		}

		const ans: core.Mutable<LiteralCommandChildNode> = {
			type: 'mcfunction:command_child/literal',
			range: core.Range.create(start, src),
			options,
			value,
		}

		if (!names.includes(value)) {
			ctx.err.report(localize('expected', names), ans)
		}

		return ans
	}
}
