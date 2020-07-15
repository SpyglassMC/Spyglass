import { CodeAction, CodeActionKind, Command, Diagnostic, Range } from 'vscode-languageserver'
import { locale } from '../locales'
import { getSelectedNode } from '../nodes'
import { ArgumentNode, GetCodeActions, NodeRange } from '../nodes/ArgumentNode'
import { CacheFile, FunctionInfo, Uri } from '../types'
import { areOverlapped } from '../types/TextRange'
import { getDiagnosticMap } from './common'

export function onCodeAction({ uri, info, diagnostics, range }: { uri: Uri, info: FunctionInfo, diagnostics: Diagnostic[], range: Range, cacheFile: CacheFile }): CodeAction[] | null {
    try {
        const ans: CodeAction[] = []

        const diagnosticMap = getDiagnosticMap(diagnostics)

        const start = info.document.offsetAt(range.start)
        const end = info.document.offsetAt(range.end)
        const selectedRange = { start, end }

        const { index: startNodeIndex } = getSelectedNode(info.nodes, start)
        const { index: endNodeIndex } = getSelectedNode(info.nodes, end)

        for (let i = startNodeIndex; i <= endNodeIndex; i++) {
            const node = info.nodes[i]
            /* istanbul ignore else */
            if (node) {
                for (const { data } of node.args) {
                    /* istanbul ignore else */
                    if (data instanceof ArgumentNode) {
                        const nodeRange = data[NodeRange]
                        if (areOverlapped(selectedRange, nodeRange)) {
                            ans.push(...data[GetCodeActions](uri.toString(), info, selectedRange, diagnosticMap))
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
