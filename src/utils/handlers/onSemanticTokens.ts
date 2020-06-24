import { ProposedFeatures } from 'vscode-languageserver'
import { FunctionInfo } from '../../types/FunctionInfo'

export function onSemanticTokens({ info }: { info: FunctionInfo }) {
    info.builder = info.builder || new ProposedFeatures.SemanticTokensBuilder()

    for (const { tokens } of info.nodes) {
        tokens
            .sort((a, b) => a.range.start - b.range.start)
            .forEach(t => info.builder!.push(...t.toArray(info.document)))
    }

    return info.builder.build()
}
