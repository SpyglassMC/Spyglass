import type { AstNode } from '@spyglassmc/core'
import { FormatterContext, MetaRegistry } from '@spyglassmc/core'
import { mockProjectData, testParser } from '@spyglassmc/core/test/utils.ts'
import { strict as assert } from 'assert'
import fs from 'fs/promises'
import { describe, it } from 'node:test'
import { URL } from 'url'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { registerMcdocFormatter } from '../../lib/formatter/index.js'
import { module_ } from '../../lib/parser/index.js'

const suitesUrl = new URL('../../test/formatter/suites/', import.meta.url)

describe('mcdoc formatter', async () => {
	const meta = new MetaRegistry()
	registerMcdocFormatter(meta)
	const suites = await fs.opendir(suitesUrl)
	for await (const file of suites) {
		const mcdoc = await fs.readFile(new URL(file.name, suitesUrl), 'utf8')
		const describeTitle = `Format ${file.name}`
		it(describeTitle, () => {
			const { node } = testParser(module_, mcdoc)
			if (node === 'FAILURE') {
				throw new Error(`Failed to parse content for ${describeTitle}`)
			}
			const project = mockProjectData({
				meta,
			})
			const doc = TextDocument.create('', '', 0, mcdoc)
			const ctx = FormatterContext.create(project, {
				tabSize: 4,
				insertSpaces: true,
				doc,
			})
			const formatter = meta.getFormatter('mcdoc:module')
			const formatted = formatter(node as AstNode, ctx)
			assert.strictEqual(formatted, mcdoc)
		})
	}
})
