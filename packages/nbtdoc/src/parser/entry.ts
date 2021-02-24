import { any, InfallibleParser, map } from '@spyglassmc/core'
import { ContentNode, MainNode } from '../node'
import { compoundDefinition, describesClause, enumDefinition, injectClause, moduleDeclaration, useClause } from './syntax'
import { syntaxRepeat } from './util'

export const entry: InfallibleParser<MainNode> = map(
	syntaxRepeat(any<ContentNode>([
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
			nodes: res.nodes,
		}
		return ans
	}
)
