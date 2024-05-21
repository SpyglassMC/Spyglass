import * as core from '@spyglassmc/core'
import type {
	MacroChildNode,
	MacroNode,
	CommandMacroNode,
	LiteralCommandChildNode,
	TrailingCommandChildNode,
} from '../node/index.js'

export function register(meta: core.MetaRegistry) {
	meta.registerColorizer<CommandMacroNode>(
		'mcfunction:command_macro',
		commandMacro,
	)
	meta.registerColorizer<LiteralCommandChildNode>(
		'mcfunction:command_child/literal',
		core.colorizer.literal,
	)
	meta.registerColorizer<TrailingCommandChildNode>(
		'mcfunction:command_child/trailing',
		core.colorizer.error,
	)
	meta.registerColorizer<MacroChildNode>(
		'mcfunction:macro_child',
		macroChild
	)
}

export const commandMacro: core.Colorizer<CommandMacroNode> = (node, ctx) => {
	return [core.ColorToken.create(node, 'string')]
}

export const macroChild: core.Colorizer<MacroChildNode> = (node) => {
	return [core.ColorToken.create(node, node.options.colorTokenType ?? 'string')]
}
