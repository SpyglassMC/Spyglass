// import { describe, it } from 'mocha'
// import snapshot from 'snap-shot-it'
// import type { AstNode } from '../../lib'
// import { table } from '../../lib'
// import type { Options } from '../../lib/parser/table'
// import { showWhitespaceGlyph, testParser } from '../utils'

// describe('table()', () => {
// 	const suites: { options: Options<AstNode, AstNode>, content: string }[] = [
// 		{ options: { start: '{', pair: { key: '', sep: ':', value: '', end: ',', trailingEnd: true }, end: '}' }, content: '' },
// 		{ options: {}, content: '{test content}' },
// 		{ options: {}, content: '{test content}\n\t' },
// 		{ options: {}, content: '{test content}\nWhoops errors!' },
// 	]
// 	for (const { options, content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}" with ${JSON.stringify(options)}`, () => {
// 			snapshot(testParser(table(options), content))
// 		})
// 	}
// })
