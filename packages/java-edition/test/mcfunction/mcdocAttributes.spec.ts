import * as core from '@spyglassmc/core'
import { CheckerContext, ColorizerContext, ParserContext, Source } from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import { registerMcdocAttributes } from '@spyglassmc/java-edition/lib/mcfunction/mcdocAttributes.js'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as mcf from '@spyglassmc/mcfunction'
import * as nbt from '@spyglassmc/nbt'
import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'

/**
 * The `tellraw` node of the vanilla command tree, with the `message` argument
 * simplified to a `brigadier:string` so that the test doesn't depend on the
 * `text_component` type being resolvable.
 */
const commandTree: mcf.RootTreeNode = {
	type: 'root',
	children: {
		tellraw: {
			type: 'literal',
			executable: true,
			children: {
				targets: {
					type: 'argument',
					parser: 'minecraft:entity',
					properties: { amount: 'multiple', type: 'entities' },
					children: {
						message: {
							type: 'argument',
							parser: 'brigadier:string',
							properties: { type: 'phrase' },
							executable: true,
						},
					},
				},
			},
		},
	},
}

/**
 * Parses `content` as an SNBT string, applies the `#[command]` attribute's
 * string parser to it, and returns the resulting color tokens.
 *
 * This mirrors what the mcdoc runtime does for a `#[command] string` field -
 * see `handleNodeAttachers` in `packages/mcdoc/src/runtime/checker/index.ts`.
 */
function parseCommandString(content: string): {
	tokens: readonly core.ColorToken[]
	errors: readonly core.LanguageError[]
} {
	const project = mockProjectData()
	mcf.initialize(project)
	nbt.initialize(project)
	registerMcdocAttributes(project.meta, commandTree)

	const doc = TextDocument.create('', 'snbt', 0, content)
	const parserCtx = ParserContext.create(project, { doc })
	const stringNode = nbt.parser.string(new Source(content), parserCtx)
	assert.notEqual(stringNode, core.Failure)

	const attribute = mcdoc.runtime.attribute.getAttribute(project.meta, 'command')
	assert.ok(attribute, 'the `command` attribute should have been registered')
	const stringParser = attribute.attribute.stringParser
	assert.ok(stringParser, 'the `command` attribute should provide a string parser')
	const parser = stringParser(
		{},
		{ kind: 'string' },
		mcdoc.runtime.checker.McdocCheckerContext.create(
			CheckerContext.create(project, { doc }),
			{},
		),
	)
	assert.ok(parser, 'the `command` attribute should return a string parser')
	const child = parser(new Source(stringNode.value, stringNode.valueMap), parserCtx)
	assert.ok(child, 'the `command` attribute should have parsed the string')
	stringNode.children = [child]

	const colorizerCtx = ColorizerContext.create(project, { doc })
	const tokens = project.meta.getColorizer(stringNode.type)(stringNode, colorizerCtx)
	return { tokens, errors: parserCtx.err.dump() }
}

describe('mcfunction mcdoc attributes', () => {
	describe('#[command] string', () => {
		it('colorizes the command name as `keyword` and the entity selector as `literal`', () => {
			const { tokens, errors } = parseCommandString(`"tellraw @s 'hi'"`)
			assert.deepEqual(
				tokens.map(t => [t.range.start, t.range.end, t.type]),
				[
					// The quotes of the SNBT string.
					[0, 1, 'string'],
					// `tellraw` is the root literal of the command tree.
					[1, 8, 'keyword'],
					[8, 9, 'string'],
					// `@s` is an entity selector.
					[9, 11, 'literal'],
					[11, 12, 'string'],
					// `'hi'` is the message argument.
					[12, 16, 'string'],
					[16, 17, 'string'],
				],
			)
			assert.deepEqual(
				errors.map(e => e.message),
				[],
			)
		})
	})
})
