import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as mcf from '@spyglassmc/mcfunction'
import { argument } from './parser/index.js'

export function registerMcdocAttributes(
	meta: core.MetaRegistry,
	rootTreeNode: mcf.RootTreeNode,
) {
	mcdoc.runtime.registerAttribute(
		meta,
		'command_argument',
		mcdoc.runtime.attribute.validator.map(
			mcdoc.runtime.attribute.validator.string,
			core.ResourceLocation.lengthen,
		),
		{
			attachString: (config, ctx) => {
				let argParser
				try {
					argParser = argument({
						type: 'argument',
						parser: config,
					})
				} catch (e) {
					ctx.logger.warn(
						`[mcdoc command_argument] Failed to create parser ${config}`,
					)
					return undefined
				}
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
					const command = mcf.command(rootTreeNode, argument)(src, ctx)
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
}
