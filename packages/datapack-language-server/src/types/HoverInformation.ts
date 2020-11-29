import { MarkupContent } from 'vscode-languageserver'
import { TextRange } from './TextRange'

export interface HoverInformation {
    contents: MarkupContent,
    range: TextRange
}
