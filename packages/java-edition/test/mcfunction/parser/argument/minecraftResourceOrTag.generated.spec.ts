// This file is generated by `_generate.js`. Do not modify by hand.
import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils.js'
import { argument } from '@spyglassmc/java-edition/lib/mcfunction/parser/index.js'
import type { ArgumentTreeNode } from '@spyglassmc/java-edition/lib/mcfunction/tree/index.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
// @ts-expect-error
import { CommandArgumentTestSuites } from '@spyglassmc/java-edition/test/mcfunction/parser/argument/_suites.js'
// @ts-expect-error
import { meta } from '@spyglassmc/java-edition/test/mcfunction/parser/argument/_meta.js'

describe('mcfunction argument minecraft:resource_or_tag', () => {
	for (const { content, properties } of CommandArgumentTestSuites['minecraft:resource_or_tag']!) {
		const treeNode: ArgumentTreeNode = {
			type: 'argument',
			parser: 'minecraft:resource_or_tag',
			properties,
		}
		for (const string of content) {
			it(`Parse "${showWhitespaceGlyph(string)}"${properties ? ` with ${JSON.stringify(properties)}` : ''}`, () => {
				snapshot(testParser(argument(treeNode)!, string, { project: { meta } }))
			})
		}
	}
})