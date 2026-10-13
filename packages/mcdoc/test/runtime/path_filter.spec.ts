import * as core from '@spyglassmc/core/lib/index.js'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import { localeQuote } from '@spyglassmc/locales'
import {
	McdocCheckerContext,
	type McdocRuntimeError,
	type RuntimeUnion,
	type SimplifiedMcdocType,
	typeDefinition,
} from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import type { McdocType, UnionType } from '@spyglassmc/mcdoc/lib/type/index.js'
import { describe, it, type TestContext } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('mcdoc runtime: nbt path filter dispatching', () => {
	type JsValue = string | number | { [key: string]: JsValue }
	interface PathValue {
		value: JsValue
		filter?: JsValue
		path: string
	}
	const suites: {
		name: string
		type: McdocType
		init?: (symbols: core.SymbolUtil, meta: core.MetaRegistry) => void
		values: {
			name: string
			value: JsValue
			filter?: JsValue
			expected: string[]
		}[]
	}[] = [
		{
			name: 'struct { id: string, tag: minecraft:item[[id]] }',
			type: {
				kind: 'struct',
				fields: [{ kind: 'pair', key: 'id', type: { kind: 'string' } }, {
					kind: 'pair',
					key: 'tag',
					type: {
						kind: 'dispatcher',
						registry: 'minecraft:item',
						parallelIndices: [{ kind: 'dynamic', accessor: ['id'] }],
					},
				}],
			},
			init: registerItems,
			values: [{
				name: 'falls back to path data when no filter is supplied',
				value: { id: 'elytra', tag: {} },
				expected: ['Damage'],
			}, {
				name: 'resolves a dispatcher key present in the filter',
				value: { tag: {} },
				filter: { id: 'elytra' },
				expected: ['Damage'],
			}, {
				name: 'changes subsequent fields when the filter changes',
				value: { tag: {} },
				filter: { id: 'book' },
				expected: ['pages'],
			}, {
				name: 'prefers filter data over path data',
				value: { id: 'elytra', tag: {} },
				filter: { id: 'book' },
				expected: ['pages'],
			}, {
				name: 'uses the default type for an empty filter',
				value: { id: 'elytra', tag: {} },
				filter: {},
				expected: ['fallback'],
			}, {
				name: 'does not fall back to path data for a non-compound filter',
				value: { id: 'elytra', tag: {} },
				filter: 1,
				expected: ['fallback'],
			}, {
				name: 'uses the default type if the filter does not contain the dispatcher key',
				value: { tag: {} },
				filter: { other: 'book' },
				expected: ['fallback'],
			}],
		},
		{
			name: 'struct { tag: minecraft:item[[nested.id]] }',
			type: {
				kind: 'struct',
				fields: [{
					kind: 'pair',
					key: 'tag',
					type: {
						kind: 'dispatcher',
						registry: 'minecraft:item',
						parallelIndices: [{ kind: 'dynamic', accessor: ['nested', 'id'] }],
					},
				}],
			},
			init: registerItems,
			values: [{
				name: 'traverses nested filter compound tag',
				value: { tag: {} },
				filter: { nested: { id: 'elytra' } },
				expected: ['Damage'],
			}, {
				name: 'changes type using a nested dispatcher key',
				value: { tag: {} },
				filter: { nested: { id: 'book' } },
				expected: ['pages'],
			}, {
				name: 'handles a missing nested dispatcher key',
				value: { tag: {} },
				filter: { nested: {} },
				expected: ['fallback'],
			}, {
				name: 'handles a non-compound type in filter',
				value: { tag: {} },
				filter: { nested: 1 },
				expected: ['fallback'],
			}],
		},
	]

	function registerItems(symbols: core.SymbolUtil) {
		const doc = TextDocument.create('', '', 0, '')
		symbols.query(doc, 'mcdoc/dispatcher', 'minecraft:item')
			.enter({ usage: { type: 'reference' } })
		for (const [id, key] of [['elytra', 'Damage'], ['book', 'pages'], ['%none', 'fallback']]) {
			symbols.query(doc, 'mcdoc/dispatcher', 'minecraft:item', id).enter({
				usage: { type: 'definition' },
				data: {
					data: {
						typeDef: {
							kind: 'struct',
							fields: [{ kind: 'pair', key, type: { kind: 'string' } }],
						} satisfies McdocType,
					},
				},
			})
		}
	}

	function inferType(value: JsValue): Exclude<McdocType, UnionType> {
		if (typeof value === 'string') {
			return { kind: 'literal', value: { kind: 'string', value } }
		} else if (typeof value === 'number') {
			return { kind: 'literal', value: { kind: 'double', value } }
		}
		return { kind: 'struct', fields: [] }
	}

	function getChildren(node: PathValue): RuntimeUnion<PathValue>[] {
		if (typeof node.value !== 'object') {
			return []
		}
		return Object.entries(node.value).map(([key, value]) => ({
			key: {
				originalNode: { value: key, path: `${node.path}.${key}` },
				inferredType: inferType(key),
			},
			possibleValues: [{
				originalNode: {
					value,
					filter: typeof node.filter === 'object' ? node.filter[key] : undefined,
					path: `${node.path}.${key}`,
				},
				inferredType: inferType(value),
			}],
		}))
	}

	for (const { name, type, values, init } of suites) {
		describe(`typeDefinition ${localeQuote(name)}`, () => {
			for (const { name, value, filter, expected } of values) {
				it(`with filter ${JSON.stringify(filter)}: ${name}`, (t: TestContext) => {
					const errors: McdocRuntimeError<PathValue>[] = []
					const types: Record<string, SimplifiedMcdocType> = {}
					const project = mockProjectData()
					init?.(project.symbols, project.meta)
					const checkerCtx = core.CheckerContext.create(project, {
						doc: TextDocument.create('', '', 0, ''),
					})
					const ctx = McdocCheckerContext.create<PathValue>(checkerCtx, {
						allowMissingKeys: true,
						getChildren,
						getChildrenFromFilterData: (node) => {
							if (node.filter === undefined) {
								return undefined
							}
							return getChildren({
								value: node.filter,
								filter: node.filter,
								path: node.path,
							})
						},
						reportError: error => errors.push(error),
						attachTypeInfo: (node, definition) => {
							if (typeof node.value === 'object') {
								types[node.path] = definition
							}
						},
					})
					typeDefinition(
						[{ originalNode: { value, filter, path: '' }, inferredType: inferType(value) }],
						type,
						ctx,
					)
					const tagType = types['.tag']
					t.assert.strictEqual(tagType?.kind, 'struct')
					if (tagType?.kind === 'struct') {
						t.assert.deepStrictEqual(
							tagType.fields.map(field =>
								field.key.kind === 'literal' ? field.key.value.value : undefined
							).sort(),
							expected,
						)
					}
					t.assert.deepStrictEqual(errors, [])
					t.assert.snapshot({ errors, type: tagType })
				})
			}
		})
	}
})
