import {
    createConnection,
    ProposedFeatures,
    TextDocumentSyncKind
} from 'vscode-languageserver'
import { VanillaConfig } from './types/Config'

const connection = createConnection(ProposedFeatures.all)

export let globalConfig = VanillaConfig

connection.onInitialize(_params => {
    return {
        capabilities: {
            completionProvider: {
                triggerCharacters: [
                    ' ', ',', '{', '[', '=', ':', '@', '\n', '#'
                ],
                resolveProvider: true
            },
            definitionProvider: true,
            documentHighlightProvider: true,
            documentFormattingProvider: true,
            hoverProvider: true,
            referencesProvider: true,
            renameProvider: true,
            foldingRangeProvider: true,
            documentOnTypeFormattingProvider: {
                firstTriggerCharacter: '\n'
            },
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
