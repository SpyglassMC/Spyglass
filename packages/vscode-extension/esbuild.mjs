#!/usr/bin/env node
import esbuild from 'esbuild'
import path from 'node:path'

/**
 * The language server has one place for everything that depends on its runtime environment:
 * `platform.ts` for Node.js. A Web Worker has no Node.js, so for the web build that module is
 * replaced with `platform.web.ts`.
 *
 * @type {esbuild.Plugin}
 */
const webPlatform = {
	name: 'spyglassmc-web-platform',
	setup(build) {
		build.onResolve({ filter: /(^|\/)platform\.js$/ }, (args) => {
			// Don't touch `platform.js` files of other packages.
			if (!/[\\/]language-server[\\/]lib$/.test(args.resolveDir)) {
				return undefined
			}
			return { path: path.resolve(args.resolveDir, 'platform.web.js') }
		})
	},
}

try {
	const mode = process.argv[2]
	if (mode !== 'dev' && mode !== 'prod' && mode !== 'watch') {
		throw new Error('Usage: ./esbuild.mjs dev|prod|watch')
	}

	const isDev = mode !== 'prod'
	console.info('Start building...')
	const result = await esbuild.build({
		entryPoints: ['./out/extension.mjs', '../language-server/lib/server.js'],
		entryNames: '[name]',
		format: 'cjs', // https://github.com/microsoft/vscode/issues/130367
		platform: 'node',
		target: 'node16.13',
		bundle: true,
		outdir: './dist',
		// fsevents is a MacOS specific native extension used by chokidar for file
		// watching and should not be bundled:
		// https://github.com/SpyglassMC/Spyglass/issues/1143
		external: ['electron', 'fsevents', 'vscode'],
		sourcemap: isDev,
		minify: !isDev,
	})
	logResult(result)

	// The extension for VS Code for the Web (`"browser"` in package.json). The extension itself is
	// loaded by the web extension host, the language server by a Web Worker that the extension starts.
	console.info('Start building web extension...')
	const webExtension = await esbuild.build({
		entryPoints: ['./out/extension.web.mjs'],
		entryNames: 'extension',
		format: 'cjs',
		platform: 'browser',
		target: 'es2022',
		bundle: true,
		outdir: './dist/web',
		external: ['vscode'],
		sourcemap: isDev,
		minify: !isDev,
	})
	logResult(webExtension)

	console.info('Start building web language server...')
	const webServer = await esbuild.build({
		entryPoints: ['../language-server/lib/server.js'],
		entryNames: 'server',
		format: 'iife',
		platform: 'browser',
		target: 'es2022',
		bundle: true,
		outdir: './dist/web',
		plugins: [webPlatform],
		sourcemap: isDev,
		minify: !isDev,
	})
	logResult(webServer)
} catch (e) {
	console.error(e)
	process.exitCode = 1
}

/**
 * @param {esbuild.BuildResult} result
 */
function logResult(result) {
	if (result.errors.length === 0) {
		console.info('Built successfully.')
	}
}
