import type * as core from '@spyglassmc/core'
import * as json from './json'
import * as mcf from './mcfunction'
import * as nbt from '@spyglassmc/nbt'

export * as dependency from './dependency'
export * as json from './json'
export * as mcf from './mcfunction'

export async function initialize(service: core.Service) {
	json.initialize(service.meta)
	await mcf.initialize(service)
	nbt.initializeNbt()
}
