/**
 * The Node.js flavor of everything the language server needs from its runtime environment.
 *
 * The web build swaps this module for `platform.web.ts` (see `packages/vscode-extension/esbuild.mjs`),
 * so both files must export exactly the same names.
 */
import * as core from '@spyglassmc/core'
import { getNodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import envPaths from 'env-paths'
import url from 'url'
import * as util from 'util'
import * as ls from 'vscode-languageserver/node.js'

if (process.argv.length === 2) {
	// When the server is launched from the cmd script, the process arguments
	// are wiped. I don't know why it happens, but this is what it is.
	// Therefore, we push a '--stdio' if the argument list is too short.
	process.argv.push('--stdio')
}

const { cache: cacheRootPath } = envPaths('spyglassmc')

export const cacheRoot = core.fileUtil.ensureEndingSlash(
	url.pathToFileURL(cacheRootPath).toString(),
)

export const connection = ls.createConnection()

export const logger: core.Logger = {
	error: (msg: any, ...args: any[]): void => connection.console.error(util.format(msg, ...args)),
	info: (msg: any, ...args: any[]): void => connection.console.info(util.format(msg, ...args)),
	log: (msg: any, ...args: any[]): void => connection.console.log(util.format(msg, ...args)),
	warn: (msg: any, ...args: any[]): void => connection.console.warn(util.format(msg, ...args)),
}

export const externals: core.Externals = getNodeJsExternals({ cacheRoot, logger })

/**
 * Whether the platform can reveal files in the operating system's file explorer.
 */
export const canShowFiles = true

/**
 * Called when the client sent `exit` before a proper `shutdown`.
 */
export function setFailedExitCode(): void {
	process.exitCode = 1
}
