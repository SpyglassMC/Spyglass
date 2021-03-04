import { localize } from '@spyglassmc/locales'
import { JsonAstNode, JsonBooleanAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function boolean(node: JsonAstNode, ctx: SchemaContext) {
	if (!JsonBooleanAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('boolean')]), node)
	}
}
