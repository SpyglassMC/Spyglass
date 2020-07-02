import { ProposedFeatures } from 'vscode-languageserver'
import { FunctionInfo } from '../../types/DocumentInfo'

/** istanbul ignore next: mostly reply on the builder, not ourselves. */
export function onSemanticTokensEdits({ info, previousResultId }: { info: FunctionInfo, previousResultId: string }) {
    info.builder = info.builder || new ProposedFeatures.SemanticTokensBuilder()

    info.builder.previousResult(previousResultId)

    for (const { tokens } of info.nodes) {
        tokens
            .sort((a, b) => a.range.start - b.range.start)
            .forEach(t => info.builder!.push(...t.toArray(info.document)))
    }

    return info.builder.build/* Edits */()
}
