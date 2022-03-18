import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { command } from '../../lib/parser'
import type { RootTreeNode } from '../../lib/tree'

describe('mcfunction parser command()', () => {
	const tree: RootTreeNode = {
		type: 'root',
		children: {
			execute: {
				type: 'literal',
				children: {
					if: {
						type: 'literal',
						children: {
							true: {
								type: 'literal',
								executable: true,
								redirect: ['execute'],
							},
						},
					},
					run: {
						type: 'literal',
					},
				},
			},
			say: {
				type: 'literal',
				children: {
					hi: {
						type: 'literal',
						executable: true,
					},
				},
			},
		},
	}
	const options = ['advancement', 'tell', 'tellraw']
	const cases: { content: string }[] = [
		{ content: '' },
		{ content: 's' },
		{ content: 'say' },
		{ content: 'say ' },
		{ content: 'say hi' },
		{ content: 'say hi ' },
		{ content: 'say hi garbage text' },
		{ content: 'execute if true if true run say hi' },
	]
	for (const { content } of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = command(tree, () => undefined)
			snapshot(testParser(parser, content))
		})
	}
})
