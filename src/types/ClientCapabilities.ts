import { ClientCapabilities as LspClientCapabilities } from 'vscode-languageserver/node'

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
    checkServerVersion: boolean,
    completionContext: boolean,
    configuration: boolean,
    diagnostics: boolean,
    workDoneProgress: boolean,
    workspaceFolders: boolean
}

interface CustomClientCapabilities {
    checkServerVersion?: boolean
}

export function getClientCapabilities(lspCapabilities: LspClientCapabilities = {}, custom: CustomClientCapabilities = {}) {
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
        checkServerVersion: !!custom.checkServerVersion,
        completionContext: !!lspCapabilities.textDocument?.completion?.contextSupport,
        configuration: !!lspCapabilities.workspace?.configuration,
        diagnostics: !!lspCapabilities.textDocument?.publishDiagnostics,
        workDoneProgress: !!lspCapabilities.window?.workDoneProgress,
        workspaceFolders: !!lspCapabilities.workspace?.workspaceFolders
    }
    return ans
}
