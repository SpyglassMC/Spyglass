#!/usr/bin/env node
import fsp from 'fs/promises'
import cp from 'child_process'
import { promisify } from 'util'

const execFile = promisify(cp.execFile)

try {
	const indexHtml = await fsp.readFile('./index.html')
	const indexJs = await fsp.readFile('./dist/index.js')
	console.log('Read source files.')
	process.chdir('../..')
	await execFile('git', ['switch', 'gh-pages'])
	console.log('Switched branch to gh-pages.')
	try {
		await fsp.mkdir('playground/dist', { recursive: true })
		console.log('Created playground/dist directory.')
	} catch (e) {
		if (e.code !== 'EEXIST') {
			throw e
		}
	}
	await fsp.writeFile('playground/index.html', indexHtml)
	await fsp.writeFile('playground/dist/index.js', indexJs)
	console.log('Wrote target files.')
	await execFile('git', ['add', 'playground'])
	console.log('Git added.')
	try {
		await execFile('git', ['commit', '-m 🚀 Deploy playground'], {
			env: {
				GIT_COMMITTER_EMAIL: process.env.GIT_AUTHOR_EMAIL,
				GIT_COMMITTER_NAME: process.env.GIT_AUTHOR_NAME,
				GIT_AUTHOR_EMAIL: process.env.GIT_AUTHOR_EMAIL,
				GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME,
			},
		})
		console.log('Git committed.')
	} catch (e) {
		// Assume nothing to commit.
		process.exit()
	}
	await execFile('git', ['pull', '--rebase'])
	await execFile('git', ['push'])
	console.log('Git pushed.')
} catch (e) {
	console.error('Error occurred', e)
	process.exitCode = 1
}
