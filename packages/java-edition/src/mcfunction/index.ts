import type * as core from '@spyglassmc/core'
import * as mcfunction from '@spyglassmc/mcfunction'
import { getVanillaResources, registerSymbols } from '../dependency'
import * as checker from './checker'
import * as colorizer from './colorizer'
import type { CommandNode, MinecraftBlockPredicateArgumentNode } from './node'
import * as parser from './parser'
import { Tree1_17 } from './tree'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * as parser from './parser'

/* istanbul ignore next */
export async function initialize(service: core.Service) {
	const { meta, logger, symbols } = service
	mcfunction.initializeMcfunction()

	const resources = await getVanillaResources('latest snapshot', logger)
	mcfunction.CommandTreeRegistry.instance.register('1.17', resources.commands, Tree1_17)
	registerSymbols(resources, symbols)

	// TODO: Move out.
	service.compressedRoots = resources.compressedRoots

	meta.registerLanguage('mcfunction', {
		extensions: ['.mcfunction'],
		parser: mcfunction.parser.entry('1.17', parser.argument),
	})

	meta.registerParser<MinecraftBlockPredicateArgumentNode>('mcfunction:argument/minecraft:block_predicate', parser.blockPredicate)
	// TODO: 'mcfunction:argument/minecraft:component'
	// TODO: 'mcfunction:argument/minecraft:particle'
	// TODO: 'mcfunction:argument/minecraft:team'
	// TODO: 'mcfunction:argument/spyglassmc:tag'
	meta.registerParser<CommandNode>('mcfunction:command', mcfunction.parser.command(mcfunction.CommandTreeRegistry.instance.get('1.17'), parser.argument))

	checker.register(meta)
	colorizer.register(meta)
}
