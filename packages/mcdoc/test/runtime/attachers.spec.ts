import * as core from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { module_ as binder, TypeDefSymbolData } from '../../lib/binder/index.js'
import { module_ as parser } from '../../lib/parser/index.js'
import { McdocCheckerContext, typeDefinition } from '../../lib/runtime/checker/index.js'
import { registerAttribute } from '../../lib/runtime/index.js'

const AttributeName = 'test'

/**
 * A string node with the given children. The `valueMap` is empty on purpose:
 * the attribute's string parser only needs the value.
 */
function makeStringNode(children?: core.AstNode[]): core.StringNode {
	return {
		type: 'string',
		range: core.Range.create(0, 10),
		options: { quotes: ['"'] },
		value: 'hello',
		valueMap: [],
		children,
	}
}

function makeEscape(resolved: string): core.UnicodeEscapeNode {
	return {
		type: 'unicode_escape',
		kind: 'u',
		range: core.Range.create(2, 8),
		raw: '\\u0041',
		resolved,
		codepoint: resolved ? resolved.codePointAt(0)! : 0,
	}
}

interface AttacherRun {
	/** Whether the attribute's string parser was run. */
	parserRan: boolean
	/** The children of the string node after the attacher ran. */
	children: readonly core.AstNode[]
}

/**
 * Runs the mcdoc runtime checker over `node`, with a `#[test]` attribute that
 * has a string parser of its own.
 */
async function runAttachers(
	node: core.StringNode,
	opts: { errorInside?: boolean } = {},
): Promise<AttacherRun> {
	const project = mockProjectData()
	let parserRan = false
	registerAttribute(project.meta, AttributeName, () => true, {
		stringParser: () => (src) => {
			parserRan = true
			return core.LiteralNode.mock(core.Range.create(src.cursor, src.cursor), {
				pool: [],
			})
		},
	})

	const doc = TextDocument.create('test.mcdoc', '', 0, '')
	const parseResult = parser(
		new core.Source(`type Test = #[${AttributeName}] string`),
		core.ParserContext.create(project, { doc }),
	)
	if (parseResult === core.Failure) {
		throw new Error('Failed to parse the mcdoc module')
	}
	const binderCtx = core.BinderContext.create(project, { doc })
	project.symbols.query(doc, 'mcdoc', '::test').enter({
		data: { data: { nextAnonymousIndex: 0 } },
		usage: { type: 'definition' },
	})
	await binder(parseResult, { ...binderCtx, moduleIdentifier: '::test' })
	const symbol = project.symbols.query(doc, 'mcdoc', '::test::Test')
	const data = symbol.getData(TypeDefSymbolData.is)
	if (!data?.typeDef) {
		throw new Error('Could not resolve typedef')
	}

	const checkerCtx = core.CheckerContext.create(project, { doc })
	if (opts.errorInside) {
		checkerCtx.err.report('boom', core.Range.create(2, 4), core.ErrorSeverity.Error)
	}
	const ctx = McdocCheckerContext.create<core.StringNode>(checkerCtx, {
		attachTypeInfo: () => {},
		stringAttacher: (node, attacher) => {
			attacher(node)
		},
	})
	typeDefinition(
		[{ originalNode: node, inferredType: { kind: 'string' } }],
		data.typeDef,
		ctx,
	)
	return { parserRan, children: node.children ?? [] }
}

describe('mcdoc runtime attachers', () => {
	it("runs the attribute's string parser", async () => {
		const run = await runAttachers(makeStringNode())
		assert.equal(run.parserRan, true)
		assert.equal(run.children.length, 1)
	})

	describe('the guard', () => {
		it('does not run the parser when the string has an error inside it', async () => {
			const run = await runAttachers(makeStringNode(), { errorInside: true })
			assert.equal(run.parserRan, false)
			assert.deepEqual(run.children, [])
		})

		it('does not run the parser when the string has an unresolved escape', async () => {
			const escape = makeEscape('')
			const run = await runAttachers(makeStringNode([escape]))
			assert.equal(run.parserRan, false)
			// The escape child is left alone; nothing was attached to it.
			assert.deepEqual(run.children, [escape])
		})

		it('runs the parser when the escape is resolved', async () => {
			const run = await runAttachers(makeStringNode([makeEscape('\n')]))
			assert.equal(run.parserRan, true)
		})
	})

	describe('the escape children', () => {
		it('are kept when the attribute attaches a node', async () => {
			const escape = makeEscape('\n')
			const run = await runAttachers(makeStringNode([escape]))
			assert.equal(run.children.length, 2)
			// The attached node comes first, the escape children are retained
			// after it.
			assert.equal(run.children[0]!.type, 'literal')
			assert.equal(run.children[1], escape)
		})

		it('keep their hover', async () => {
			const escape = makeEscape('A')
			escape.hover = "[ A ] 'Latin Capital Letter A' - `U+0041`"
			const run = await runAttachers(makeStringNode([escape]))
			const retained = run.children.find(core.UnicodeEscapeNode.is)
			assert.ok(retained)
			assert.equal(retained.hover, escape.hover)
		})
	})
})
