import { InfallibleParser } from '@spyglassmc/core'
import { describesClause, moduleDeclaration } from '.'
import { ContentNode, MainNode } from '../node'
import { compoundDefinition, enumDefinition, injectClause } from './syntax'
import { any, repeat, wrap } from './util'

export function entry(): InfallibleParser<MainNode> {
	return wrap(
		repeat(
			any<ContentNode>([
				describesClause(),
				compoundDefinition(),
				enumDefinition(),
				injectClause(),
				moduleDeclaration(),
			])
		),
		res => ({
			type: 'nbtdoc:main',
			nodes: res.nodes,
		})
	)
}
