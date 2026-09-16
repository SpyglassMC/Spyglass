import * as core from '@spyglassmc/core/lib/index.js'
import { mockProjectData, snapshotWithUri } from '@spyglassmc/core/test/utils.ts'
import { McdocCheckerContext, typeDefinition } from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import type { SimplifiedMcdocType } from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import { LiteralNumericValue } from '@spyglassmc/mcdoc/lib/type/index.js'
import type { McdocType, UnionType } from '@spyglassmc/mcdoc/lib/type/index.js'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { module_ as binder, TypeDefSymbolData } from '../../lib/binder/index.js'
import { module_ as parser } from '../../lib/parser/index.js'
import type { McdocRuntimeError } from '../../lib/runtime/checker/error.js'
import { registerAttribute } from '../../lib/runtime/index.js'

describe('mcdoc runtime checker', () => {
	type JsValue = boolean | number | bigint | string | JsValue[] | { [key: string]: JsValue }
	const suites: Partial<
		Record<
			McdocType['kind'],
			Record<string, JsValue[] | { init: (meta: core.MetaRegistry) => void; values: JsValue[] }>
		>
	> = {
		'string': {
			'string @ ..8': [1, 'abc', 'abcdefghij'],
		},
		'byte': {
			'byte': [127n, -128n, 5n, 255n, -129n, 128n],
		},
		'int': {
			'int': [255n, 2147483647n, -2147483648n, 2147483648n, -2147483649n],
		},
		'double': {
			'double @ 3..6.2': ['hello', 1, 3, 4, 6.2, 6.3],
			'double @ 2..<4': [2, 3.99, 4],
		},
		'struct': {
			'struct { test: double }': [{ test: 1 }, { test: 'hello' }],
			'struct { foo: string, bar: [double] }': [2, {}, { foo: 'hello' }, { foo: true, bar: [] }],
			'struct { foo: string, #[filter] bar: [double] }': {
				values: [{}, { foo: 'hello' }, { foo: 'hello', bar: [2] }],
				init: (meta) =>
					registerAttribute(meta, 'filter', _ => true, { filterElement: _ => false }),
			},
			'struct { foo?: () }': [{}, { foo: 'something' }],
			'struct { pages: ([struct { raw: string, filtered?: string }] | [string]) }': [
				{ pages: [] },
				{ pages: ['foo', 'bar'] },
				{ pages: [{ raw: 'foo' }, { raw: 'bar', filtered: 'baz' }] },
				{ pages: ['foo', { raw: 'bar' }] },
			],
			'struct { ...struct { foo: double, bar: boolean }, foo: string }': [
				{},
				{ foo: 'hello' },
				{ foo: 'hello', bar: true },
				{ foo: 4, bar: false },
			],
			'struct { foo: string, ...( struct { bar: string } | struct { baz: string } ) }': [
				{},
				{ foo: 'hi' },
				{ foo: 'hi', bar: 1 },
				{ foo: 'hello', bar: 'world' },
				{ foo: 'hello', baz: 'world' },
			],
		},
		'union': {
			'(double @ 2..4 | double @ 8..)': [3, 5, 9],
			'(struct { foo: int @ 0..5 } | struct { foo: int @ 4..6 })': [{ foo: 4 }, { foo: 9 }],
			'(struct { foo: (int @ 0..5 | int @ 20..25) } | struct { foo: int @ 4..6 })': [
				{ foo: 4 },
				{ foo: 9 },
				{ foo: 23 },
			],
			'(string | #[filter] int)': {
				values: ['hello', 1],
				init: (meta) =>
					registerAttribute(meta, 'filter', _ => true, { filterElement: _ => false }),
			},
			'( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })':
				[
					{},
					{ one: 'something' },
					{ two: 91 },
					{ two: 91, three: true },
					{ two: 91, four: 91 },
					{ one: 91 },
				],
		},
		'list': {
			'[int] @ 0..5': [[], [1, 2, 3], [1, 2, 3, 4, 5, 6]],
			'[double @ 0..1] @ 1..3': [
				[],
				[0.3, 0.1],
				[0.2, 6],
				[0.3, 0.9, 0.1, 0.1],
				[2, 0.9, 0.1, 0.1],
			],
			'[struct { foo: double, bar?: boolean }]': [
				[],
				[4],
				[{}],
				[{ foo: 5 }],
				[{ foo: 2 }, { foo: 3, bar: 4 }, 'test'],
			],
		},
		'indexed': {
			'struct { foo: double, bar: string }[foo]': [{ foo: 4, bar: 'wrong' }, 5, 'hello'],
			'struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }':
				[
					{},
					{ id: 'fallback' },
					{ id: 'test' },
					{ id: 'test', config: 'hello' },
					{ id: 'test', config: 5 },
					{ id: 'test', baz: true },
					{ id: 'other' },
					{ id: 'other', baz: 'world' },
					{ id: 'other', baz: true },
				],
			'struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }':
				[
					{},
					{ id: 'fallback' },
					{ id: 'fallback', data: {} },
					{ id: 'fallback', data: { config: 'hello' } },
					{ id: 'fallback', data: { baz: true } },
					{ id: 'test', data: {} },
					{ id: 'test', data: { config: 'hello' } },
					{ id: 'test', data: { config: 5 } },
					{ id: 'test', data: { baz: true } },
					{ id: 'other', data: {} },
					{ id: 'other', data: { baz: 'world' } },
					{ id: 'other', data: { baz: true } },
				],
			'struct { test: struct { config: double }, other: struct { baz: boolean } }[%fallback]': [
				{},
				{ config: 'hello' },
				{ config: 5 },
				{ baz: 'world' },
				{ baz: true },
			],
		},
		'template': {
			'Bounds<int @ 1..> type Bounds<T> = struct { min: T, max: T }': [
				{},
				{ min: 2, max: 5 },
				{ min: 'hello', max: -1 },
			],
			'Tag<string> type Tag<V> = (V | [V])': [2, 'hello', [], ['test'], [10]],
			'Tag<string> type Tag<V> = [int, V]': ['test', [4, 5], [10, 'test'], ['foo', 'test'], [
				10,
			]],
			'Outer<string> type Inner<B> = struct { bar: B } type Outer<A> = struct { foo: Inner<[A]> }':
				[
					{ foo: 3 },
					{ foo: { bar: 'hello' } },
					{ foo: { bar: ['hello'] } },
					{ foo: { bar: [2] } },
				],
		},
		'reference': {
			'struct { foo: string, ...( struct { bar: string } | EmptyUnion ) } type EmptyUnion = ()':
				[
					{},
					{ foo: 'hi' },
					{ foo: 'hi', bar: 1 },
					{ foo: 'hello', bar: 'world' },
				],
			'struct { foo: Ref } type Ref = double': [{}, { foo: 'hello' }, { foo: 4.1 }],
		},
		'dispatcher': {
			'struct { id: string, tag?: minecraft:item[[id]] } dispatch minecraft:item[elytra] to struct { Damage: double }':
				[
					{},
					{ id: 'diamond' },
					{ id: 'elytra', tag: {} },
					{ id: 'elytra', tag: { Damage: true } },
					{ id: 'elytra', tag: { Damage: 20 } },
				],
			'struct { id: string, tag?: minecraft:item[[id]] } dispatch minecraft:item[elytra] to struct { Damage: double } #[filter] dispatch minecraft:item[filtered] to struct { Test: string }':
				{
					init: (meta) => {
						registerAttribute(meta, 'filter', _ => true, { filterElement: _ => false })
					},
					values: [{ id: 'filtered', tag: { A: 'abc' } }, { id: 'elytra', tag: {} }],
				},
		},
	}

	function inferType(value: JsValue): Exclude<McdocType, UnionType> {
		if (typeof value === 'boolean') {
			return { kind: 'boolean' }
		} else if (typeof value === 'number') {
			return { kind: 'literal', value: { kind: 'double', value: Number(value) } }
		} else if (typeof value === 'bigint') {
			return { kind: 'literal', value: { kind: 'long', value } }
		} else if (typeof value === 'string') {
			return { kind: 'literal', value: { kind: 'string', value } }
		} else if (Array.isArray(value)) {
			return { kind: 'list', item: { kind: 'any' } }
		} else if (typeof value === 'object') {
			return { kind: 'struct', fields: [] }
		} else {
			return { kind: 'any' }
		}
	}

	for (const [typeName, defs] of Object.entries(suites)) {
		const uri = new URL(`./snapshots/${typeName}.spec.ts`, import.meta.url)
		for (const [def, data] of Object.entries(defs)) {
			describe(def, async () => {
				const values = data instanceof Array ? data : data.values
				const project = mockProjectData()
				!(data instanceof Array) && data.init(project.meta)
				const doc = TextDocument.create('test.mcdoc', '', 0, '')
				const parseResult = parser(
					new core.Source(`type Test = ${def}`),
					core.ParserContext.create(project, { doc }),
				)
				if (parseResult === core.Failure) {
					throw new Error(`Failed to parse content: ${def}`)
				}
				const binderCtx = core.BinderContext.create(project, { doc })
				project.symbols.query(doc, 'mcdoc', '::test').enter({
					data: { data: { nextAnonymousIndex: 0 } },
					usage: { type: 'definition' },
				})
				await binder(parseResult, { ...binderCtx, moduleIdentifier: '::test' })

				for (const value of values) {
					it(`with value ${JSON.stringify(value, (_, v) => typeof v === 'bigint' ? `${v}n` : v)}`, (t) => {
						const errors: McdocRuntimeError<JsValue>[] = []
						const checkerCtx = core.CheckerContext.create(project, { doc })
						const typeAttachments: {
							node: JsValue
							definition: SimplifiedMcdocType
							desc?: string
						}[] = []
						const ctx = McdocCheckerContext.create<JsValue>(checkerCtx, {
							getChildren: (value) => {
								if (Array.isArray(value)) {
									return value.map((
										e,
									) => [{ originalNode: e, inferredType: inferType(e) }])
								} else if (typeof value === 'object') {
									return Object.entries(value).map(([k, v]) => ({
										key: { originalNode: k, inferredType: inferType(k) },
										possibleValues: [{ originalNode: v, inferredType: inferType(v) }],
									}))
								}
								return []
							},
							reportError: (error) => {
								errors.push(error)
							},
							tryConvertTo: (node, target) => {
								if (node instanceof Array) {
									switch (target.kind) {
										case 'list':
											return { kind: 'list', item: { kind: 'any' } }
										case 'byte_array':
										case 'int_array':
										case 'long_array':
											return { kind: target.kind }
										case 'tuple':
											return { kind: 'tuple', items: [] }
									}
								}
								if (typeof node === 'number' || typeof node === 'bigint') {
									const literalValue = LiteralNumericValue.makeIfValid(
										target.kind,
										node,
										true,
										true,
									)
									if (literalValue !== undefined) {
										return { kind: 'literal', value: literalValue }
									}
								}
								return undefined
							},
							attachTypeInfo: (node, definition, desc) => {
								typeAttachments.push({ node, definition, desc })
							},
						})
						const symbol = project.symbols.query(doc, 'mcdoc', '::test::Test')
						const data = symbol.getData(TypeDefSymbolData.is)
						if (!data?.typeDef) {
							throw new Error(`Could not resolve typedef`)
						}
						typeDefinition(
							[{ originalNode: value, inferredType: inferType(value) }],
							data.typeDef,
							ctx,
						)
						snapshotWithUri(t, { uri, value: errors })
					})
				}
			})
		}
	}
})
