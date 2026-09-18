import * as core from '@spyglassmc/core'
import { ErrorSeverity, Range } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { JsonNumberNode } from '../node/index.js'

export const number: core.Parser<JsonNumberNode> = (src, ctx) => {
	const value = core.select([{
		regex: /^-?(?:0|[1-9]\d*)(?!\d|[.eE])/,
		parser: core.long({ pattern: /^-?(?:0|[1-9]\d*)$/ }),
	}, {
		parser: core.float({
			// Regex form of the chart from https://www.json.org.
			pattern: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/,
		}),
	}])(src, ctx)

	if (value.hasUnderscoreSeparator) {
		for (let i = value.range.start; i < value.range.end; i++) {
			if (src.string[i] === '_') {
				ctx.err.report(
					localize('parser.json.number.illegal-underscore'),
					Range.create(i, i + 1),
					ErrorSeverity.Error,
				)
			}
		}
	}

	return { type: 'json:number', children: [value], value, range: value.range }
}
