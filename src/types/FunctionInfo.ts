import Line from './Line'
import Config from './Config'
import { ProposedFeatures } from 'vscode-languageserver'

export default interface FunctionInfo {
    builder?: ProposedFeatures.SemanticTokensBuilder,
    config: Config,
    lineBreak: '\n' | '\r\n',
    lines: Line[],
    strings: string[],
    version: number | null
}
