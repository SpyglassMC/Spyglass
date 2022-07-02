import { localize } from '@spyglassmc/locales'
import { ResourceLocation, StateProxy } from '../../common/index.js'
import type { AstNode, SymbolBaseNode, SymbolNode } from '../../node/index.js'
import { ResourceLocationNode } from '../../node/index.js'
import type { BinderContext, MetaRegistry } from '../../service/index.js'
import { ErrorReporter } from '../../service/index.js'
import { ErrorSeverity } from '../../source/index.js'
import { traversePreOrder } from '../util.js'
import type { Binder } from './Binder.js'
import { AsyncBinder, SyncBinder } from './Binder.js'

export type AttemptResult = {
	errorAmount: number,
	totalErrorSpan: number,
	updateNodeAndCtx: () => void,
}

export function attempt<B extends Binder<never>>(binder: B, node: B extends Binder<infer N extends AstNode> ? N : never, ctx: BinderContext): B extends SyncBinder<any> ? AttemptResult : Promise<AttemptResult>
export function attempt<N extends AstNode>(binder: Binder<N>, node: N, ctx: BinderContext): AttemptResult | Promise<AttemptResult> {
	const tempCtx: BinderContext = {
		...ctx,
		err: new ErrorReporter(),
		symbols: ctx.symbols.clone(),
	}

	const processAfterBinder = () => {
		StateProxy.undoChanges(node as StateProxy<N>)

		const totalErrorSpan = tempCtx.err.errors
			.map(e => e.range.end - e.range.start)
			.reduce((a, b) => a + b, 0)

		return {
			errorAmount: tempCtx.err.errors.length,
			totalErrorSpan,
			updateNodeAndCtx: () => {
				ctx.err.absorb(tempCtx.err)
				StateProxy.redoChanges(node as StateProxy<N>)
				tempCtx.symbols.applyDelayedEdits()
			},
		}
	}

	if (SyncBinder.is(binder)) {
		binder(node, tempCtx)
		return processAfterBinder()
	} else {
		return (async () => {
			await binder(node, tempCtx)
			return processAfterBinder()
		})()
	}
}

type ExtractBinder<B extends Binder<never>> = B extends Binder<infer N extends AstNode> ? N : never
export function any<Binders extends Binder<never>[]>(binders: Binders): Binders extends SyncBinder<never>[]
	? SyncBinder<ExtractBinder<Binders[number]>>
	: AsyncBinder<ExtractBinder<Binders[number]>>
export function any<N extends AstNode>(binders: Binder<N>[]): Binder<N> {
	if (binders.length === 0) {
		throw new Error('Expected at least one binder')
	}
	const attemptSorter = (a: AttemptResult, b: AttemptResult): number => a.errorAmount - b.errorAmount || a.totalErrorSpan - b.totalErrorSpan
	if (binders.every(SyncBinder.is)) {
		return SyncBinder.create((node, ctx) => {
			const attempts = binders
				.map(binder => attempt(binder, node, ctx))
				.sort(attemptSorter)
			attempts[0].updateNodeAndCtx()
		})
	} else {
		return AsyncBinder.create(async (node, ctx) => {
			const attempts = (await Promise.all(binders.map(binder => attempt(binder, node, ctx))))
				.sort(attemptSorter)
			attempts[0].updateNodeAndCtx()
		})
	}
}

/**
 * No operation.
 */
export const noop = SyncBinder.create(() => { })

/**
 * Use the shallowest children that have their own binder to validate.
 */
export const fallback = AsyncBinder.create(async (node, ctx) => {
	const promises: Promise<unknown>[] = []
	traversePreOrder(node,
		node => !ctx.meta.hasBinder(node.type),
		node => ctx.meta.hasBinder(node.type),
		node => {
			const binder = ctx.meta.getBinder(node.type)
			const result = binder(node as StateProxy<AstNode>, ctx)
			if (result instanceof Promise) {
				promises.push(result)
			}
		}
	)
	await Promise.all(promises)
})

export const dispatchSync = SyncBinder.create<AstNode>((node, ctx) => {
	for (const child of node.children ?? []) {
		if (ctx.meta.hasBinder(child.type)) {
			const binder = ctx.meta.getBinder(child.type) as SyncBinder<AstNode>
			binder(child, ctx)
		}
	}
})

export const resourceLocation = SyncBinder.create<ResourceLocationNode>((node, ctx) => {
	if (node.options.category) {
		const raw = ResourceLocationNode.toString(node, 'full')
		const sanitizedRaw = ResourceLocation.lengthen(node.options.namespacePathSep === '.'
			? raw.replace('.', ResourceLocation.NamespacePathSep)
			: raw
		)
		ctx.symbols
			.query(ctx.doc, node.isTag ? `tag/${node.options.category}` : node.options.category, sanitizedRaw)
			.enter({ usage: { type: node.options.usageType, node, accessType: node.options.accessType } })
	}
	const full = ResourceLocationNode.toString(node, 'full')
	if (node.options.pool) {
		if (!node.options.pool.includes(full)) {
			ctx.err.report(localize('expected', node.options.pool), node, ErrorSeverity.Error)
		}
		return
	}
})

export const symbol = SyncBinder.create<SymbolBaseNode>((node, ctx) => {
	if (node.value) {
		const path = node.options.parentPath ? [...node.options.parentPath, node.value] : [node.value]
		ctx.symbols
			.query(ctx.doc, node.options.category, ...path)
			.enter({ usage: { type: node.options.usageType, node: node, accessType: node.options.accessType } })
	}
})

export function registerBinders(meta: MetaRegistry) {
	meta.registerBinder<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerBinder<SymbolNode>('symbol', symbol)
}
