import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { compoundDefinition } from '../../../lib'

describe.only('compoundDefinition()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'compound' },
		{
			content: 'compound Foo { Bar: boolean }',
		},
		{
			content: `/// Doc comment for the compound.
compound Jigsaw extends super::BlockEntity {
	/// How the resultant structure can be transformed
	joint: JointType,
	/// The id of the jigsaw that this will "spawn" in
	"name": string,
	field1: boolean,
	field2: byte[],
	field3: int @ 0..1 [],
	field4: long[] @ 4,
	field5: [(byte | short | int | long | float | double)] @ 1..,
	field6: minecraft:block[name],
	field7: id(minecraft:entity)
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
