import { CodeAction, CodeActionKind, Command, Diagnostic, Range } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { DatapackLanguageService } from '..'
import { locale } from '../locales'
import { getSelectedNode } from '../nodes'
import { ArgumentNode, GetCodeActions, NodeRange } from '../nodes/ArgumentNode'
import { CacheFile, McfunctionDocument, Uri } from '../types'
import { areOverlapped } from '../types/TextRange'
import { getDiagnosticMap } from './common'

export async function onCodeAction({ uri, doc, diagnostics, textDoc, range, service }: { uri: Uri, doc: McfunctionDocument, textDoc: TextDocument, diagnostics: Diagnostic[], range: Range, cacheFile: CacheFile, service: DatapackLanguageService }): Promise<CodeAction[] | null> {
    try {
        const ans: CodeAction[] = []

        const diagnosticMap = getDiagnosticMap(diagnostics)

        const start = textDoc.offsetAt(range.start)
        const end = textDoc.offsetAt(range.end)
        const selectedRange = { start, end }

        const { index: startNodeIndex } = getSelectedNode(doc.nodes, start)
        const { index: endNodeIndex } = getSelectedNode(doc.nodes, end)

        for (let i = startNodeIndex; i <= endNodeIndex; i++) {
            const node = doc.nodes[i]
            /* istanbul ignore else */
            if (node) {
                for (const { data } of node.data) {
                    /* istanbul ignore else */
                    if (data instanceof ArgumentNode) {
                        const nodeRange = data[NodeRange]
                        if (areOverlapped(selectedRange, nodeRange)) {
                            const ctx = await service.getParsingContext({ textDoc, uri })
                            ans.push(...data[GetCodeActions](uri.toString(), ctx, selectedRange, diagnosticMap))
                        }
                    }
                }
            }
        }


        if (ans.length > 0) {
            addFixAllActions(ans, CodeActionKind.QuickFix, { uri })
        }
        addFixAllActions(ans, CodeActionKind.SourceFixAll, { uri })

        return ans
    } catch (e) {
        console.error('[onCodeAction]', e)
    }
    return null
}

function addFixAllActions(ans: CodeAction[], kind: CodeActionKind, args: { uri: Uri }) {
    ans.push(
        CodeAction.create(
            locale('code-action.fix-file'),
            Command.create(locale('code-action.fix-file'), 'datapack.fixFile', [args.uri.toString()]),
            kind
        ),
        CodeAction.create(
            locale('code-action.fix-workspace'),
            Command.create(locale('code-action.fix-workspace'), 'datapack.fixWorkspace'),
            kind
        )
    )
}
