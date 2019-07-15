import {
    createConnection,
    ProposedFeatures,
    TextDocumentSyncKind
} from 'vscode-languageserver'

const connection = createConnection(ProposedFeatures.all)

connection.onInitialize(_params => {
    return {
        capabilities: {
            completionProvider: {
                triggerCharacters: [
                    ' ', ',', '{', '[', '=', ':', '@', '\n'
                ],
                resolveProvider: true
            },
            definitionProvider: true,
            documentHighlightProvider: true,
            documentFormattingProvider: true,
            hoverProvider: true,
            referencesProvider: true,
            renameProvider: true,
            documentLinkProvider: {
                resolveProvider: true
            },
            textDocumentSync: {
                change: TextDocumentSyncKind.Incremental,
                openClose: true
            }
        }
    }
})

connection.onDidOpenTextDocument(params => {
    
})
