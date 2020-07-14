import { ProposedFeatures } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { JsonNode } from '../nodes/JsonNode'
import { Config } from './Config'
import { LineNode } from './LineNode'

export interface FunctionInfo {
    builder?: ProposedFeatures.SemanticTokensBuilder,
    config: Config,
    document: TextDocument,
    nodes: LineNode[]
}

export interface JsonInfo {
    builder?: ProposedFeatures.SemanticTokensBuilder,
    config: Config,
    document: TextDocument,
    node: JsonNode
}

export type DocumentInfo = FunctionInfo | JsonInfo

export function isFunctionInfo(info: DocumentInfo): info is FunctionInfo {
    return !!(info as FunctionInfo).nodes
}

export function isJsonInfo(info: DocumentInfo): info is JsonInfo {
    return !!(info as JsonInfo).node
}
