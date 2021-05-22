import { strict as assert } from 'assert'
import fg from 'fast-glob'
import fs from 'fs'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Categories } from '../../../lib/json/binder'
import { Checkers } from '../../../lib/json/checker/data/1.17'
import { testChecker } from '@spyglassmc/json/test-out/utils'

describe('Check vanilla files', async () => {
	const root = 'node_modules/vanilla-datapack-data/data/minecraft/'
	const summary = [...Categories.keys()].map(c => fg.sync(`${root}${c}/**/*.json`))

	summary.forEach((files, i) => {
		const category = [...Categories][i]
		const checker = Checkers.get(category[1])
		if (!checker || !files) return

		it(`Category ${category[1]}`, () => {
			let passing = true
			files.forEach(file => {
				const text = fs.readFileSync(file, 'utf-8')
				const result = testChecker(checker, text)
				const errors = result.parserErrors.concat(result.checkerErrors)
					.filter(e => !e.message.endsWith('does not exist'))
				if (errors.length === 0) return

				passing = false
				setTimeout(() => {
					console.log(`\t${file.slice(root.length + category[0].length + 1)}`)
					const doc = TextDocument.create('', '', 0, text)
					errors.forEach(e => {
						const pos = doc.positionAt(e.range.start)
						console.log(`\t  ${pos.line+1}:${pos.character}  ${e.message}`)
					})
				}, 0)
			})
			assert(passing)
		})
	})
})
