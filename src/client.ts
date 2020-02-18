/* --------------------------------------------------------------------------------------------
 * This file is changed from Microsoft's sample:
 * https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/extension.ts
 * ------------------------------------------------------------------------------------------*/

import { join } from 'path'
import { workspace, ExtensionContext, RelativePattern, FileSystemWatcher } from 'vscode'

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
        // Register the server for mcfunction documents
        documentSelector: [{ language: 'mcfunction' }],
        synchronize: {
            fileEvents: []
        },
        initializationOptions: {
            storagePath: context.storagePath
        },
        progressOnInitialization: true
    }

    if (workspace.workspaceFolders) {
        for (const root of workspace.workspaceFolders) {
            clientOptions.synchronize.fileEvents.push(
                workspace.createFileSystemWatcher(
                    new RelativePattern(root, 'data/**/*')
                )
            )
        }
    }

    // Create the language client and start the client.
    client = new LanguageClient(
        'datapackLanguageServer',
        'Datapack Language Server',
        serverOptions,
        clientOptions
    )

    client.registerProposedFeatures()

    // Start the client. This will also launch the server
    client.start()
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined
    }
    return client.stop()
}
