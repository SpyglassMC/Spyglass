import * as core from '@spyglassmc/core'
import type {
	LiteralCommandChildNode,
	MacroChildNode,
	MacroKeyNode,
	TrailingCommandChildNode,
} from '../node/index.js'
import { macroChild, macroKey } from './macro.js'

export function register(meta: core.MetaRegistry) {
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
		macroChild,
	)
	meta.registerColorizer<MacroKeyNode>(
		'mcfunction:macro_key',
		macroKey,
	)
}
