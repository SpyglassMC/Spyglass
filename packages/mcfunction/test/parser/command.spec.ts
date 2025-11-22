import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { fail } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { command } from '../../lib/parser/index.js'
import { tree } from './utils.ts'

describe('mcfunction parser command()', () => {
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
		it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
			const parser = command(tree, () => undefined)
			t.assert.snapshot(testParser(parser, content))
		})
	}
	it('Should not exceed max call stack', (t) => {
		const content = `execute ${'if true '.repeat(10000)}run `
		const parser = command(tree, () => undefined)
		try {
			t.assert.snapshot({
				node: 'OMITTED',
				errors: testParser(parser, content, { noNodeReturn: true }).errors,
			})
		} catch (e) {
			fail((e as Error).stack?.slice(0, 500))
		}
	})
})
