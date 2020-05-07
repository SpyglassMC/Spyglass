import { JSONDocument } from 'vscode-json-languageservice'
import { TextDocument } from 'vscode-languageserver'
import { GetFormattedString } from '../types/Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { NbtCompoundNode } from './NbtCompoundNode'

export type TextComponentType = NbtCompoundNode | string | TextComponentType[]

export class TextComponentNode extends ArgumentNode {
    [NodeType] = 'TextComponent'

    constructor(
        public raw: string,
        public document?: TextDocument,
        public jsonDocument?: JSONDocument
    ) {
        super()
    }

    [GetFormattedString](): string {
        return this.raw
    }
}
