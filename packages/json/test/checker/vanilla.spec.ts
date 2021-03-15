import type { FileCategory } from '@spyglassmc/core'
import { CheckerContext, ErrorReporter, Failure, ParserContext, Source } from '@spyglassmc/core'
import assert from 'assert'
import fsp from 'fs/promises'
import fetch from 'node-fetch'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Checkers } from '../../lib/checker/data'
import { entry as parser } from '../../lib/parser'
import { Categories } from '../../lib/util'

const categoryToPath = new Map(Array.from(Categories, a => a.reverse()) as [string, string][])

let doc: TextDocument
const err = new ErrorReporter()
afterEach(() => {
	err.dump().forEach(e => {
		const pos = doc.positionAt(e.range.start)
		console.error(`\t${pos.line+1}:${pos.character} ${e.message}`)
	})
})

describe('Check vanilla files', async () => {
	const summaryUrl = 'https://raw.githubusercontent.com/SPGoding/vanilla-datapack/summary/summary/flattened.min.json'
	const summary = await (await fetch(summaryUrl)).json()
	run()

	Object.keys(summary).forEach(category => {
		const checker = Checkers.get(category as FileCategory)
		if (checker && summary[category]) {
			describe(`Category ${category}`, () => {
				summary[category].forEach((id: string) => {
					it(id, async () => {
						const path = `${categoryToPath.get(category)}/${id.slice(10)}`
						const text = await fsp.readFile(`node_modules/vanilla-datapack-data/data/minecraft/${path}.json`, 'utf-8')
						const src = new Source(text)
						doc = TextDocument.create('', '', 0, text)
						const pctx = ParserContext.create({ doc })
						const result = parser(src, pctx)
						assert(result !== Failure)
						const cctx = CheckerContext.create({ err, doc, service: null! })
						checker(result, { ...cctx, context: '' })
						assert.strictEqual(cctx.err.errors.length, 0)
					})
				})
			})
		}
	})
})
