import { ProjectData } from '@spyglassmc/core'
import { testChecker } from '@spyglassmc/json/test-out/utils.mjs'
import * as nbt from '@spyglassmc/nbt'
import { strict as assert } from 'assert'
import fg from 'fast-glob'
import fs from 'fs'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Categories } from '../../../lib/binder/index.mjs'
import { Checkers } from '../../../lib/json/checker/data/index.mjs'

describe.skip('Check vanilla files', async () => {
	const root = 'node_modules/vanilla-datapack-data/data/minecraft/'
	const summary = [...Categories.keys()].map(c => fg.sync(`${root}${c}/**/*.json`))

	const project = ProjectData.mock({ roots: ['file:///'], ctx: { loadedVersion: '1.18' } })
	nbt.initialize(project)

	summary.forEach((files, i) => {
		const category = [...Categories][i]
		const checker = Checkers.get(category[1].category)
		if (!checker || !files) return

		it(`Category ${category[1].category}`, () => {
			let passing = true
			files.forEach(file => {
				if (file.endsWith('/dimension/overworld.json')) {
					return // skip insanely large file
				}
				const text = fs.readFileSync(file, 'utf-8')
				const result = testChecker(checker, text, { project })
				const errors = result.parserErrors.concat(result.checkerErrors)
					.filter(e => !e.message.startsWith('Cannot find'))
				if (errors.length === 0) return

				passing = false
				setTimeout(() => {
					console.log(`\t${file.slice(root.length + category[0].length + 1)}`)
					const doc = TextDocument.create('', '', 0, text)
					errors.forEach(e => {
						const pos = doc.positionAt(e.range.start)
						console.log(`\t  ${pos.line + 1}:${pos.character}  ${e.message}`)
					})
				}, 0)
			})
			assert(passing)
		})
	})
})
