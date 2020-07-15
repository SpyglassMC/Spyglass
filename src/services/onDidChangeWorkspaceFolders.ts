import { WorkspaceFolder } from 'vscode-languageserver'
import { Uri } from '../types/handlers'

export function onDidChangeWorkspaceFolders({ folders, workspaceRootUriStrings, urisOfIds }: { folders: WorkspaceFolder[] | null, workspaceRootUriStrings: string[], urisOfIds: Map<string, Uri | null> }) {
    workspaceRootUriStrings.splice(0)
    urisOfIds.clear()

    if (folders) {
        for (let i = folders.length - 1; i >= 0; i--) {
            const { uri: uriString } = folders[i]
            workspaceRootUriStrings.push(uriString)
        }
    }
}
