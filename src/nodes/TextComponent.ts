import { TextDocument } from 'vscode-languageserver'
import { GetFormattedString } from '../types/Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { NbtCompoundNode } from './NbtCompoundNode'
import { JsonDocument } from './JsonDocument'

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
