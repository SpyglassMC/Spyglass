import { TextDocument } from 'vscode-languageserver-textdocument'
import { AstNode } from '../node'

export type Binder<N extends AstNode> = (node: N, doc: TextDocument /* , symbols: SymbolTableHelper */) => void
