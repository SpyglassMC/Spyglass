import { CompletionItem } from 'vscode-languageserver'
import { TextRange } from './TextRange'

export interface ParserSuggestion extends CompletionItem, TextRange {
	/**
     * The start offset of the CompletionItem.
     */
	start: number,
	/**
     * The end offset of the CompletionItem in replacing cases.
     */
	end: number
}
