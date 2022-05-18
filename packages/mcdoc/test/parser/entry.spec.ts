import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { entry } from '../../lib'

describe('entry()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'mod describes;' },
		{ content: 'mod describes minecraft:block;' },
		{
			content: `
// https://github.com/Yurihaia/mc-mcdoc/blob/2e5a3da2ca01cb12c61dd9c5146ef8b711031e29/minecraft/block/jigsaw.mcdoc by [Yurihaia](https://github.com/Yurihaia)
// CC BY 4.0
// Modified for testing doc comments parsing.
/// Jigsaw block.
compound Jigsaw extends super::BlockEntity {
	/// How the resultant structure can be transformed
	joint: JointType,
	/// The id of the jigsaw that this will "spawn" in
	name: string,
	/// The structure pool that the jigsaw will "spawn" in
	pool: string,
	/// The final block state of the jigsaw
	final_state: string,
	/// The id of the type of jigsaw this will be "spawned" from
	target: string
}

/// Joint type.
enum(string) JointType {
	/// The structure can be rotated
	Rollable = "rollable",
	/// The structure cannot be transformed
	Aligned = "aligned"
}

Jigsaw describes minecraft:block[minecraft:jigsaw];`,
		},
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = entry
			snapshot(testParser(parser, content))
		})
	}
})
