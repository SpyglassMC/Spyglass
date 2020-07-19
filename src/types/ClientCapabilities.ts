import { ClientCapabilities as LspClientCapabilities } from 'vscode-languageserver'

export interface ClientCapabilities {
    dynamicRegistration: {
        competion: boolean,
        didChangeConfiguration: boolean,
        documentFormatting: boolean,
        documentHighlight: boolean,
        foldingRange: boolean,
        selectionRange: boolean,
        signatureHelp: boolean
    },
    applyEdit: boolean,
    completionContext: boolean,
    configuration: boolean,
    diagnostics: boolean,
    workspaceFolders: boolean
}

export function getClientCapabilities(lspCapabilities: LspClientCapabilities = {}) {
    const ans: ClientCapabilities = {
        dynamicRegistration: {
            competion: !!lspCapabilities.textDocument?.completion?.dynamicRegistration,
            didChangeConfiguration: !!lspCapabilities.workspace?.didChangeConfiguration?.dynamicRegistration,
            documentFormatting: !!lspCapabilities.textDocument?.formatting?.dynamicRegistration,
            documentHighlight: !!lspCapabilities.textDocument?.documentHighlight?.dynamicRegistration,
            foldingRange: !!lspCapabilities.textDocument?.foldingRange?.dynamicRegistration,
            selectionRange: !!lspCapabilities.textDocument?.selectionRange?.dynamicRegistration,
            signatureHelp: !!lspCapabilities.textDocument?.signatureHelp?.dynamicRegistration
        },
        applyEdit: !!lspCapabilities.workspace?.applyEdit,
        completionContext: !!lspCapabilities.textDocument?.completion?.contextSupport,
        configuration: !!lspCapabilities.workspace?.configuration,
        diagnostics: !!lspCapabilities.textDocument?.publishDiagnostics,
        workspaceFolders: !!lspCapabilities.workspace?.workspaceFolders
    }
    return ans
}
