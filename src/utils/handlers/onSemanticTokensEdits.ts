import FunctionInfo from '../../types/FunctionInfo'
import { ProposedFeatures } from 'vscode-languageserver'

/** istanbul ignore next: mostly reply on the builder, not ourselves. */
export default function onSemanticTokensEdits({ info, previousResultId }: { info: FunctionInfo, previousResultId: string }) {
    info.builder = info.builder || new ProposedFeatures.SemanticTokensBuilder()

    info.builder.previousResult(previousResultId)

    for (let i = 0; i < info.lines.length; i++) {
        const { tokens } = info.lines[i]
        for (const token of tokens) {
            info.builder.push(...token.toArray(i))
        }
    }

    return info.builder.buildEdits()
}
