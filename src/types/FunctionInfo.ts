import { ProposedFeatures } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Config } from './Config'
import { LineNode } from './LineNode'

export interface FunctionInfo {
    builder?: ProposedFeatures.SemanticTokensBuilder,
    config: Config,
    document: TextDocument,
    nodes: LineNode[]
}
