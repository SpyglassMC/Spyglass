import * as core from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import type * as mcdoc from '@spyglassmc/mcdoc'
import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import * as json from '../../lib/index.js'

const lit = (value: string): mcdoc.McdocType => ({
	kind: 'literal',
	value: { kind: 'string', value },
})

/**
 * A struct with a `foo` string field, a `bar` field that only accepts a handful of numbers, and a `baz` string field.
 */
const type: mcdoc.McdocType = {
	kind: 'struct',
	fields: [
		{ kind: 'pair', key: lit('foo'), type: { kind: 'string' } },
		{
			kind: 'pair',
			key: lit('bar'),
			type: {
				kind: 'union',
				members: [1, 2, 3, 4].map(value => ({
					kind: 'literal',
					value: { kind: 'int', value },
				})),
			},
		},
		{ kind: 'pair', key: lit('baz'), type: { kind: 'string' } },
	],
}

/**
 * Parses `content` as a JSON file, checks it against {@link type}, and returns the completion items at `offset`.
 */
function completeAt(content: string, offset: number): core.CompletionItem[] {
	const project = mockProjectData({})
	json.getInitializer()({ meta: project.meta } as any)

	const doc = TextDocument.create('file:///test.json', 'json', 0, content)
	const file = json.parser.file(
		new core.Source(content),
		core.ParserContext.create(project, { doc }),
	)
	if (file === core.Failure) {
		throw new Error('Failed to parse the JSON file')
	}
	json.checker.index(type)(file.children[0], core.CheckerContext.create(project, { doc }))

	const ctx = core.CompleterContext.create(project, { doc, offset })
	const child = core.AstNode.findShallowestChild({
		node: file,
		needle: offset,
		endInclusive: true,
		predicate: n => project.meta.hasCompleter(n.type),
	})
	return child ? project.meta.getCompleter(child.type)(child, ctx) : []
}

describe('json completer', () => {
	describe('primitive()', () => {
		it('returns the values of the type definition for an empty value', () => {
			const content = '{ "foo": "test", "bar": , "baz": "funny" }'
			const items = completeAt(content, content.indexOf('"bar": ') + 7)
			assert.deepEqual(items.map(i => i.label), ['1', '2', '3', '4'])
		})

		it('returns the values of the type definition for an empty value not followed by a comma', () => {
			const content = '{ "foo": "test", "bar":  "baz": "funny" }'
			const items = completeAt(content, content.indexOf('"bar": ') + 7)
			assert.deepEqual(items.map(i => i.label), ['1', '2', '3', '4'])
		})

		it('does not suggest a quote pair when the type definition has values', () => {
			const content = '{ "foo": "test", "bar": , "baz": "funny" }'
			const items = completeAt(content, content.indexOf('"bar": ') + 7)
			assert.ok(!items.some(i => i.label === '""'))
		})

		it('suggests a quote pair when there is no type definition', () => {
			const content = '{ "foo": , "baz": "funny" }'
			const items = completeAt(content, content.indexOf('"foo": ') + 7)
			assert.deepEqual(items.map(i => i.label), ['""'])
		})
	})
})
