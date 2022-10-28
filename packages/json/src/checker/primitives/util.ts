import type { ErrorSeverity } from '@spyglassmc/core'
import { ErrorReporter, Range, StateProxy } from '@spyglassmc/core'
import { arrayToMessage, localize } from '@spyglassmc/locales'
import type { JsonExpectation, JsonNode } from '../../node/index.js'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker.js'

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
	totalErrorSpan: number
	maxSeverity: ErrorSeverity
	expectation?: JsonExpectation[]
	updateNodeAndCtx: () => void
}

export function attempt(
	checker: JsonChecker,
	node: JsonNode,
	ctx: JsonCheckerContext,
): AttemptResult {
	// TODO: The code below is mostly copied from core with some changes to support `expectation`. Could be refactored... I guess.
	const tempCtx: JsonCheckerContext = {
		...ctx,
		err: new ErrorReporter(),
		symbols: ctx.symbols.clone(),
	}

	checker(node, tempCtx)

	const tempExpectation = node.expectation
	StateProxy.undoChanges(node as StateProxy<JsonNode>)

	const totalErrorSpan = tempCtx.err.errors
		.map((e) => e.range.end - e.range.start)
		.reduce((a, b) => a + b, 0)

	return {
		totalErrorSpan,
		maxSeverity: Math.max(...tempCtx.err.errors.map((e) => e.severity)),
		expectation: tempExpectation,
		updateNodeAndCtx: () => {
			ctx.err.absorb(tempCtx.err)
			StateProxy.redoChanges(node as StateProxy<JsonNode>)
			tempCtx.symbols.applyDelayedEdits()
		},
	}
}

export function any(checkers: JsonChecker[] = []): JsonChecker {
	return (node, ctx) => {
		if (checkers.length === 0) {
			return
		}

		const attempts = checkers
			.map((checker) => attempt(checker, node, ctx))
			.sort(
				(a, b) =>
					a.maxSeverity - b.maxSeverity || a.totalErrorSpan - b.totalErrorSpan,
			)
		const sameTypeAttempts = attempts.filter((a) =>
			a.expectation?.map<string>((e) => e.type).includes(node.type),
		)
		const allExpectations = attempts
			.filter((a) => a.expectation)
			.flatMap((a) => a.expectation!)

		if (sameTypeAttempts.length === 0) {
			const allowedTypes = allExpectations.map((e) => localize(e.type.slice(5)))
			ctx.err.report(
				localize('expected', arrayToMessage(allowedTypes, false)),
				node,
			)
		} else {
			sameTypeAttempts[0].updateNodeAndCtx()
		}
		node.expectation = allExpectations
	}
}

export function expectation(
	checker: JsonChecker,
	ctx: JsonCheckerContext,
): JsonExpectation[] | undefined {
	const node: JsonNode = StateProxy.create({
		type: 'json:null',
		range: Range.create(0),
	})
	const tempCtx: JsonCheckerContext = {
		...ctx,
		err: new ErrorReporter(),
		depth: (ctx.depth ?? 0) + 1,
	}
	checker(node, tempCtx)
	return node.expectation
}
