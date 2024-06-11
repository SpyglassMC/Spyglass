import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as mcf from '@spyglassmc/mcfunction'
import type { McmetaCommands } from '../dependency/index.js'
import { ReleaseVersion } from '../dependency/index.js'
import * as checker from './checker/index.js'
import * as colorizer from './colorizer/index.js'
import * as completer from './completer/index.js'
import { inlayHintProvider } from './inlayHintProvider.js'
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

	const tree = core.merge(commands, getPatch(releaseVersion))
	if (ctx.isDebugging) {
		validatePatchedTree(tree, ctx.logger)
	}

	mcf.initialize(ctx)

	const supportsBackslashContinuation =
		ReleaseVersion.cmp(releaseVersion, '1.20.2') >= 0
	const supportsMacros = ReleaseVersion.cmp(releaseVersion, '1.20.2') >= 0

	meta.registerLanguage('mcfunction', {
		extensions: ['.mcfunction'],
		parser: mcf.entry(tree, parser.argument, {
			supportsBackslashContinuation,
			supportsMacros,
		}),
		completer: mcf.completer.entry(tree, completer.getMockNodes),
		triggerCharacters: [
			' ',
			'[',
			'=',
			'!',
			',',
			'{',
			':',
			'/',
			'.',
			'"',
			"'",
		],
	})

	meta.registerParser('mcfunction:block_predicate', parser.blockPredicate)
	meta.registerParser('mcfunction:particle', parser.particle)
	meta.registerParser('mcfunction:tag', parser.tag())
	meta.registerParser('mcfunction:team', parser.team())
	meta.registerParser<mcf.CommandNode>(
		'mcfunction:command',
		mcf.command(
			tree,
			parser.argument,
		),
	)

	mcdoc.runtime.registerAttribute(
		meta,
		'command_argument',
		mcdoc.runtime.attribute.validator.map(
			mcdoc.runtime.attribute.validator.string,
			core.ResourceLocation.lengthen,
		),
		{
			attachString: (config, ctx) => {
				const argParser = parser.argument({
					type: 'argument',
					parser: config,
				})
				return (node) => {
					const src = new core.Source(node.value, node.valueMap)
					if (!argParser) {
						ctx.err.report(
							localize(
								'mcfunction.parser.unknown-parser',
								localeQuote(config),
							),
							core.Range.create(src.cursor, src.skipRemaining()),
							core.ErrorSeverity.Hint,
						)
						return
					}
					const child = argParser(src, ctx)
					if (child === core.Failure) {
						ctx.err.report(
							localize('mcfunction.parser.eoc-unexpected'),
							node,
						)
						return
					}
					if (src.canRead()) {
						ctx.err.report(
							localize('mcdoc.runtime.checker.trailing'),
							core.Range.create(src.cursor, src.skipRemaining()),
						)
					}
					node.children = [child]
				}
			},
		},
	)
	mcdoc.runtime.registerAttribute(
		meta,
		'command',
		mcdoc.runtime.attribute.validator.optional(
			mcdoc.runtime.attribute.validator.options('slash'),
		),
		{
			attachString: (config, ctx) => {
				return (node) => {
					// TODO: validate slash
					// TODO: fix completer and checker inside commands
					const src = new core.Source(node.value, node.valueMap)
					const command = mcf.command(tree, parser.argument)(src, ctx)
					if (src.canRead()) {
						ctx.err.report(
							localize('mcdoc.runtime.checker.trailing'),
							core.Range.create(src.cursor, src.skipRemaining()),
						)
					}
					node.children = [command]
				}
			},
		},
	)

	checker.register(meta)
	colorizer.register(meta)
	completer.register(meta)

	meta.registerInlayHintProvider(inlayHintProvider)
	meta.registerSignatureHelpProvider(signatureHelpProvider(tree))
}
