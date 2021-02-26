import { any, InfallibleParser, map } from '@spyglassmc/core'
import { ContentNode, MainNode, SyntaxUtil } from '../node'
import { compoundDefinition, describesClause, enumDefinition, injectClause, moduleDeclaration, useClause } from './syntax'
import { syntaxRepeat } from './util'

export const entry: InfallibleParser<MainNode> = map<SyntaxUtil<ContentNode>, MainNode>(
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
			children: res.nodes,
		}
		return ans
	}
)
