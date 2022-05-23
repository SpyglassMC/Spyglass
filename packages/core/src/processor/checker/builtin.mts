import { localize } from '@spyglassmc/locales'
import type { AstNode, SymbolBaseNode, SymbolNode } from '../../node/index.mjs'
import { ResourceLocationNode } from '../../node/index.mjs'
import type { CheckerContext, MetaRegistry } from '../../service/index.mjs'
import { ErrorReporter, Operations } from '../../service/index.mjs'
import { ErrorSeverity } from '../../source/index.mjs'
import { traversePreOrder } from '../util.mjs'
import type { Checker, SyncChecker } from './Checker.mjs'

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
 * Use the shallowest children that have their own checker to validate.
 */
export const fallback: Checker<AstNode> = async (node, ctx) => {
	const promises: Promise<unknown>[] = []
	traversePreOrder(node,
		node => !ctx.meta.hasChecker(node.type),
		node => ctx.meta.hasChecker(node.type),
		node => {
			const checker = ctx.meta.getChecker(node.type)
			const result = checker(node, ctx)
			if (result instanceof Promise) {
				promises.push(result)
			}
		}
	)
	await Promise.allSettled(promises)
}

export const dispatchSync: SyncChecker<AstNode> = (node, ctx) => {
	for (const child of node.children ?? []) {
		if (ctx.meta.hasChecker(child.type)) {
			const checker = ctx.meta.getChecker(child.type)
			checker(child, ctx)
		}
	}
}

export const resourceLocation: Checker<ResourceLocationNode> = (node, ctx) => {
	const full = ResourceLocationNode.toString(node, 'full')
	if (node.options.pool) {
		if (!node.options.pool.includes(full)) {
			ctx.err.report(localize('expected', node.options.pool), node, ErrorSeverity.Error)
		}
		return
	}
}

export const symbol: Checker<SymbolBaseNode> = (_node, _ctx) => {
	// TODO
}

export function registerCheckers(meta: MetaRegistry) {
	meta.registerChecker<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerChecker<SymbolNode>('symbol', symbol)
}
