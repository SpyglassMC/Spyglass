import { CodeAction, Diagnostic, TextDocumentEdit, WorkspaceEdit } from 'vscode-languageserver'
import { getJsonSchemas } from '../../../data/JsonSchema'
import { ArgumentNode, GetCodeActions } from '../../../nodes'
import { areOverlapped, CacheFile, Config, FetchConfigFunction, FunctionInfo, GetCommandTreeFunction, GetVanillaDataFunction, InfosOfUris, isFunctionInfo, ReadFileFunction, Uri } from '../../../types'
import { getDiagnosticMap, getOrCreateInfo } from '../common'

export async function fixFileCommandHandler({ uri, roots, infos, cacheFile, readFile, applyEdit, fetchConfig, getCommandTree, getVanillaData }: { uri: Uri, roots: Uri[], infos: InfosOfUris, cacheFile: CacheFile, readFile: ReadFileFunction, applyEdit: (edit: WorkspaceEdit) => void, fetchConfig: FetchConfigFunction, getCommandTree: GetCommandTreeFunction, getVanillaData: GetVanillaDataFunction }) {
    const start = new Date().getTime()
    const getTheConfig = async () => await fetchConfig(uri)
    const getTheCommandTree = async (config: Config) => await getCommandTree(config.env.cmdVersion)
    const getTheVanillaData = async (config: Config) => await getVanillaData(config.env.dataVersion, config.env.dataSource)
    const getTheJsonSchemas = async (config: Config) => await getJsonSchemas(config.env.jsonVersion)
    const getText = async () => readFile(uri.fsPath, 'utf8')
    const info = await getOrCreateInfo(uri, roots, infos, cacheFile, getTheConfig, getText, getTheCommandTree, getTheVanillaData, getTheJsonSchemas)
    /* istanbul ignore else */
    if (info) {
        if (isFunctionInfo(info)) {
            const edit = getMergedPreferredEdit(info, uri)
            if (edit) {
                applyEdit(edit)
            }
            // TODO: Finish command part when we have any quick fixes using it}
        } else {
            // TODO: JSON
        }
        console.log(`[Fix All] ${new Date().getTime() - start}ms in ‘${uri}’`)
    }
}

function getMergedPreferredEdit(info: FunctionInfo, uri: Uri) {
    const preferredActions = getActions(info, uri)
        .filter(v => v.isPreferred)

    return mergeActionEdit(info, preferredActions)
}

function getActions(info: FunctionInfo, uri: Uri) {
    const ans: CodeAction[] = []

    for (const node of info.nodes) {
        const diagnostics: Diagnostic[] = []
        node.errors?.forEach(err => diagnostics.push(err.toDiagnostic(info.document)))
        const diagnosticsMap = getDiagnosticMap(diagnostics)

        const selectedRange = { start: 0, end: Infinity }

        for (const { data } of node.args) {
            /* istanbul ignore else */
            if (data instanceof ArgumentNode) {
                ans.push(...data[GetCodeActions](uri.toString(), info, selectedRange, diagnosticsMap))
            }
        }
    }

    return ans
}

function mergeActionEdit(info: FunctionInfo, actions: CodeAction[]) {
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
                        const upStart = info.document.offsetAt(upEdit.range.start)
                        const upEnd = info.document.offsetAt(upEdit.range.end)
                        const overlappedExistingEdit = existingChange.edits.find(v => {
                            const existingStart = info.document.offsetAt(v.range.start)
                            const existingEnd = info.document.offsetAt(v.range.end)
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
