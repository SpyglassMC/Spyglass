import { LintConfig } from './Config'
import Formattable, { ToFormattedString } from './Formattable'
import NbtCompoundNode from './nodes/map/NbtCompoundNode'
import { TextDocument } from 'vscode-languageserver'
import { JSONDocument } from 'vscode-json-languageservice'
import TextComponentArgumentParser from '../parsers/TextComponentArgumentParser'

export type TextComponentType = NbtCompoundNode | string | TextComponentType[]

export default class TextComponent implements Formattable {
    constructor(
        public raw: string,
        public document?: TextDocument,
        public jsonDocument?: JSONDocument
    ) { }

    [ToFormattedString](lint: LintConfig): string {
        return this.raw
    }
}
