import { CompletionItem } from 'vscode-languageserver'

interface ParserSuggestion extends CompletionItem {
    /**
     * The start offset of the CompletionItem.
     */
    start: number,
    /**
     * The end offset of the CompletionItem in replacing cases.
     */
    replaceEnd: number,
    /**
     * The end offset of the CompletionItem in inserting cases.
     */
    insertEnd: number
}
