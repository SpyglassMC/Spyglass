import {
	mockProjectData,
	showWhitespaceGlyph,
	testParser,
} from '@spyglassmc/core/test-out/utils.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { initialize } from '../../../java-edition/lib/mcfunction/index.js'
import { entry } from '../../lib/parser/index.js'
import { tree } from './utils.js'

describe('mcfunction parser entry()', () => {
	const cases: { content: string }[] = [
		{ content: '' },
		{ content: 'say hi' },
		{ content: 'say hi\nsay hi' },
		{ content: '# this is a comment' },
		{ content: '$ this is a macro command' },
		{ content: '# this is a comment\nsay hi\n$this is a macro \n' },
		{ content: 'execute if true if true run say hi' },
	]
	for (const { content } of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const release = '1.99'
			initialize(mockProjectData(), tree, release)
			const parser = entry(release, () => undefined)
			snapshot(testParser(parser, content))
		})
	}
})
