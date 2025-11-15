import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { byteArray, intArray, list, longArray } from '@spyglassmc/nbt/lib/parser/index.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'

describe('nbt list()', () => {
	const suites: { content: string; version?: string }[] = [
		{ content: '' },
		{ content: '[]' },
		{ content: '["string"]' },
		{ content: '["string", 1b]', version: '1.21.4' },
		{ content: '["string", 1b]', version: '1.21.5' },
	]
	for (const { content, version } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"${version ? ` in ${version}` : ''}`, () => {
			const parser = list
			const ctx = version ? { project: { ctx: { loadedVersion: version } } } : undefined
			snapshot(testParser(parser, content, ctx))
		})
	}
})

describe('nbt byteArray()', () => {
	const suites: { content: string }[] = [{ content: '' }, { content: '[B;]' }, {
		content: '[B; true, 1b]',
	}, { content: '[B; true, 1b, 2]' }]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = byteArray
			snapshot(testParser(parser, content))
		})
	}
})

describe('nbt intArray()', () => {
	const suites: { content: string }[] = [{ content: '' }, { content: '[I;]' }, {
		content: '[I; 0, 1]',
	}, { content: '[I; 0, 1.]' }]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = intArray
			snapshot(testParser(parser, content))
		})
	}
})

describe('nbt longArray()', () => {
	const suites: { content: string }[] = [{ content: '' }, { content: '[L;]' }, {
		content: '[L; 0L, 1L]',
	}, { content: '[L; 0L, 2, "string"]' }]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = longArray
			snapshot(testParser(parser, content))
		})
	}
})
