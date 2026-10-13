import { ColorizerContext, ParserContext, Source } from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import * as nbt from '@spyglassmc/nbt/lib/index.js'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'

function colorize(content: string) {
	const project = mockProjectData()
	nbt.colorizer.register(project.meta)
	nbt.checker.register(project.meta)
	const doc = TextDocument.create('', '', 0, content)
	const src = new Source(content)
	const parserCtx = ParserContext.create(project, { doc })
	const node = nbt.parser.entry(src, parserCtx) as nbt.NbtNode
	const colorizerCtx = ColorizerContext.create(project, { doc })
	return project.meta.getColorizer(node.type)(node as never, colorizerCtx)
}

// Mirrors the mcfunction `set value <nbt>` arg parser: wraps the entry parse
// result in an `nbt:typed` node (same shape as `nbtParser()`). The
// `nbt:typed` colorizer delegates to the child, so this catches any break
// in the recursion from `nbt:typed` → `nbt:bool_function` → inner `nbt:int`.
function colorizeInTypedWrapper(content: string) {
	const inner = colorize(content)
	const project = mockProjectData()
	nbt.colorizer.register(project.meta)
	const doc = TextDocument.create('', '', 0, content)
	const src = new Source(content)
	const parserCtx = ParserContext.create(project, { doc })
	const res = nbt.parser.entry(src, parserCtx) as nbt.NbtNode
	const typed: nbt.TypedNbtNode = {
		type: 'nbt:typed',
		range: res.range,
		children: [res],
		targetType: { kind: 'any' },
	}
	const colorizerCtx = ColorizerContext.create(project, { doc })
	return {
		viaTypedWrapper: project.meta.getColorizer(typed.type)(typed as never, colorizerCtx),
		viaInnerColorizer: inner,
	}
}

describe('snbt function colorizer', () => {
	const cases: { content: string }[] = [
		{ content: 'bool(1)' },
		{ content: 'bool(0xff)' },
		{ content: 'bool(42)' },
		{ content: 'bool(1_000)' },
		{ content: 'bool(' },
		{ content: 'uuid("12345678-1234-1234-1234-123456789012")' },
		{ content: 'uuid(42)' },
		{ content: 'uuid(' },
	]
	for (const { content } of cases) {
		it(`Colorize '${content}'`, (t) => {
			t.assert.snapshot(colorize(content))
		})
	}
})

describe('snbt function colorizer wrapped in nbt:typed', () => {
	const cases: { content: string }[] = [
		{ content: 'bool(1)' },
		{ content: 'bool(1_000)' },
		{ content: 'uuid("12345678-1234-1234-1234-123456789012")' },
	]
	for (const { content } of cases) {
		it(`Colorize '${content}'`, (t) => {
			t.assert.snapshot(colorizeInTypedWrapper(content))
		})
	}
})
