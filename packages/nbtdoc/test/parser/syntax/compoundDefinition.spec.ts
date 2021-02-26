import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { compoundDefinition } from '../../../lib'

describe('compoundDefinition()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'compound' },
		{ content: 'compound Foo { Bar: () }' },
		{ content: 'compound Foo { Bar: minecraft:block[name.second] }' },
		{ content: 'compound Foo { Bar: id(minecraft:entity) }' },
		{ content: 'compound Foo { Bar: boolean }' },
		{ content: 'compound Foo { Bar: byte[] }' },
		{ content: 'compound Foo { Bar: int @ 0..1 [] }' },
		{ content: 'compound Foo { Bar: long[] @ 4 }' },
		{ content: 'compound Foo { Bar: [string] @ ..1 }' },
		{ content: 'compound Foo { "Bar": [(byte@0..1[] @ 8 | super::Other)] @ ..1 }' },
		{
			content: `/// Doc comment for the compound.
compound Jigsaw extends super::BlockEntity {
	/// How the resultant structure can be transformed
	joint: JointType,
	/// The id of the jigsaw that this will "spawn" in
	"name": string
}`,
		},
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = compoundDefinition()
			snapshot(testParser(parser, content))
		})
	}
})
