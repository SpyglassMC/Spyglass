import { any, InfallibleParser, map } from '@spyglassmc/core'
import { ContentNode, MainNode } from '../node'
import { describesClause, moduleDeclaration, useClause } from './syntax'
import { syntaxRepeat } from './util'

export function entry(): InfallibleParser<MainNode> {
	return map(
		syntaxRepeat(
			any<ContentNode>([
				// compoundDefinition(),
				describesClause(),
				// enumDefinition(),
				// injectClause(),
				moduleDeclaration(),
				useClause(),
			])
		),
		res => {
			const ans : MainNode = {
				type: 'nbtdoc:main',
				range: res.range,
				nodes: res.nodes,
			}
			return ans
		}
	)
}
