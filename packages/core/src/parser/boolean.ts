import type { BooleanNode } from '../node/BooleanNode'
import { literal } from './literal'
import type { InfallibleParser } from './Parser'
import { map } from './util'

export const boolean: InfallibleParser<BooleanNode> = map(
	literal('false', 'true'),
	res => ({
		type: 'boolean',
		range: res.range,
		value: res.value === 'true',
	})
)
