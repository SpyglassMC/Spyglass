import { SemanticTokensBuilder } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { DatapackDocument } from '../types/DatapackDocument'

export function onSemanticTokens({ doc, textDoc, builder }: { doc: DatapackDocument, builder: SemanticTokensBuilder, textDoc: TextDocument }) {
    for (const { tokens } of doc.nodes) {
        tokens
            .sort((a, b) => a.range.start - b.range.start)
            .forEach(t => builder!.push(...t.toArray(textDoc)))
    }

    return builder.build()
}
