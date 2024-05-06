import * as core from '@spyglassmc/core'
import type {
	CommandMacroNode,
	LiteralCommandChildNode,
	TrailingCommandChildNode,
} from '../node/index.js'

export function register(meta: core.MetaRegistry) {
	meta.registerColorizer<CommandMacroNode>(
		'mcfunction:command_macro',
		macro,
	)
	meta.registerColorizer<LiteralCommandChildNode>(
		'mcfunction:command_child/literal',
		core.colorizer.literal,
	)
	meta.registerColorizer<TrailingCommandChildNode>(
		'mcfunction:command_child/trailing',
		core.colorizer.error,
	)
}

export const macro: core.Colorizer<CommandMacroNode> = (node, ctx) => {
	return [core.ColorToken.create(node, 'string')]
}
