import { MarkupContent } from 'vscode-languageserver/node'
import { TextRange } from './TextRange'

export interface HoverInformation {
    contents: MarkupContent,
    range: TextRange
}
