/* --------------------------------------------------------------------------------------------
 * This file is changed from Microsoft's sample:
 * https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/extension.ts
 * ------------------------------------------------------------------------------------------*/

import { join } from 'path'
import { workspace, ExtensionContext, RelativePattern, window, StatusBarAlignment, FileSystemWatcher, DocumentSemanticTokensProvider, TextDocument, CancellationToken, SemanticTokens, languages, SemanticTokensLegend } from 'vscode'

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, SynchronizeOptions } from 'vscode-languageclient'

let client: LanguageClient

const TokenTypes = [
    'comment', 'function', 'keyword', 'namespace', 'number', 'operator',
    'parameter', 'property', 'string', 'type', 'variable'
]
const TokenModifiers = [
    'declaration', 'deprecated', 'documentation', 'firstArgument'
]

export function activate(context: ExtensionContext) {
    // The server is implemented in node
    const serverModule = context.asAbsolutePath(
        join('dist', 'server.js')
    )
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] }

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: {
            module: serverModule,
            transport: TransportKind.ipc
        },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    }

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for mcfunction documents
        documentSelector: [
            { language: 'mcfunction' },
            { language: 'mcfunction-snapshot' }
        ],
        synchronize: {
            fileEvents: []
        },
        initializationOptions: {
            storagePath: context.storagePath
        }
    }

    if (workspace.workspaceFolders) {
        ((clientOptions.synchronize as SynchronizeOptions)
            .fileEvents as FileSystemWatcher[]
        ).push(
            workspace.createFileSystemWatcher(
                new RelativePattern(workspace.workspaceFolders[0], 'data/**/*')
            )
        )
    }

    // Create the language client and start the client.
    client = new LanguageClient(
        'datapackLanguageServer',
        'Datapack Language Server',
        serverOptions,
        clientOptions
    )

    // Start the client. This will also launch the server
    client.start()

    client.onReady().then(() => {
        // Semantic coloring provider test.
        client.sendNotification('spgoding/semanticColoringLegendTest', { types: TokenTypes, modifiers: TokenModifiers })
        context.subscriptions.push(
            languages.registerDocumentSemanticTokensProvider(
                [
                    { language: 'mcfunction' },
                    { language: 'mcfunction-snapshot' }
                ],
                new McfunctionSemanticTokensProvider(),
                new SemanticTokensLegend(TokenTypes, TokenModifiers)
            )
        )
    })
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined
    }
    return client.stop()
}

class McfunctionSemanticTokensProvider implements DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document: TextDocument) {
        const response = await client.sendRequest<number[] | null>(
            'spgoding/semanticColoringTest',
            { textDocument: { uri: document.uri.toString() } }
        )
        if (!response) {
            return null
        }
        return new SemanticTokens(Uint32Array.from(response))
    }
}
