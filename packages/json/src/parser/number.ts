import * as core from '@spyglassmc/core'
import type { JsonNumberNode } from '../node/index.js'

export const number: core.Parser<JsonNumberNode> = core.setType(
	'json:number',
	core.float({
		// Regex form of the chart from https://www.json.org.
		pattern: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/,
	})
);
