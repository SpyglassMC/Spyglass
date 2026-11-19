import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { StringNode } from '../../../lib/index.js'
import { completer, CompleterContext, Range } from '../../../lib/index.js'
import { mockProjectData } from '../../utils.ts'

describe('string() completer', () => {
	const stringNode = (overrides: Partial<StringNode> = {}): StringNode => ({
		type: 'string',
		range: Range.create(0, 2),
		options: { quotes: ['"', "'"] },
		value: '',
		valueMap: [],
		...overrides,
	})

	const complete = (node: StringNode) => {
		const project = mockProjectData()
		completer.registerCompleters(project.meta)
		const doc = TextDocument.create('', '', 0, '')
		const ctx = CompleterContext.create(project, { doc, offset: 1 })
		return completer.string(node, ctx)
	}

	describe('the empty-string quote pair', () => {
		// A quoted-but-empty string already has its quotes; offering a `""`
		// snippet there produces `""""` when accepted.
		it('offers a quote pair for an unquoted empty string', (t) => {
			const items = complete(stringNode())
			t.assert.deepEqual(items.map(i => i.label), ['""', "''"])
		})

		it('offers no quote pair for a quoted but empty string', (t) => {
			const items = complete(stringNode({ quote: '"' }))
			t.assert.deepEqual(items, [])
		})

		it('offers no quote pair for a quoted but empty string with any quote', (t) => {
			const items = complete(stringNode({ quote: "'" }))
			t.assert.deepEqual(items, [])
		})
	})
})
