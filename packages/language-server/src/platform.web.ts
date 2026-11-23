/**
 * The Web Worker flavor of everything the language server needs from its runtime environment. It is
 * used (instead of `platform.ts`) by the web build of the language server, which runs inside the
 * extension host of VS Code for the Web.
 *
 * There is no file system and no `process` in a Web Worker. All file access is therefore forwarded to
 * the language client, which implements it with `vscode.workspace.fs`.
 */
import * as core from '@spyglassmc/core'
import { getWebExternals } from '@spyglassmc/core/lib/web.js'
import {
	BrowserMessageReader,
	BrowserMessageWriter,
	createConnection,
} from 'vscode-languageserver/browser.js'
import { RemoteFileSystem } from './util/RemoteFileSystem.js'

/**
 * A made-up location inside the file system that the client exposes to the server. The client is
 * responsible for redirecting it to a proper storage location (e.g. the extension's global storage).
 */
export const cacheRoot = core.fileUtil.ensureEndingSlash('file:///.spyglass-cache/')

const scope = self as unknown as ConstructorParameters<typeof BrowserMessageReader>[0]
export const connection = createConnection(
	new BrowserMessageReader(scope),
	new BrowserMessageWriter(scope),
)

/**
 * A minimal stand-in for Node's `util.format`: strings are kept as is, errors keep their stack, and
 * everything else is turned into JSON.
 */
function format(...args: unknown[]): string {
	return args.map((arg) => {
		if (typeof arg === 'string') {
			return arg
		} else if (arg instanceof Error) {
			return arg.stack ?? arg.message
		}
		try {
			return JSON.stringify(arg) ?? String(arg)
		} catch {
			return String(arg)
		}
	}).join(' ')
}

export const logger: core.Logger = {
	error: (msg: any, ...args: any[]): void => connection.console.error(format(msg, ...args)),
	info: (msg: any, ...args: any[]): void => connection.console.info(format(msg, ...args)),
	log: (msg: any, ...args: any[]): void => connection.console.log(format(msg, ...args)),
	warn: (msg: any, ...args: any[]): void => connection.console.warn(format(msg, ...args)),
}

export const externals: core.Externals = getWebExternals({ fs: new RemoteFileSystem(connection) })

export const canShowFiles = false

export function setFailedExitCode(): void {
	// There is no process whose exit code could be set.
}
