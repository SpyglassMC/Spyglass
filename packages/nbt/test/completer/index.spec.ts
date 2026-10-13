import * as core from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import {
	getUnicodeData,
	unicodeSymbolRegistrar,
} from '@spyglassmc/java-edition/lib/dependency/index.js'
import * as nbt from '@spyglassmc/nbt/lib/index.js'
import type { NbtCompoundNode, NbtStringNode } from '@spyglassmc/nbt/lib/node/index.js'
import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'

/**
 * End-to-end completer coverage for the regressions fixed in this branch.
 * Each case parses real NBT, then drives the completer the way the LSP
 * server does: with-quote cases dispatch into `nbt:string` on the parsed
 * value node, no-quote cases dispatch into `nbt:compound` on the record
 * (since the parser does not produce a value node for an empty unquoted
 * position).
 */
describe('nbt completer (end-to-end)', () => {
	function setup(content: string, cursorOffset: number) {
		const project = mockProjectData({})
		nbt.initialize({ meta: project.meta } as any)
		// The `\\N{…}` Unicode-name completer reads from the `unicode-name`
		// symbol category. Register the bundled Unicode data so completions
		// are non-empty. The `java-edition` registrar is the source of the
		// data; we pull it in directly to avoid wiring up the rest of the
		// edition package (which the test project can't host cleanly).
		const data = getUnicodeData()
		project.meta.registerSymbolRegistrar('unicode-data', {
			checksum: data.checksum,
			registrar: unicodeSymbolRegistrar(data),
		})
		for (const [id, { registrar }] of project.meta.symbolRegistrars) {
			project.symbols.contributeAs(`symbol_registrar/${id}`, () => {
				registrar(project.symbols, {})
				return undefined
			})
		}
		const doc = TextDocument.create('', 'snbt', 0, content)
		const node = nbt.parser.entry(
			new core.Source(content),
			core.ParserContext.create(project, { doc }),
		) as NbtCompoundNode
		return { project, doc, node, offset: cursorOffset }
	}

	function attachEnum(
		node: { typeDef?: unknown },
		values: readonly string[],
	): void {
		node.typeDef = {
			kind: 'enum',
			enumKind: 'string',
			values: values.map((v) => ({ value: v, identifier: v })),
		}
	}

	function completeAt(
		node: core.AstNode,
		project: core.ProjectData,
		doc: TextDocument,
		offset: number,
	) {
		const ctx = core.CompleterContext.create(project, { doc, offset })
		const child = core.AstNode.findShallowestChild({
			node,
			needle: offset,
			endInclusive: true,
			predicate: (n) => project.meta.hasCompleter(n.type),
		})
		const items = child
			? project.meta.getCompleter(child.type)(child, ctx)
			: []
		if (items.length === 0) {
			console.error('[spyglass/completer-test] first=<none> count=0')
		} else {
			const first = items[0]
			console.error(
				`[spyglass/completer-test] first label=${JSON.stringify(first.label)} `
					+ `insertText=${
						JSON.stringify(first.insertText ?? first.label)
					} count=${items.length}`,
			)
		}
		return items
	}

	it('returns enum values for an empty unquoted value (no-quote path)', () => {
		const { project, doc, node, offset } = setup('{billboard: }', '{billboard: '.length)
		// Simulate the checker attaching a struct typeDef to the record with
		// an enum field for `billboard`. Drives the compound value branch of
		// the completer (no parsed value node).
		attachEnum(node, [])
		;(node.typeDef as any) = {
			kind: 'struct',
			fields: [{
				kind: 'pair',
				key: { kind: 'literal', value: { kind: 'string', value: 'billboard' } },
				type: {
					kind: 'enum',
					enumKind: 'string',
					values: ['center', 'fixed'].map((v) => ({ value: v, identifier: v })),
				},
			}],
		}
		const items = completeAt(node, project, doc, offset)
		const labels = items.map((i) => i.label).sort()
		assert.deepEqual(labels, ['center', 'fixed'])
	})

	it('returns enum values inside a quoted empty literal (with-quote path)', () => {
		const { project, doc, node, offset } = setup('{billboard: ""}', '{billboard: "'.length)
		const pair = node.children[0]!
		const stringNode = pair.value as NbtStringNode
		attachEnum(stringNode, ['center', 'fixed'])
		const items = completeAt(node, project, doc, offset)
		const labels = items.map((i) => i.label).sort()
		assert.deepEqual(labels, ['center', 'fixed'])
		// No empty-pair snippet pollution (regression from PR #1953).
		assert.equal(
			items.find((i) => i.label === '""' || i.label === "''"),
			undefined,
		)
	})

	it("uses the node's quote when wrapping enum values (single-quote)", () => {
		const { project, doc, node, offset } = setup("{billboard: ''}", "{billboard: '".length)
		const pair = node.children[0]!
		const stringNode = pair.value as NbtStringNode
		attachEnum(stringNode, ['center'])
		const items = completeAt(node, project, doc, offset)
		const center = items.find((i) => i.label === 'center')!
		// formatValue must use the node's quote (`'`), not the hardcoded `"`,
		// otherwise the trigger-character filtering on the client drops the
		// item and the accepted result is a mismatched quote pair.
		assert.equal(center.insertText, "'center'")
	})

	it("uses the node's quote when wrapping enum values (double-quote)", () => {
		const { project, doc, node, offset } = setup('{billboard: ""}', '{billboard: "'.length)
		const pair = node.children[0]!
		const stringNode = pair.value as NbtStringNode
		attachEnum(stringNode, ['center'])
		const items = completeAt(node, project, doc, offset)
		const center = items.find((i) => i.label === 'center')!
		assert.equal(center.insertText, '"center"')
	})

	it('unwraps `mapped` types via the runtime completer (no-quote, nested)', () => {
		// Reproduces `{item: {id: |}}` — the original "0 items, no completion"
		// bug for a nested no-quote field whose declared type is a generic
		// (the checker rewrites it to `mapped(T, ...)`).
		const { project, doc, node, offset } = setup('{item: {id: }}', '{item: {id: '.length)
		const outerPair = node.children[0]!
		const innerCompound = outerPair.value as NbtCompoundNode
		attachEnum(innerCompound, [])
		;(innerCompound.typeDef as any) = {
			kind: 'struct',
			fields: [{
				kind: 'pair',
				key: { kind: 'literal', value: { kind: 'string', value: 'id' } },
				type: {
					kind: 'mapped',
					mapping: {},
					child: { kind: 'literal', value: { kind: 'string', value: 'minecraft:stone' } },
				},
			}],
		}
		const items = completeAt(node, project, doc, offset)
		assert.deepEqual(items.map((i) => i.label), ['minecraft:stone'])
	})

	it('inserts with double quotes when nested field is double-quoted', () => {
		const { project, doc, node, offset } = setup('{item: {id: ""}}', '{item: {id: "'.length)
		const outerPair = node.children[0]!
		const innerCompound = outerPair.value as NbtCompoundNode
		const innerPair = innerCompound.children[0]!
		const stringNode = innerPair.value as NbtStringNode
		stringNode.typeDef = {
			kind: 'literal',
			value: { kind: 'string', value: 'minecraft:stone' },
		} as any
		const items = completeAt(node, project, doc, offset)
		const id = items.find((i) => i.label === 'minecraft:stone')!
		assert.equal(id.insertText, '"minecraft:stone"')
	})

	it('inserts with single quotes when nested field is single-quoted', () => {
		const { project, doc, node, offset } = setup("{item: {id: ''}}", "{item: {id: '".length)
		const outerPair = node.children[0]!
		const innerCompound = outerPair.value as NbtCompoundNode
		const innerPair = innerCompound.children[0]!
		const stringNode = innerPair.value as NbtStringNode
		stringNode.typeDef = {
			kind: 'literal',
			value: { kind: 'string', value: 'minecraft:stone' },
		} as any
		const items = completeAt(node, project, doc, offset)
		const id = items.find((i) => i.label === 'minecraft:stone')!
		assert.equal(id.insertText, "'minecraft:stone'")
	})

	it('keeps the empty-pair snippet for bare strings with no typeDef', () => {
		// Regression guard: `wouldOnlyEmitEmptyPairSnippet` must only suppress
		// the `""` / `''` snippet when a better set of completions is
		// available. Without a typeDef, the snippet is the only sensible
		// thing to show for an empty literal.
		const { project, doc, node, offset } = setup('{name: ""}', '{name: ""'.length - 1)
		const items = completeAt(node, project, doc, offset)
		const labels = items.map((i) => i.label)
		assert.ok(
			labels.includes('""'),
			`expected empty-pair suggestion, got ${JSON.stringify(labels)}`,
		)
	})

	it('merges `\\N{…}` Unicode-name completions with typeDef values', () => {
		// Cursor is inside `\\N{snow|`, so core.completer.string's Unicode
		// matcher is active; a typeDef is attached too, so the mcdoc values
		// must also surface alongside the names.
		const content = '{name: "\\N{snow"}'
		const offset = '{name: "\\N{snow'.length
		const { project, doc, node } = setup(content, offset)
		const pair = node.children[0]!
		const stringNode = pair.value as NbtStringNode
		stringNode.typeDef = {
			kind: 'enum',
			enumKind: 'string',
			values: [{ value: 'override', identifier: 'override' }],
		}
		const items = completeAt(node, project, doc, offset)
		const labels = items.map((i) => i.label)
		assert.ok(
			labels.includes('Snowman'),
			`expected Snowman Unicode name in ${JSON.stringify(labels)}`,
		)
		assert.ok(
			labels.includes('override'),
			`expected mcdoc enum value in ${JSON.stringify(labels)}`,
		)
	})

	it('merges child-completer items (e.g. `#[command] string`) with typeDef values', () => {
		// The `nbt:string` node carries a child completer result (what a
		// string-parser attribute like `#[command] string` would attach).
		// The completer must dispatch to the child AND surface the typeDef
		// values rather than dropping either side.
		const content = '{attr: "minecraft:generic"}'
		const offset = '{attr: "'.length
		const { project, doc, node } = setup(content, offset)
		const pair = node.children[0]!
		const stringNode = pair.value as NbtStringNode
		const childNode = core.ResourceLocationNode.mock(stringNode.range, {
			category: 'attribute',
		})
		stringNode.children = [childNode]
		stringNode.typeDef = {
			kind: 'enum',
			enumKind: 'string',
			values: [{ value: 'from_typeDef', identifier: 'from_typeDef' }],
		}
		const items = completeAt(node, project, doc, offset)
		const labels = items.map((i) => i.label)
		// The child completer surfaces attribute IDs (whatever is registered
		// under the `attribute` category), and the typeDef values come
		// through alongside.
		assert.ok(
			labels.includes('from_typeDef'),
			`expected typeDef value in ${JSON.stringify(labels)}`,
		)
		// We don't pin specific attribute IDs - the bundled attribute
		// registry isn't wired in here - but at minimum the child side
		// shouldn't have *replaced* the typeDef items.
		assert.ok(items.length >= 1, 'expected at least one completion item')
	})

	it('offers completions while typing a `\\N{…}` escape inside a resource location', () => {
		// `{attr: "test:\N{|"}` - the cursor sits inside a partial named
		// Unicode escape. The resulting chars aren't a valid resource
		// location, but the user is mid-typing and the completer must still
		// surface both the Unicode-name candidates and any typeDef values
		// rather than silently going empty.
		const content = '{attr: "test:\\N{|}"}'
		const offset = '{attr: "test:\\N{'.length
		const { project, doc, node } = setup(content, offset)
		const pair = node.children[0]!
		const stringNode = pair.value as NbtStringNode
		const childNode = core.ResourceLocationNode.mock(stringNode.range, {
			category: 'attribute',
		})
		stringNode.children = [childNode]
		stringNode.typeDef = {
			kind: 'enum',
			enumKind: 'string',
			values: [{ value: 'from_typeDef', identifier: 'from_typeDef' }],
		}
		const items = completeAt(node, project, doc, offset)
		const labels = items.map((i) => i.label)
		// Both the typeDef enum value and the bundled Unicode-name
		// completions should be reachable. We don't pin specific Unicode
		// identifiers, but there must be *some* candidate (the bundled
		// table has tens of thousands of entries).
		assert.ok(
			labels.includes('from_typeDef'),
			`expected typeDef value in ${JSON.stringify(labels.slice(0, 10))}...`,
		)
		assert.ok(
			items.length > 1,
			`expected completions to surface (got ${items.length} items)`,
		)
	})
})
