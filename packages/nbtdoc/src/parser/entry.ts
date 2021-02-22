import { InfallibleParser } from '@spyglassmc/core'
import { describesClause, error, moduleDeclaration } from '.'
import { ContentNode, MainNode } from '../node'
import { compoundDefinition, enumDefinition, injectClause } from './syntax'
import { any, wrap } from './util'

export function entry(): InfallibleParser<MainNode> {
	return wrap(
		any<ContentNode>([
			describesClause(),
			compoundDefinition(),
			enumDefinition(),
			injectClause(),
			moduleDeclaration(),
			error(),
		]),
		res => ({
			type: 'nbtdoc:main',
			nodes: [res], // FIXME
		})
	)
}
