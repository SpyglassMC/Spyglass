#!/usr/bin/env node
import url from 'url'
import { promises as fsp } from 'fs'
import path from 'path'

const srcLocalesDir = path.join(url.fileURLToPath(new url.URL('.', import.meta.url)), 'src/locales')
const libLocalesDir = path.join(url.fileURLToPath(new url.URL('.', import.meta.url)), 'lib/locales')
const localeFileNames = await fsp.readdir(srcLocalesDir)

try {
	fsp.mkdir(libLocalesDir, { recursive: true })
} catch (e) {
	if (e.code !== 'EEXIST') {
		throw e
	}
}

for (const name of localeFileNames) {
	const srcPath = path.join(srcLocalesDir, name)
	const libPath = path.join(libLocalesDir, `${name.slice(0, -4)}mjs`)
	const content = await fsp.readFile(srcPath, 'utf-8')
	await fsp.writeFile(libPath, `export default ${JSON.stringify(JSON.parse(content))}\n`, 'utf-8')
}
