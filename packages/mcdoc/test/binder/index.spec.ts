import {
	BinderContext,
	Failure,
	ParserContext,
	Range,
	Source,
	type Success,
	SymbolTable,
} from '@spyglassmc/core'
import {
	mockProjectData,
	showWhitespaceGlyph,
	snapshotWithUri,
} from '@spyglassmc/core/test/utils.ts'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { module_ as binder } from '../../lib/binder/index.js'
import type { ModuleNode, TopLevelNode } from '../../lib/index.js'
import { module_ as parser } from '../../lib/parser/index.js'

const Suites: Partial<Record<TopLevelNode['type'], string[]>> = {
	'mcdoc:enum': [
		'enum (byte) Foo { A = 1, B = 4b, C = 5B, D = 1.2, E = 1.2f, F = 4s, G = "Hello", }',
		'enum (short) Foo { A = 1, B = 4s, C = 5S, D = 1.2, E = 1.2f, F = 4b, G = "Hello", }',
		'enum (int) Foo { A = 1, B = 1.2, C = 1.2f, D = 4s, E = "Hello", }',
		'enum (long) Foo { A = 1, B = 4l, C = 5L, D = 1.2, E = 1.2f, F = 4s, G = "Hello", }',
		'enum (float) Foo { A = 1, B = 4f, C = 5F, D = 1.2, E = 1.2f, F = 4s, G = "Hello", }',
		'enum (double) Foo { A = 1, B = 4d, C = 5D, D = 1.2, E = 1.2f, F = 4s, G = "Hello", }',
		'enum (string) Foo { A = 1, B = 1.2, C = "Hello", }',
		'enum () Foo { A = 1, B = 1.2, C = 1.2f, D = 4s, E = "Hello", }',
	],
}

describe('mcdoc binder', () => {
	for (const [binderName, mcdocDefs] of Object.entries(Suites)) {
		const fileName = binderName.indexOf(':') > 0
			? binderName.substring(binderName.indexOf(':') + 1)
			: binderName
		const uri = new URL(`./${fileName}.spec.ts`, import.meta.url)
		describe(binderName, async () => {
			for (const mcdoc of mcdocDefs) {
				const project = mockProjectData()
				const itTitle = `Bind '${mcdoc}'`
				const doc = TextDocument.create('', '', 0, '')
				const binderCtx = BinderContext.create(project, { doc })
				const parseResult = parser(
					new Source(mcdoc),
					ParserContext.create(project, { doc }),
				)
				if (parseResult === Failure) {
					throw new Error(`Failed to parse content: ${mcdoc}`)
				}
				await binder(parseResult, { ...binderCtx, moduleIdentifier: 'test' })
				it(itTitle, (t) => {
					snapshotWithUri(t, {
						uri,
						value: {
							symbols: SymbolTable.unlink(binderCtx.symbols.global),
							errors: binderCtx.err.errors,
						},
					})
				})
			}
		})
	}
})
