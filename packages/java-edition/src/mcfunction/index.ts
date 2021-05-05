import type * as core from '@spyglassmc/core'
import * as mcfunction from '@spyglassmc/mcfunction'
import { getVanillaResources, registerSymbols } from '../dependency'
import * as colorizer from './colorizer'
import * as parser from './parser'

export * as colorizer from './colorizer'
export * as parser from './parser'

/* istanbul ignore next */
export async function initialize(meta: core.MetaRegistry, logger: core.Logger, symbols: core.SymbolUtil) {
	mcfunction.initializeMcfunction()

	const resources = await getVanillaResources('latest snapshot', logger)
	mcfunction.CommandTreeRegistry.instance.register('1.17', resources.commands)
	registerSymbols(resources, symbols)

	meta.registerLanguage('mcfunction', {
		extensions: ['.mcfunction'],
		parser: mcfunction.parser.entry('1.17', parser.argument),
	})

	colorizer.register(meta)
}
