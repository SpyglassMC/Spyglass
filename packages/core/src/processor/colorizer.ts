import { TextDocument } from 'vscode-languageserver-textdocument'
import { AstNode } from '../node'
import { Range, RangeLike } from '../type'

export type Colorizer<N = AstNode> = (node: Readonly<N>, doc: TextDocument /* , symbols: SymbolTableHelper */) => readonly ColorToken[]

export namespace colorizer {
	export const fallback: Colorizer<unknown> = () => []
}

export interface ColorToken {
	range: Range,
	type: ColorTokenType,
	modifiers?: ColorTokenModifier[]
}
export namespace ColorToken {
	export function create(range: RangeLike, type: ColorTokenType, modifiers?: ColorTokenModifier[]): ColorToken {
		const ans: ColorToken = {
			range: Range.get(range),
			type, modifiers,
		}
		return ans
	}
}

// Built-in LSP semantic tokens: https://microsoft.github.io/language-server-protocol/specifications/specification-3-17/#textDocument_semanticTokens

export const ColorTokenTypes = [
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
] as const
export type ColorTokenType = typeof ColorTokenTypes[number]

export const ColorTokenModifiers = [
	'declaration',
	'defaultLibrary',
	'definition',
	'deprecated',
	'documentation',
	'modification',
	'readonly',
	// Below are custom modifiers.
] as const
export type ColorTokenModifier = typeof ColorTokenModifiers[number]
