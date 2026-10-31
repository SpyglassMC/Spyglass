import * as core from '@spyglassmc/core'
import { ColorizerContext } from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import type { McdocType } from '@spyglassmc/mcdoc/lib/type/index.js'
import * as nbt from '@spyglassmc/nbt/lib/index.js'
import { registerMcdocAttributes } from '@spyglassmc/nbt/lib/mcdocAttributes.js'
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

	it('emits all tokens in the named Unicode escape correctly', (t) => {
		const project = setupProject()
		const tokens = runColorize(project, `{"tag":"{test:'\\N{Acute Angle}'}"}`)

		t.assert.snapshot(tokens)
	})
})
