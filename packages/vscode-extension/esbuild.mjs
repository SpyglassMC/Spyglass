#!/usr/bin/env node
import esbuild from 'esbuild'

try {
	const mode = process.argv[2]
	if (mode !== 'dev' && mode !== 'prod' && mode !== 'watch') {
		throw new Error('Usage: ./esbuild.mjs dev|prod|watch')
	}

	const isDev = mode !== 'prod'
	console.info('Start building...')
	const nodeBuild = esbuild.build({
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
	const webServer = esbuild.build({
		entryPoints: ['../language-server/lib/server-web.js'],
		entryNames: '[name]',
		format: 'iife',
		platform: 'browser',
		bundle: true,
		outdir: './dist',
		external: ['vscode'],
		sourcesContent: false,
		sourcemap: isDev,
		minify: !isDev,
	})
	const webClient = esbuild.build({
		entryPoints: ['./out/extension-web.mjs'],
		entryNames: '[name]',
		format: 'cjs',
		platform: 'browser',
		bundle: true,
		outdir: './dist',
		external: ['vscode'],
		sourcesContent: false,
		sourcemap: isDev,
		minify: !isDev,
	})
	const results = await Promise.all([nodeBuild, webServer, webClient])
	logResult(results)
} catch (e) {
	console.error(e)
	process.exitCode = 1
}

/**
 * @param {esbuild.BuildResult[]} results
 */
function logResult(results) {
	if (results.every(result => result.errors.length === 0)) {
		console.info('Built successfully.')
	}
}
