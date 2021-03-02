import { ErrorReporter } from '@spyglassmc/core'
import { JsonAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'

export function as(context: string, checker: Checker<JsonAstNode>): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		checker(node, ctx)
		node.context = context
	}
}

export type AttemptResult = {
	updateCtx: () => void,
	totalErrorRange: number,
}

export function attempt(checker: Checker<JsonAstNode>, node: JsonAstNode, ctx: CheckerContext): AttemptResult {
	// TODO: determine whether cloning of AST is necessary
	// Currently nodes are not cloned
	const tempCtx = CheckerContext.create({
		...ctx,
		err: new ErrorReporter(),
	})

	checker(node, tempCtx)

	const totalErrorRange = tempCtx.err.errors
		.map(e => e.range.end - e.range.start)
		.reduce((a, b) => a + b, 0)

	return {
		totalErrorRange,
		updateCtx: () => {
			ctx.err.absorb(tempCtx.err)
		},
	}
}

export function any(checkers: Checker<JsonAstNode>[]): Checker<JsonAstNode> {
	if (checkers.length === 0) {
		throw new Error('Expected at least one checker')
	}
	return (node: JsonAstNode, ctx: CheckerContext) => {
		const attempts = checkers
			.map(checker => attempt(checker, node, ctx))
			.sort((a, b) => a.totalErrorRange - b.totalErrorRange)
		attempts[0].updateCtx()
	}
}
