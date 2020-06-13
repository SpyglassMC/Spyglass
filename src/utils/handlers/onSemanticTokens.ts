import { ProposedFeatures } from 'vscode-languageserver'
import { FunctionInfo } from '../../types/FunctionInfo'

export function onSemanticTokens({ info }: { info: FunctionInfo }) {
    info.builder = info.builder || new ProposedFeatures.SemanticTokensBuilder()

    for (const {tokens} of info.nodes) {
        for (const token of tokens) {
            info.builder.push(...token.toArray(offset => info.content.positionAt(offset)))
        }
    }

    return info.builder.build()
}
