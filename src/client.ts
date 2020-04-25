/* --------------------------------------------------------------------------------------------
 * This file is changed from Microsoft's sample:
 * https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/extension.ts
 * ------------------------------------------------------------------------------------------*/

import { join } from 'path'
import { commands, DocumentSemanticTokensProvider, ExtensionContext, FileSystemWatcher, languages, RelativePattern, SemanticTokens, SemanticTokensEdits, SemanticTokensLegend, TextDocument, Uri, window, workspace } from 'vscode'
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient'

let client: LanguageClient

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
    const clientOptions: LanguageClientOptions & { synchronize: { fileEvents: FileSystemWatcher[] } } = {
        documentSelector: [
            { language: 'mcfunction' }
            // { language: 'json', pattern: 'data/*/advancements/**.json' },
            // { language: 'json', pattern: 'data/*/loot_tables/**.json' },
            // { language: 'json', pattern: 'data/*/predicates/**.json' },
            // { language: 'json', pattern: 'data/*/recipes/**.json' },
            // { language: 'json', pattern: 'data/*/tags/{block,entity_types,fluids,functions,items}/**.json' }
        ],
        synchronize: {
            fileEvents: []
        },
        initializationOptions: {
            storagePath: context.storagePath,
            globalStoragePath: context.globalStoragePath
        },
        progressOnInitialization: true
    }

    if (workspace.workspaceFolders) {
        for (const root of workspace.workspaceFolders) {
            clientOptions.synchronize.fileEvents.push(
                workspace.createFileSystemWatcher(
                    new RelativePattern(root, 'data/**/*.{json,mcfunction}')
                )
            )
        }
    }

    // Create the language client and start the client.
    client = new LanguageClient(
        'datapack',
        'Datapack Language Server',
        serverOptions,
        clientOptions
    )

    // Start the client. This will also launch the server
    client.start()

    client.onReady().then(() => {
        client.onNotification('datapackLanguageServer/checkVersion', ({ currentVersion, title, action, url }) => {
            const lastVersion = context.globalState.get('lastVersion')
            if (lastVersion !== currentVersion) {
                window
                    .showInformationMessage(title, { title: action })
                    .then(
                        value => {
                            if (value && value.title === action) {
                                commands.executeCommand('vscode.open', Uri.parse(url))
                            }
                        },
                        reason => {
                            console.warn(`Errors occurred while indicating new version: ${reason}`)
                        }
                    )
            }
            context.globalState.update('lastVersion', currentVersion)
        })

        context.subscriptions.push(
            languages.registerDocumentSemanticTokensProvider(
                { language: 'mcfunction' },
                new LspSemanticTokensProvider(),
                new SemanticTokensLegend(
                    ['annotation', 'boolean', 'comment', 'entity', 'keyword', 'literal', 'identity', 'number', 'operator', 'property', 'string', 'type', 'variable', 'vector'],
                    ['declaration', 'deprecated', 'documentation', 'firstArgument']
                )
            )
        )
    })
}

class LspSemanticTokensProvider implements DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document: TextDocument): Promise<SemanticTokens> {
        const response = await client.sendRequest<{ resultId?: string, data: number[] }>('textDocument/semanticTokens', { textDocument: { uri: document.uri.toString() } })
        return { resultId: response.resultId, data: new Uint32Array(response.data) }
    }
    async provideDocumentSemanticTokensEdits(document: TextDocument, previousResultId: string): Promise<SemanticTokens | SemanticTokensEdits> {
        type LspSemanticTokens = { resultId?: string, data: number[] }
        type LspSemanticTokensEdits = { resultId?: string, edits: { start: number, deleteCount: number, data?: number[] }[] }
        const response = await client.sendRequest<LspSemanticTokens | LspSemanticTokensEdits>('textDocument/semanticTokens/edits', { textDocument: { uri: document.uri.toString() }, previousResultId })
        if ((response as LspSemanticTokens).data) {
            return { resultId: response.resultId, data: new Uint32Array((response as LspSemanticTokens).data) }
        } else {
            return { resultId: response.resultId, edits: (response as LspSemanticTokensEdits).edits.map(v => ({ start: v.start, deleteCount: v.deleteCount, data: v.data ? new Uint32Array(v.data) : undefined })) }
        }
    }
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined
    }
    return client.stop()
}
