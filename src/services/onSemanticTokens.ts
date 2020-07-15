import { ProposedFeatures } from 'vscode-languageserver'
import { getNodesFromInfo } from './common'
import { DocumentInfo } from '../types/DocumentInfo'

export function onSemanticTokens({ info }: { info: DocumentInfo }) {
    info.builder = info.builder || new ProposedFeatures.SemanticTokensBuilder()

    for (const { tokens } of getNodesFromInfo(info)) {
        tokens
            .sort((a, b) => a.range.start - b.range.start)
            .forEach(t => info.builder!.push(...t.toArray(info.document)))
    }

    return info.builder.build()
}
