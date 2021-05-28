import { AstNode, ErrorReporter, Range } from '@spyglassmc/core'
import type { JsonExpectation, JsonNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'

export function ref(checker: () => JsonChecker): JsonChecker {
	return (node, ctx) => {
		return checker()(node, ctx)
	}
}

export function as(context: string, checker: JsonChecker): JsonChecker {
	return (node, ctx) => {
		checker(node, { ...ctx, context })
	}
}

export type AttemptResult = {
	totalErrorSpan: number,
	expectation?: JsonExpectation[],
	updateNodeAndCtx: () => void,
}

export function attempt(checker: JsonChecker, node: JsonNode, ctx: JsonCheckerContext): AttemptResult {
	// TODO: The code below is mostly copied from core with some changes to support `expectation`. Could be refactored... I guess.
	const tempNode = AstNode.clone(node)
	const tempCtx = {
		...ctx,
		err: new ErrorReporter(),
		symbols: ctx.symbols.clone(),
	}

	checker(tempNode, tempCtx)

	const totalErrorSpan = tempCtx.err.errors
		.map(e => e.range.end - e.range.start)
		.reduce((a, b) => a + b, 0)

	return {
		totalErrorSpan,
		expectation: tempNode.expectation,
		updateNodeAndCtx: () => {
			ctx.err.absorb(tempCtx.err)
			ctx.symbols.absorb(tempCtx.symbols)
			AstNode.replace(node, tempNode)
		},
	}
}

export function any(checkers: JsonChecker[]): JsonChecker {
	if (checkers.length === 0) {
		throw new Error('Expected at least one checker')
	}
	return (node, ctx) => {
		// TODO: somehow check the raw type first. https://discord.com/channels/666020457568403505/666037123450929163/847671251371819079
		const attempts = checkers
			.map(checker => attempt(checker, node, ctx))
			.sort((a, b) => a.totalErrorSpan - b.totalErrorSpan)
		attempts[0].updateNodeAndCtx()
		node.expectation = attempts.filter(a => a.expectation).flatMap(a => a.expectation!)
	}
}

export function expectation(checker: JsonChecker, ctx: JsonCheckerContext): JsonExpectation[] | undefined {
	const node: JsonNode = { type: 'json:null', range: Range.create(0) }
	const tempCtx: JsonCheckerContext = {
		...ctx,
		err: new ErrorReporter(),
		depth: (ctx.depth ?? 0) + 1,
	}
	checker(node, tempCtx)
	return node.expectation
}
