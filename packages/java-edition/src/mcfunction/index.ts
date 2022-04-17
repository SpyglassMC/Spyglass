import type * as core from '@spyglassmc/core'
import * as mcf from '@spyglassmc/mcfunction'
import type { McmetaCommands, ReleaseVersion } from '../dependency'
import * as checker from './checker'
import * as colorizer from './colorizer'
import * as completer from './completer'
import { inlayHintProvider } from './inlayHintProvider'
import * as parser from './parser'
import { signatureHelpProvider } from './signatureHelpProvider'
import { getPatch } from './tree/patch'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * as completer from './completer'
export * as parser from './parser'

/* istanbul ignore next */
export const initialize = (ctx: core.ProjectInitializerContext, commands: McmetaCommands, releaseVersion: ReleaseVersion) => {
	const { meta } = ctx

	mcf.initialize(ctx)
	mcf.CommandTreeRegistry.instance.register(releaseVersion, commands, getPatch(releaseVersion))

	meta.registerLanguage('mcfunction', {
		extensions: ['.mcfunction'],
		parser: mcf.entry(releaseVersion, parser.argument),
		completer: mcf.completer.entry(releaseVersion, completer.getMockNodes),
		triggerCharacters: [' ', '[', '=', '!', ',', '{', ':', '/', '.', '"', "'"],
	})

	meta.registerParser('mcfunction:block_predicate', parser.blockPredicate)
	meta.registerParser('mcfunction:component', parser.component)
	meta.registerParser('mcfunction:particle', parser.particle)
	meta.registerParser('mcfunction:tag', parser.tag())
	meta.registerParser('mcfunction:team', parser.team())
	meta.registerParser<mcf.CommandNode>('mcfunction:command', mcf.command(mcf.CommandTreeRegistry.instance.get(releaseVersion), parser.argument))

	checker.register(meta)
	colorizer.register(meta)
	completer.register(meta)

	meta.registerInlayHintProvider(inlayHintProvider)
	meta.registerSignatureHelpProvider(signatureHelpProvider(releaseVersion))
}
