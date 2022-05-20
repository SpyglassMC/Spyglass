import type { InfallibleParser } from '@spyglassmc/core'
import { any, map } from '@spyglassmc/core'
import type { MainNode } from '../node/nodes'
import { dispatchStatement, enumDefinition, injectClause, struct, useStatement } from './syntax'
import { syntaxRepeat } from './util'

export const entry: InfallibleParser<MainNode> = map(
	syntaxRepeat(any([
		struct(),
		dispatchStatement(),
		enumDefinition(),
		injectClause(),
		useStatement(),
	]), true),
	res => {
		const ans: MainNode = {
			type: 'mcdoc:main',
			range: res.range,
			children: res.children,
		}
		return ans
	}
)
