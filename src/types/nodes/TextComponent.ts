import { GetFormattedString } from '../Formattable'
import NbtCompoundNode from './map/NbtCompoundNode'
import { TextDocument } from 'vscode-languageserver'
import { JSONDocument } from 'vscode-json-languageservice'
import ArgumentNode, { NodeType } from './ArgumentNode'

export type TextComponentType = NbtCompoundNode | string | TextComponentType[]

export default class TextComponentNode extends ArgumentNode {
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
