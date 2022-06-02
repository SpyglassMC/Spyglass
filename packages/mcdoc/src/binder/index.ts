import type { MetaRegistry } from '@spyglassmc/core'
import { AsyncBinder, SyncBinder } from '@spyglassmc/core'
import type { ModuleNode } from '../node/index.js'

export const module_ = AsyncBinder.create<ModuleNode>(async (node, ctx) => {
	hoist(node, ctx)
})

export const hoist = SyncBinder.create<ModuleNode>((node, ctx) => {

})

export function registerMcdocBinders(meta: MetaRegistry) {
	meta.registerBinder<ModuleNode>('mcdoc:module', module_)
}
