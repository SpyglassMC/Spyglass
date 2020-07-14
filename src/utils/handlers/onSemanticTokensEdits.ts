import { ProposedFeatures } from 'vscode-languageserver'
import { getNodesFromInfo } from './common'
import { DocumentInfo } from '../../types/DocumentInfo'

/** istanbul ignore next: mostly reply on the builder, not ourselves. */
export function onSemanticTokensEdits({ info, previousResultId }: { info: DocumentInfo, previousResultId: string }) {
    info.builder = info.builder || new ProposedFeatures.SemanticTokensBuilder()

    info.builder.previousResult(previousResultId)

    for (const { tokens } of getNodesFromInfo(info)) {
        tokens
            .sort((a, b) => a.range.start - b.range.start)
            .forEach(t => info.builder!.push(...t.toArray(info.document)))
    }

    return info.builder.build/* Edits */()
}
