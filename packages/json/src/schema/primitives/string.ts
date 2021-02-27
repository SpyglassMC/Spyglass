import { JsonStringAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function string(ctx: SchemaContext): ctx is SchemaContext<JsonStringAstNode> {
	if(!JsonStringAstNode.is(ctx.node)) {
		ctx.error('Expected a string')
		return false
	}
	return true
}

export function enumString(values: string[]) {
	return (ctx: SchemaContext) => {
		if (!string(ctx)) return

		if (!values.includes(ctx.node.value)) {
			ctx.error(`Expected one of ${values.join(', ')}`)
		}
	}
}

export function resource(id: string) {
	// TODO
	return string
}
