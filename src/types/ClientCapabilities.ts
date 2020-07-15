import { ClientCapabilities as LspClientCapabilities } from 'vscode-languageserver'

export interface ClientCapabilities {
    dynamicRegistration: {
        didChangeConfiguration: boolean,
        documentFormatting: boolean,
        documentHighlight: boolean,
        foldingRange: boolean,
        selectionRange: boolean
    }
}

export function getClientCapabilities(lspCapabilities: LspClientCapabilities) {
    const ans: ClientCapabilities = {
        dynamicRegistration: {
            documentFormatting: !!lspCapabilities.textDocument?.formatting?.dynamicRegistration,
            documentHighlight: !!lspCapabilities.textDocument?.documentHighlight?.dynamicRegistration,
            foldingRange: !!lspCapabilities.textDocument?.foldingRange?.dynamicRegistration,
            selectionRange: !!lspCapabilities.textDocument?.selectionRange?.dynamicRegistration,
            didChangeConfiguration: !!lspCapabilities.workspace?.didChangeConfiguration
        }
    }
    return ans
}
