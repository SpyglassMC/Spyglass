import {
	showWhitespaceGlyph,
	testParser,
} from '@spyglassmc/core/test-out/utils.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { macro } from '../../lib/parser/index.js'

describe('mcfunction parser macro()', () => {
	const cases: { content: string }[] = [
		{ content: '$say $(message)' },
		{ content: '$tag @s add $(tag)_40' },
		{ content: '$scoreboard players set $mode settings $(value)' },
		{ content: '$tellraw $(player) $(text)' },
		{ content: '$tellraw $(players) ["$ Hello everyone! $"]' },
		{ content: '$summon cow $(x).1 $(y)30.0 $(z).0' },
		{ content: '$say $(foo bar' },
		{ content: '$say $() bar' },
		{ content: '$say $(invalid.key) bar' },
		{ content: '$say no macro argument specified' },
	]
	for (const { content } of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = macro()
			snapshot(testParser(parser, content))
		})
	}
})
