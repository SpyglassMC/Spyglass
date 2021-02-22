import { any, InfallibleParser, wrap } from '@spyglassmc/core'
import { ContentNode, MainNode } from '../node'
import { describesClause, moduleDeclaration, useClause } from './syntax'
import { repeat } from './util'

export function entry(): InfallibleParser<MainNode> {
	return wrap(
		repeat(
			any<ContentNode>([
				// compoundDefinition(),
				describesClause(),
				// enumDefinition(),
				// injectClause(),
				moduleDeclaration(),
				useClause(),
			])
		),
		res => ({
			type: 'nbtdoc:main',
			nodes: res.nodes,
		})
	)
}
