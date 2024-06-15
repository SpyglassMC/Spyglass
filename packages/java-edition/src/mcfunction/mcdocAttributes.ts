import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as mcf from '@spyglassmc/mcfunction'
import { argument } from './parser/index.js'

const validator = mcdoc.runtime.attribute.validator

interface CmdArgConfig {
	parser: string
	properties?: Record<string, unknown>
}

const cmdArgValidator = validator.alternatives<CmdArgConfig>(
	validator.map(
		validator.string,
		(parser) => ({ parser }),
	),
	validator.map(
		validator.tree({
			parser: validator.string,
			min: validator.optional(validator.number),
			max: validator.optional(validator.number),
			type: validator.optional(validator.string),
			amount: validator.optional(validator.string),
			registry: validator.optional(validator.string),
			category: validator.optional(validator.string),
		}),
		(res) => ({
			parser: res.parser,
			properties: Object.fromEntries(
				Object.entries(res).filter(([k]) => k !== 'parser'),
			),
		}),
	),
)

export function registerMcdocAttributes(
	meta: core.MetaRegistry,
	rootTreeNode: mcf.RootTreeNode,
) {
	mcdoc.runtime.registerAttribute(
		meta,
		'command_argument',
		cmdArgValidator,
		{
			stringParser: (config, ctx) => {
				let argParser: core.Parser | undefined
				try {
					argParser = argument({
						type: 'argument',
						parser: core.ResourceLocation.lengthen(config.parser),
						properties: config.properties,
					})
					if (!argParser) {
						ctx.logger.warn(
							`[mcdoc command_argument] Unhandled parser ${config.parser} with properties ${
								JSON.stringify(config.properties)
							}`,
						)
						return undefined
					}
				} catch (e) {
					ctx.logger.warn(
						`[mcdoc command_argument] Failed to create parser ${config.parser} with properties ${
							JSON.stringify(config.properties)
						}`,
					)
					return undefined
				}
				return core.optional(argParser)
			},
		},
	)
	mcdoc.runtime.registerAttribute(
		meta,
		'command',
		validator.optional(
			validator.options('slash'),
		),
		{
			// TODO: validate slash
			// TODO: fix completer inside commands
			stringParser: (config, ctx) => {
				return mcf.command(rootTreeNode, argument)
			},
		},
	)
}
