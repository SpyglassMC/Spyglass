#!/usr/bin/env node
import esbuild from 'esbuild'

try {
	const mode = process.argv[2]
	if (mode !== 'dev' && mode !== 'prod' && mode !== 'watch') {
		throw new Error('Usage: ./esbuild.mjs dev|prod|watch')
	}

	const isDev = mode !== 'prod'
	console.info('Start building...')
	const result = await esbuild.build({
		entryPoints: ['./lib/server.js'],
		entryNames: '[name]',
		format: 'esm',
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
