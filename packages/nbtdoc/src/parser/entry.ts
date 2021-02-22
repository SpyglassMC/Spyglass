import { InfallibleParser } from '@spyglassmc/core'
import { MainNode } from '..'
import { ContentNode } from '../node'
import { moduleDeclaration } from './moduleDeclaration'
import { error } from './terminator/error'
import { any, wrap } from './util'

export function entry(): InfallibleParser<MainNode> {
	return wrap(
		any<ContentNode>([
			// describesClause(),
			moduleDeclaration(),
			error(),
		]),
		res => ({
			type: 'nbtdoc:main',
			nodes: [res],
		})
	)
}
