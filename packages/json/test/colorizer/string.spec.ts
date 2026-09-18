import * as core from '@spyglassmc/core'
import { ColorizerContext } from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import type { McdocType } from '@spyglassmc/mcdoc/lib/type/index.js'
import * as nbt from '@spyglassmc/nbt/lib/index.js'
import { registerMcdocAttributes } from '@spyglassmc/nbt/lib/mcdocAttributes.js'
import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { index as jsonCheck } from '../../lib/checker/index.js'
import * as jsonColorizer from '../../lib/colorizer/index.js'
import type { JsonNode, JsonStringNode } from '../../lib/node/index.js'
import { entry as jsonParse } from '../../lib/parser/index.js'

describe('json:string colorizer after mcdoc runtime attaches nbt:typed', () => {
	const parseJson = (project: core.ProjectData, content: string) => {
		const doc = TextDocument.create('test.json', 'json', 0, content)
		const parserCtx = core.ParserContext.create(project, { doc })
		return {
			node: jsonParse(new core.Source(content), parserCtx) as JsonNode,
			doc,
		}
	}

	const findStringNode = (root: JsonNode): JsonStringNode => {
		const stack: core.AstNode[] = [root]
		while (stack.length > 0) {
			const node = stack.pop()!
			if (node.type === 'json:string') {
				return node as JsonStringNode
			}
			for (const child of (node as { children?: core.AstNode[] }).children ?? []) {
				stack.push(child)
			}
		}
		throw new Error('no json:string node found in AST')
	}

	const tagFieldType: McdocType = {
		kind: 'string',
		attributes: [{ name: 'nbt', value: { kind: 'any' } }],
	}

	const itemModifierType: McdocType = {
		kind: 'struct',
		fields: [{ kind: 'pair', key: 'tag', type: tagFieldType }],
	}

	const runColorize = (
		project: core.ProjectData,
		content: string,
	) => {
		const { node, doc } = parseJson(project, content)
		const checkCtx = core.CheckerContext.create(project, { doc })
		jsonCheck(itemModifierType)(node, checkCtx)
		const colorizerCtx = ColorizerContext.create(project, { doc })
		return jsonColorizer.string(findStringNode(node), colorizerCtx)
	}

	const setupProject = () => {
		const project = mockProjectData()
		// Register everything `nbt` and `json` need: parsers, colorizers,
		// checkers, and the `nbt` mcdoc attribute that wires `#[nbt]`
		// strings to the SNBT parser.
		jsonColorizer.register(project.meta)
		nbt.colorizer.register(project.meta)
		nbt.checker.register(project.meta)
		registerMcdocAttributes(project.meta)
		return project
	}

	it('emits an escape token covering the opening `{` of a named Unicode escape', (t) => {
		const project = setupProject()
		const tokens = runColorize(project, `{"tag":"{test:'\\N{Acute Angle}'}"}`)

		// The `\N{...}` portion starts at offset 15 in this input:
		//   {"tag":"{test:'\N{Acute Angle}'}"}
		//   0   4 78  13 15       29  31
		const escapeForOpeningBrace = tokens.find(t =>
			t.type === 'escape'
			&& t.range.start >= 15
			&& t.range.start < 18
			&& t.range.end === 18
		)
		assert.ok(
			escapeForOpeningBrace,
			`expected an escape token at ~[15, 18), got ${JSON.stringify(tokens)}`,
		)
		t.assert.snapshot(tokens)
	})

	it('emits the full `\N{name}` token sequence: escape, resourceLocation, escape', (t) => {
		const project = setupProject()
		const tokens = runColorize(project, `{"tag":"{test:'\\N{Acute Angle}'}"}`)

		t.assert.snapshot(
			tokens
				.filter(t => t.type === 'escape' || t.type === 'resourceLocation')
				.map(t => `${t.range.start}-${t.range.end}:${t.type}`),
		)
	})
})
