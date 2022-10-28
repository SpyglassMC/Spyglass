import type { BooleanNode } from '../node/BooleanNode.js'
import { literal } from './literal.js'
import type { InfallibleParser } from './Parser.js'
import { map } from './util.js'

export const boolean: InfallibleParser<BooleanNode> = map(
	literal('false', 'true'),
	(res) => ({
		type: 'boolean',
		range: res.range,
		value: res.value === '' ? undefined : res.value === 'true',
	}),
)
