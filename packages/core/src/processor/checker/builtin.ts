import type { ResourceLocationNode, SymbolBaseNode, SymbolNode } from '../../node'
import type { AstNode } from '../../node'
import type { CheckerContext, MetaRegistry } from '../../service'
import { Operations } from '../../service'
import { ErrorReporter } from '../../service'
import { traversePreOrder } from '../util'
import type { Checker, SyncChecker } from './Checker'

export type AttemptResult = {
	errorAmount: number,
	totalErrorSpan: number,
	updateNodeAndCtx: () => void,
}

export function attempt<N extends AstNode>(checker: Checker<N>, node: N, ctx: CheckerContext): AttemptResult {
	const tempCtx: CheckerContext = {
		...ctx,
		err: new ErrorReporter(),
		ops: new Operations(),
		symbols: ctx.symbols.clone(),
	}

	// FIXME: await
	checker(node, tempCtx)

	tempCtx.ops.undo()

	const totalErrorSpan = tempCtx.err.errors
		.map(e => e.range.end - e.range.start)
		.reduce((a, b) => a + b, 0)

	return {
		errorAmount: tempCtx.err.errors.length,
		totalErrorSpan,
		updateNodeAndCtx: () => {
			ctx.err.absorb(tempCtx.err)
			tempCtx.ops.redo()
			tempCtx.symbols.applyDelayedEdits()
		},
	}
}

export function any<N extends AstNode>(checkers: Checker<N>[]): Checker<N> {
	if (checkers.length === 0) {
		throw new Error('Expected at least one checker')
	}
	return (node, ctx) => {
		const attempts = checkers
			.map(checker => attempt(checker, node, ctx))
			.sort((a, b) => a.errorAmount - b.errorAmount || a.totalErrorSpan - b.totalErrorSpan)
		attempts[0].updateNodeAndCtx()
	}
}

/**
 * No operation.
 */
export const noop: SyncChecker<AstNode> = () => { }

/**
 * Use the shallowest children that have their own colorizers to provide the color tokens.
 */
export const fallback: Checker<AstNode> = async (node, ctx) => {
	const promises: Promise<unknown>[] = []
	traversePreOrder(node,
		({ node }) => !ctx.meta.hasChecker(node.type),
		({ node }) => ctx.meta.hasChecker(node.type),
		({ node }) => {
			const checker = ctx.meta.getChecker(node.type)
			const result = checker(node, ctx)
			if (result instanceof Promise) {
				promises.push(result)
			}
		}
	)
	await Promise.all(promises)
}

export const resourceLocation: Checker<ResourceLocationNode> = (_node, _ctx) => {
	// TODO
}

export const symbol: Checker<SymbolBaseNode> = (_node, _ctx) => {
	// TODO
}

export function registerCheckers(meta: MetaRegistry) {
	meta.registerChecker<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerChecker<SymbolNode>('symbol', symbol)
}
