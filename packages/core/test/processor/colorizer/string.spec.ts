import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { StringNode, UnicodeEscapeNode } from '../../../lib/index.js'
import { colorizer, ColorizerContext, LiteralNode, Range } from '../../../lib/index.js'
import { mockProjectData } from '../../utils.ts'

describe('string() colorizer', () => {
	describe('escape-range clipping', () => {
		// A string's children are its `unicode_escape` nodes plus the result of
		// its value parser. The value parser's node covers the whole value, so
		// its tokens overlap the escapes - they have to be split around them,
		// otherwise the escape's own highlight would be painted over.
		//
		//   0         1         2         3
		//   0123456789012345678901234567890
		//   "abc\N{Acute Angle}def"
		//        ^escape      ^escape
		const escape = (): UnicodeEscapeNode => ({
			type: 'unicode_escape',
			kind: 'N',
			range: Range.create(10, 24),
			raw: '\\N{Acute Angle}',
			resolved: '⦟',
			codepoint: 0x299f,
			prefixRange: Range.create(10, 12),
			suffixRange: Range.create(23, 24),
		})

		const stringNode = (children: StringNode['children']): StringNode => ({
			type: 'string',
			range: Range.create(0, 30),
			options: { quotes: ['"'] },
			value: 'abc⦟def',
			valueMap: [],
			children,
		})

		const colorize = (node: StringNode) => {
			const project = mockProjectData()
			colorizer.registerColorizers(project.meta)
			const doc = TextDocument.create('', '', 0, '')
			const ctx = ColorizerContext.create(project, { doc })
			return project.meta.getColorizer('string')(node, ctx)
		}

		it('splits a child token that overlaps an escape', (t) => {
			const tokens = colorize(
				stringNode([
					escape(),
					LiteralNode.mock(Range.create(5, 25), { pool: [] }),
				]),
			)
			t.assert.deepEqual(
				tokens.map(t => [t.range.start, t.range.end, t.type]),
				[
					[0, 5, 'string'],
					// The value parser's token, split around the escape.
					[5, 10, 'literal'],
					// The escape's own tokens.
					[10, 12, 'escape'],
					[12, 23, 'resourceLocation'],
					[23, 24, 'escape'],
					// The other half of the split token.
					[24, 25, 'literal'],
					[25, 30, 'string'],
				],
			)
		})

		it('leaves a child token that does not overlap an escape alone', (t) => {
			const tokens = colorize(
				stringNode([
					escape(),
					LiteralNode.mock(Range.create(25, 28), { pool: [] }),
				]),
			)
			t.assert.deepEqual(
				tokens.map(t => [t.range.start, t.range.end, t.type]),
				[
					[0, 10, 'string'],
					[10, 12, 'escape'],
					[12, 23, 'resourceLocation'],
					[23, 24, 'escape'],
					[24, 25, 'string'],
					[25, 28, 'literal'],
					[28, 30, 'string'],
				],
			)
		})
	})
})
