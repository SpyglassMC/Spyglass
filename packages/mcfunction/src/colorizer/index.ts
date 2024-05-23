import * as core from '@spyglassmc/core'
import type {
	LiteralCommandChildNode,
	MacroGapNode,
	MacroKeyNode,
	MacroSignNode,
	MacroVariableNode,
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
	meta.registerColorizer<MacroGapNode>(
		'mcfunction:macro/gap',
		macroChild,
	)
	meta.registerColorizer<MacroVariableNode>(
		'mcfunction:macro/variable',
		macroChild,
	)
	meta.registerColorizer<MacroSignNode>(
		'mcfunction:macro/sign',
		macroChild,
	)
	meta.registerColorizer<MacroKeyNode>(
		'mcfunction:macro/key',
		macroKey,
	)
}
