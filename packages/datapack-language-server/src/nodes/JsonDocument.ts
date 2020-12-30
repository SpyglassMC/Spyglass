import { ASTNode } from 'vscode-json-languageservice'
import { Diagnostic, Range } from 'vscode-languageserver'

export interface JsonDocument {
	root: ASTNode,
	syntaxErrors: Diagnostic[],
	comments: Range[]
}
