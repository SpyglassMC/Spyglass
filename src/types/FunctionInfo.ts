import { ProposedFeatures } from 'vscode-languageserver'
import { Config } from './Config'
import { Line } from './Line'

export interface FunctionInfo {
    builder?: ProposedFeatures.SemanticTokensBuilder,
    config: Config,
    lineBreak: '\n' | '\r\n',
    lines: Line[],
    strings: string[],
    version: number | null
}
