import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils.js'
import { fail } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { command } from '../../lib/parser/index.js'
import type { RootTreeNode } from '../../lib/tree/index.js'

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
	it('Should not exceed max call stack', () => {
		const content = `execute ${'if true '.repeat(10000)}run `
		const parser = command(tree, () => undefined)
		try {
			snapshot({ node: 'OMITTED', errors: testParser(parser, content, { noNodeReturn: true }).errors })
		} catch (e) {
			fail((e as Error).stack?.slice(0, 500))
		}
	})
})
