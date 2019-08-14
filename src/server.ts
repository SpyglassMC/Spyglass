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
                triggerCharacters: [' ', ',', '{', '[', '=', ':', '@', '\n', '#']
            },
            definitionProvider: true,
            documentFormattingProvider: true,
            documentLinkProvider: {
                resolveProvider: true
            },
            documentOnTypeFormattingProvider: {
                firstTriggerCharacter: '\n'
            },
            foldingRangeProvider: true,
            hoverProvider: true,
            referencesProvider: true,
            renameProvider: {
                prepareProvider: true
            },
            signatureHelpProvider: {
                triggerCharacters: [' ', '\n']
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
