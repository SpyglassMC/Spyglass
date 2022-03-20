import type * as core from '@spyglassmc/core'
import type { PartialRootTreeNode } from '@spyglassmc/mcfunction'
import * as mcf from '@spyglassmc/mcfunction'
import type { MajorVersion, McmetaCommands } from '../dependency'
import * as checker from './checker'
import * as colorizer from './colorizer'
import * as completer from './completer'
import { inlayHintProvider } from './inlayHintProvider'
import * as parser from './parser'
import { signatureHelpProvider } from './signatureHelpProvider'
import { Tree1_15, Tree1_16, Tree1_17, Tree1_18, Tree1_19 } from './tree'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * as completer from './completer'
export * as parser from './parser'

// DOCS: Update here when a new major version of Minecraft is released.
const Trees = new Map<MajorVersion, PartialRootTreeNode>([
	['1.15', Tree1_15],
	['1.16', Tree1_16],
	['1.17', Tree1_17],
	['1.18', Tree1_18],
	['1.19', Tree1_19],
])
const LatestTree = (() => {
	const values = [...Trees.values()]
	return values[values.length - 1]
})()

/* istanbul ignore next */
export const initialize = (ctx: core.ProjectInitializerContext, commands: McmetaCommands, majorVersion: MajorVersion) => {
	const { meta } = ctx

	mcf.initialize(ctx)
	mcf.CommandTreeRegistry.instance.register(majorVersion, commands, Trees.get(majorVersion) ?? LatestTree)

	meta.registerLanguage('mcfunction', {
		extensions: ['.mcfunction'],
		parser: mcf.entry(majorVersion, parser.argument),
		completer: mcf.completer.entry(majorVersion, completer.getMockNodes),
		triggerCharacters: [' ', '[', '=', '!', ',', '{', ':', '/', '.', '"', "'"],
	})

	meta.registerParser('mcfunction:block_predicate', parser.blockPredicate)
	meta.registerParser('mcfunction:component', parser.component)
	// TODO: 'mcfunction:particle'
	// TODO: Uncomment in `SpecialStrings` in `nbtdocUtil.ts` as well.
	meta.registerParser('mcfunction:tag', parser.tag())
	meta.registerParser('mcfunction:team', parser.team())
	meta.registerParser<mcf.CommandNode>('mcfunction:command', mcf.command(mcf.CommandTreeRegistry.instance.get(majorVersion), parser.argument))

	checker.register(meta)
	colorizer.register(meta)
	completer.register(meta)

	meta.registerInlayHintProvider(inlayHintProvider)
	meta.registerSignatureHelpProvider(signatureHelpProvider(majorVersion))
}
