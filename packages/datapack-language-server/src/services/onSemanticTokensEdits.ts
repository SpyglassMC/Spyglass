import { ProposedFeatures } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { DatapackDocument } from '../types/DatapackDocument'

/** istanbul ignore next: mostly reply on the builder, not ourselves. */
export function onSemanticTokensEdits({ doc, previousResultId, textDoc, builder }: { doc: DatapackDocument, previousResultId: string, builder: ProposedFeatures.SemanticTokensBuilder, textDoc: TextDocument }) {
	builder.previousResult(previousResultId)

	for (const { tokens } of doc.nodes) {
		tokens
			.sort((a, b) => a.range.start - b.range.start)
			.forEach(t => builder!.push(...t.toArray(textDoc)))
	}

	return builder.build/* Edits */()
}
