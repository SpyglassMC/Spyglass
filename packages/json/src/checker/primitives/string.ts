import { JsonStringAstNode } from '../../node'
import { CheckerContext } from '../CheckerContext'

export function string(ctx: CheckerContext) {
	if(!JsonStringAstNode.is(ctx.node)) {
		ctx.report('Expected a string')
	}
}

export function enumString(values: string[]) {
	return (ctx: CheckerContext) => {
		if(!JsonStringAstNode.is(ctx.node)) {
			ctx.report('Expected a string')
		} else if (!values.includes(ctx.node.value)) {
			ctx.report(`Expected one of ${values.join(', ')}`)
		}
	}
}

export function resource(id: string) {
	return (ctx: CheckerContext) => {
		if(!JsonStringAstNode.is(ctx.node)) {
			ctx.report('Expected a string')
		} else {
			ctx.node.resource = id
		}
	}
}
