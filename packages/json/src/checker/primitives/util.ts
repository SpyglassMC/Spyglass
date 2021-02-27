import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'

export function as(context: string, checker: Checker) {
	return (ctx: CheckerContext) => {
		checker(ctx)
		ctx.node.context = context
	}
}
