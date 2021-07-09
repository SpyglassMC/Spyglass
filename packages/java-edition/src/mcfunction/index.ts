import type * as core from '@spyglassmc/core'
import type { PartialRootTreeNode } from '@spyglassmc/mcfunction'
import * as mcf from '@spyglassmc/mcfunction'
import type { MajorVersion, VanillaCommands } from '../dependency'
import * as checker from './checker'
import * as colorizer from './colorizer'
import type { CommandNode, MinecraftBlockPredicateArgumentNode } from './node'
import * as parser from './parser'
import { Tree1_15, Tree1_16, Tree1_17 } from './tree'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * as parser from './parser'

const Trees: Record<MajorVersion, PartialRootTreeNode> = {
	1.15: Tree1_15,
	1.16: Tree1_16,
	1.17: Tree1_17,
}

/* istanbul ignore next */
export const initialize = (ctx: core.ProjectInitializerContext, commands: VanillaCommands, majorVersion: MajorVersion) => {
	const { meta } = ctx

	mcf.initialize(ctx)
	mcf.CommandTreeRegistry.instance.register(majorVersion, commands, Trees[majorVersion])

	meta.registerLanguage('mcfunction', {
		extensions: ['.mcfunction'],
		parser: mcf.parser.entry(majorVersion, parser.argument),
	})

	meta.registerParser<MinecraftBlockPredicateArgumentNode>('mcfunction:argument/minecraft:block_predicate', parser.blockPredicate)
	// TODO: 'mcfunction:argument/minecraft:component'
	// TODO: 'mcfunction:argument/minecraft:particle'
	// TODO: 'mcfunction:argument/minecraft:team'
	// TODO: 'mcfunction:argument/spyglassmc:tag'
	meta.registerParser<CommandNode>('mcfunction:command', mcf.parser.command(mcf.CommandTreeRegistry.instance.get(majorVersion), parser.argument))

	checker.register(meta)
	colorizer.register(meta)
}
