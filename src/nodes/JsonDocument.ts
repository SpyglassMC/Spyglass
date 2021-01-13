import { ASTNode, JSONDocument } from 'vscode-json-languageservice'
import { Diagnostic, Range } from 'vscode-languageserver/node'

export interface JsonDocument extends JSONDocument {
    root: ASTNode,
    syntaxErrors: Diagnostic[],
    comments: Range[]
}
