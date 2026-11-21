import * as core from '@spyglassmc/core'
import * as mcf from '@spyglassmc/mcfunction'
import { registerCustomResources } from '../binder/index.js'
import type { McmetaCommands } from '../dependency/index.js'
import { ReleaseVersion } from '../dependency/index.js'
import * as checker from './checker/index.js'
import * as colorizer from './colorizer/index.js'
import * as completer from './completer/index.js'
import { inlayHintProvider } from './inlayHintProvider.js'
import { registerMcdocAttributes } from './mcdocAttributes.js'
import * as parser from './parser/index.js'
import { signatureHelpProvider } from './signatureHelpProvider.js'
import { getPatch } from './tree/patch.js'
import { validatePatchedTree } from './tree/patchValidator.js'

export * as checker from './checker/index.js'
export * as colorizer from './colorizer/index.js'
export * as completer from './completer/index.js'
export * as parser from './parser/index.js'

/* istanbul ignore next */
export const initialize = (
	ctx: core.ProjectInitializerContext,
	commands: McmetaCommands,
	releaseVersion: ReleaseVersion,
) => {
	const { meta } = ctx

	registerCustomResources(ctx.config)

	const tree = core.merge(commands, getPatch(releaseVersion))
	if (ctx.isDebugging) {
		validatePatchedTree(tree, ctx.logger)
	}

	mcf.initialize(ctx)

	const mcfunctionOptions: mcf.McfunctionOptions = {
		lineContinuation: ReleaseVersion.cmp(releaseVersion, '1.20.2') >= 0,
		macros: ReleaseVersion.cmp(releaseVersion, '1.20.2') >= 0,
		commandOptions: ReleaseVersion.cmp(releaseVersion, '1.20.5') >= 0
			? { maxLength: 2_000_000 }
			: {},
	}

	meta.registerLanguage('mcfunction', {
		extensions: ['.mcfunction'],
		parser: mcf.entry(tree, parser.argument, mcfunctionOptions),
		completer: mcf.completer.entry(tree, completer.getMockNodes),
		triggerCharacters: [' ', '[', '=', '!', ',', '{', ':', '/', '.', '"', "'"],
	})

	meta.registerParser('mcfunction:block_predicate', parser.blockPredicate)
	meta.registerParser('mcfunction:particle', parser.particle)
	meta.registerParser('mcfunction:tag', parser.tag())
	meta.registerParser('mcfunction:team', parser.team())
	meta.registerParser<mcf.CommandNode>('mcfunction:command', mcf.command(tree, parser.argument))

	registerMcdocAttributes(meta, tree)

	checker.register(meta)
	colorizer.register(meta)
	completer.register(meta)

	meta.registerInlayHintProvider(inlayHintProvider)
	meta.registerSignatureHelpProvider(signatureHelpProvider(tree))
}
