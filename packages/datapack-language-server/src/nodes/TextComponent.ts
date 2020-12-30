import { TextDocument } from 'vscode-languageserver-textdocument'
import { GetFormattedString } from '../types/Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { JsonDocument } from './JsonDocument'
import { NbtCompoundNode } from './NbtCompoundNode'

export type TextComponentType = NbtCompoundNode | string | TextComponentType[]

export class TextComponentNode extends ArgumentNode {
	[NodeType] = 'TextComponent'

	constructor(
		public raw: string,
		public document?: TextDocument,
		public jsonDocument?: JsonDocument
	) {
		super()
	}

	[GetFormattedString](): string {
		return this.raw
	}
}
