import type * as core from '@spyglassmc/core'
import type { PartialRootTreeNode } from '@spyglassmc/mcfunction'
import * as mcf from '@spyglassmc/mcfunction'
import type { MajorVersion, VanillaCommands } from '../dependency'
import * as checker from './checker'
import * as colorizer from './colorizer'
import { inlayHintProvider } from './inlayHintProvider'
import * as parser from './parser'
import { signatureHelpProvider } from './signatureHelpProvider'
import { Tree1_15, Tree1_16, Tree1_17, Tree1_18 } from './tree'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * as parser from './parser'

// DOCS: Update here when a new major version of Minecraft is released.
const Trees: Record<MajorVersion, PartialRootTreeNode> = {
	1.15: Tree1_15,
	1.16: Tree1_16,
	1.17: Tree1_17,
	1.18: Tree1_18,
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

	meta.registerParser('mcfunction:block_predicate', parser.blockPredicate)
	meta.registerParser('mcfunction:component', parser.component)
	// TODO: 'mcfunction:argument/minecraft:particle'
	// TODO: Uncomment in `SpecialStrings` in `nbtdocUtil.ts` as well.
	meta.registerParser('mcfunction:tag', parser.tag())
	meta.registerParser('mcfunction:team', parser.team())
	meta.registerParser<mcf.CommandNode>('mcfunction:command', mcf.parser.command(mcf.CommandTreeRegistry.instance.get(majorVersion), parser.argument))

	checker.register(meta)
	colorizer.register(meta)

	meta.registerInlayHintProvider(inlayHintProvider)
	meta.registerSignatureHelpProvider(signatureHelpProvider(majorVersion))
}
