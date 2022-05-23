import type { BooleanNode } from '../node/BooleanNode.mjs'
import { literal } from './literal.mjs'
import type { InfallibleParser } from './Parser.mjs'
import { map } from './util.mjs'

export const boolean: InfallibleParser<BooleanNode> = map(
	literal('false', 'true'),
	res => ({
		type: 'boolean',
		range: res.range,
		value: res.value === '' ? undefined : res.value === 'true',
	})
)
