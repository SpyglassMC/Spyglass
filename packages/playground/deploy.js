#!/usr/bin/env node
import fsp from 'fs/promises'
import cp from 'child_process'
import { promisify } from 'util'

const execFile = promisify(cp.execFile)

try {
	const indexHtml = await fsp.readFile('./index.html')
	const indexJs = await fsp.readFile('./dist/index.js')
	process.chdir('../..')
	await execFile('git', ['switch', 'gh-pages'])
	try {
		await fsp.mkdir('playground')
		await fsp.mkdir('playground/dist', { recursive: true })
	} catch (e) {
		// Ignored
	}
	await fsp.writeFile('playground/index.html', indexHtml)
	await fsp.writeFile('playground/dist/index.js', indexJs)
	await execFile('git', ['add', 'playground'])
	await execFile('git', ['commit', '-m "🚀 Deploy playground"'], {
		env: {
			GIT_COMMITTER_EMAIL: process.env.GIT_AUTHOR_EMAIL,
			GIT_COMMITTER_NAME: process.env.GIT_AUTHOR_NAME,
			GIT_AUTHOR_EMAIL: process.env.GIT_AUTHOR_EMAIL,
			GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME,
		},
	})
	await execFile('git', ['push'])
} catch (e) {
	console.error(e)
	process.exitCode = 1;
}
