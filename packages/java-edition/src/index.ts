import type * as core from '@spyglassmc/core'
import * as json from './json'
import * as mcf from './mcfunction'
import * as nbt from '@spyglassmc/nbt'

export * as dependency from './dependency'
export * as json from './json'
export * as mcf from './mcfunction'

export async function initialize(meta: core.MetaRegistry, logger: core.Logger, symbols: core.SymbolUtil) {
	json.initialize(meta)
	await mcf.initialize(meta, logger, symbols)
	nbt.initializeNbt()
}
