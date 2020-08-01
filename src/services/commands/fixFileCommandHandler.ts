import { CodeAction, Diagnostic, TextDocumentEdit } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { ArgumentNode, GetCodeActions } from '../../nodes'
import { areOverlapped, Config, constructContext, isMcfunctionDocument, McfunctionDocument, Uri } from '../../types'
import { getDiagnosticMap } from '../common'
import { DatapackLanguageService } from '../DatapackLanguageService'

export async function fixFileCommandHandler({ uri, service }: { uri: Uri, service: DatapackLanguageService }) {
    const start = new Date().getTime()
    const { doc, textDoc } = await service.getDocuments(uri)
    /* istanbul ignore else */
    if (doc && textDoc) {
        if (isMcfunctionDocument(doc)) {
            const config = await service.getConfig(uri)
            const edit = getMergedPreferredEdit(service, doc, textDoc, config, uri)
            if (edit) {
                service.applyEdit?.(edit)
            }
            // TODO: Finish command part when we have any quick fixes using it}
        } else {
            // TODO: JSON
        }
        console.info(`[Fix All] ${new Date().getTime() - start}ms in “${uri}”`)
    }
}

function getMergedPreferredEdit(service: DatapackLanguageService, doc: McfunctionDocument, textDoc: TextDocument, config: Config, uri: Uri) {
    const preferredActions = getActions(service, doc, textDoc, config, uri)
        .filter(v => v.isPreferred)

    return mergeActionEdit(doc, textDoc, preferredActions)
}

function getActions(service: DatapackLanguageService, doc: McfunctionDocument, textDoc: TextDocument, config: Config, uri: Uri) {
    const ans: CodeAction[] = []

    for (const node of doc.nodes) {
        const diagnostics: Diagnostic[] = []
        node.errors?.forEach(err => diagnostics.push(err.toDiagnostic(textDoc)))
        const diagnosticsMap = getDiagnosticMap(diagnostics)

        const selectedRange = { start: 0, end: Infinity }

        for (const { data } of node.args) {
            /* istanbul ignore else */
            if (data instanceof ArgumentNode) {
                const ctx = constructContext({
                    textDoc: textDoc,
                    config,
                    service
                })
                ans.push(...data[GetCodeActions](uri.toString(), ctx, selectedRange, diagnosticsMap))
            }
        }
    }

    return ans
}

function mergeActionEdit(doc: McfunctionDocument, textDoc: TextDocument, actions: CodeAction[]) {
    let ans: CodeAction | undefined

    if (actions.length > 0) {
        ans = actions[0]
        for (let i = 1; i < actions.length; i++) {
            const action = actions[i]
            ans.edit = ans.edit ?? {}
            ans.edit.documentChanges = ans.edit.documentChanges ?? []
            const upcommingChanges = action.edit?.documentChanges ?? []
            for (const upChange of upcommingChanges) {
                if (TextDocumentEdit.is(upChange)) {
                    let existingChange = ans.edit.documentChanges.find(
                        v => TextDocumentEdit.is(v) &&
                            v.textDocument.uri === upChange.textDocument.uri &&
                            v.textDocument.version === upChange.textDocument.version
                    ) as TextDocumentEdit | undefined
                    if (!existingChange) {
                        existingChange = { textDocument: upChange.textDocument, edits: [] }
                        ans.edit.documentChanges.push(existingChange)
                    }
                    for (const upEdit of upChange.edits) {
                        const upStart = textDoc.offsetAt(upEdit.range.start)
                        const upEnd = textDoc.offsetAt(upEdit.range.end)
                        const overlappedExistingEdit = existingChange.edits.find(v => {
                            const existingStart = textDoc.offsetAt(v.range.start)
                            const existingEnd = textDoc.offsetAt(v.range.end)
                            return areOverlapped(
                                { start: upStart, end: upEnd },
                                { start: existingStart, end: existingEnd }
                            )
                        })
                        if (!overlappedExistingEdit) {
                            existingChange.edits.push(upEdit)
                        }
                    }
                } else {
                    ans.edit.documentChanges.push(upChange)
                }
            }
        }
    }

    return ans?.edit
}
