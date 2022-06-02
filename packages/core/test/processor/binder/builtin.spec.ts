import type { AsyncBinder, BinderContext, BooleanNode, StateProxy, StringNode, SyncBinder } from '@spyglassmc/core'
import { binder } from '@spyglassmc/core'
import { assertType, typing } from '../../utils.js'

declare const stringAsyncBinder: AsyncBinder<StringNode>
declare const stringSyncBinder: SyncBinder<StringNode>
declare const booleanAsyncBinder: AsyncBinder<BooleanNode>
declare const booleanSyncBinder: SyncBinder<BooleanNode>
declare const booleanNode: StateProxy<BooleanNode>
declare const ctx: BinderContext

type AttemptResult = binder.AttemptResult

typing('binder builtin.ts', () => {
	typing('attempt', () => {
		const { attempt } = binder
		assertType<AttemptResult>(attempt(booleanSyncBinder, booleanNode, ctx))
		assertType<Promise<AttemptResult>>(attempt(booleanAsyncBinder, booleanNode, ctx))
	})

	typing('any', () => {
		const { any } = binder
		assertType<SyncBinder<BooleanNode>>(any([booleanSyncBinder]))
		assertType<SyncBinder<BooleanNode>>(any([booleanSyncBinder, booleanSyncBinder]))
		assertType<SyncBinder<BooleanNode | StringNode>>(any([booleanSyncBinder, stringSyncBinder]))
		assertType<AsyncBinder<BooleanNode>>(any([booleanAsyncBinder]))
		assertType<AsyncBinder<BooleanNode>>(any([booleanAsyncBinder, booleanAsyncBinder]))
		assertType<AsyncBinder<BooleanNode>>(any([booleanAsyncBinder, booleanSyncBinder]))
		assertType<AsyncBinder<BooleanNode | StringNode>>(any([booleanAsyncBinder, stringAsyncBinder]))
		assertType<AsyncBinder<BooleanNode | StringNode>>(any([booleanAsyncBinder, stringSyncBinder]))
	})
})
