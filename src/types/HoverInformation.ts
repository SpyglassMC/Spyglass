import { MarkupContent } from 'vscode-languageserver'
import TextRange from './TextRange'

export default interface HoverInformation {
    contents: MarkupContent,
    range: TextRange
}
