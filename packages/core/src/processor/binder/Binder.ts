import type { StateProxy } from '../../common/index.js'
import type { AstNode } from '../../node/index.js'
import type { BinderContext } from '../../service/index.js'

const Kind = Symbol('BinderKind')

export type Binder<N extends AstNode> = SyncBinder<N> | AsyncBinder<N>

interface SyncBinderInitializer<N extends AstNode> {
	(node: StateProxy<N>, ctx: BinderContext): void
}
export interface SyncBinder<N extends AstNode> extends SyncBinderInitializer<N> {
	[Kind]: 'sync'
}
export const SyncBinder = Object.freeze({
	create<N extends AstNode>(binder: SyncBinderInitializer<N>): SyncBinder<N> {
		return Object.assign(binder, { [Kind]: 'sync' as const })
	},
	is(binder: Binder<any>): binder is SyncBinder<any> {
		return binder[Kind] === 'sync'
	},
})

interface AsyncBinderInitializer<N extends AstNode> {
	(node: StateProxy<N>, ctx: BinderContext): Promise<void>
}
export interface AsyncBinder<N extends AstNode> extends AsyncBinderInitializer<N> {
	[Kind]: 'async'
}
export const AsyncBinder = Object.freeze({
	create<N extends AstNode>(binder: AsyncBinderInitializer<N>): AsyncBinder<N> {
		return Object.assign(binder, { [Kind]: 'async' as const })
	},
	is(binder: Binder<any>): binder is AsyncBinder<any> {
		return binder[Kind] === 'async'
	},
})
