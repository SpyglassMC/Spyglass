/* istanbul ignore file */

import type { AstNode } from '../node'
import type { ColorizerContext } from '../service'
import type { RangeLike } from '../source'
import { Range } from '../source'

export type Colorizer<N = AstNode> = (node: N, ctx: ColorizerContext) => readonly ColorToken[]

export const FallbackColorizer: Colorizer<any> = () => []

export interface ColorToken {
	range: Range,
	type: ColorTokenType,
	modifiers?: ColorTokenModifier[]
}
export namespace ColorToken {
	export function create(range: RangeLike, type: ColorTokenType, modifiers?: ColorTokenModifier[]): ColorToken {
		return {
			range: Range.get(range),
			type,
			modifiers,
		}
	}
}

// Built-in LSP semantic tokens: https://microsoft.github.io/language-server-protocol/specifications/specification-3-17/#textDocument_semanticTokens

export const ColorTokenTypes = Object.freeze([
	'comment',
	'enum',
	'enumMember',
	'function',
	'keyword',
	'modifier',
	'number',
	'operator',
	'property',
	'string',
	'struct',
	'type',
	'type',
	// Below are custom types.
	'resourceLocation',
] as const)
export type ColorTokenType = typeof ColorTokenTypes[number]

export const ColorTokenModifiers = Object.freeze([
	'declaration',
	'defaultLibrary',
	'definition',
	'deprecated',
	'documentation',
	'modification',
	'readonly',
	// Below are custom modifiers.
] as const)
export type ColorTokenModifier = typeof ColorTokenModifiers[number]
