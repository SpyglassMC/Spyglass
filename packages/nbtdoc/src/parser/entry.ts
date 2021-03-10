import type { InfallibleParser } from '@spyglassmc/core'
import { any, map } from '@spyglassmc/core'
import type { MainNode } from '../node'
import { compoundDefinition, describesClause, enumDefinition, injectClause, moduleDeclaration, useClause } from './syntax'
import { syntaxRepeat } from './util'

export const entry: InfallibleParser<MainNode> = map(
	syntaxRepeat(any([
		compoundDefinition(),
		describesClause(),
		enumDefinition(),
		injectClause(),
		moduleDeclaration(),
		useClause(),
	]), true),
	res => {
		const ans: MainNode = {
			type: 'nbtdoc:main',
			range: res.range,
			children: res.nodes,
		}
		return ans
	}
)
