import * as core from '@spyglassmc/core/lib/index.js'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import { localeQuote } from '@spyglassmc/locales'
import { McdocCheckerContext, typeDefinition, type SimplifiedMcdocType } from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import {
	LiteralNumericValue,
	type McdocType,
	type UnionType,
} from '@spyglassmc/mcdoc/lib/type/index.js'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { McdocRuntimeError } from '../../lib/runtime/checker/error.js'
import { registerAttribute } from '../../lib/runtime/index.js'
import { module_ as parser } from '../../lib/parser/index.js'
import { module_ as binder, TypeDefSymbolData } from '../../lib/binder/index.js'

describe('mcdoc runtime checker', () => {
	type JsValue = boolean | number | bigint | string | JsValue[] | { [key: string]: JsValue }
	const suites: {
		mcdoc: string
		init?: (meta: core.MetaRegistry) => void
		values: JsValue[]
	}[] = [{
		mcdoc: 'struct { test: double }',
		values: [{ test: 1 }, { test: 'hello' }],
	}, {
		mcdoc: 'struct { foo: string, bar: [double] }',
		values: [2, {}, { foo: 'hello' }, { foo: true, bar: [] }],
	}, {
		mcdoc: 'struct { foo: string, #[filter] bar: [double] }',
		values: [{}, { foo: 'hello' }, { foo: 'hello', bar: [2] }],
		init: (meta) =>
			registerAttribute(meta, 'filter', _ => true, { filterElement: _ => false }),
	}, {
		mcdoc: '( struct { text: string } | struct { selector: double })',
		values: [{}, { text: 'something' }, { selector: 20 }, { text: 'foo', selector: 40 }, {
			selector: [1],
		}],
	}, {
		mcdoc: '( string | #[filter] int)',
		values: ['hello', 1],
		init: (meta) =>
			registerAttribute(meta, 'filter', _ => true, { filterElement: _ => false }),
	}, {
		mcdoc:
			'( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })',
		values: [
			{},
			{ one: 'something' },
			{ two: 91 },
			{ two: 91, three: true },
			{ two: 91, four: 91 },
			{ one: 91 },
		],
	}, {
		mcdoc: '[struct { foo: double, bar?: boolean }]',
		values: [[], [4], [{}], [{ foo: 5 }], [{ foo: 2 }, { foo: 3, bar: 4 }, 'test']],
	}, {
		mcdoc: 'struct { pages: ([struct { raw: string, filtered?: string }] | [string]) }',
		values: [{ pages: [] }, { pages: ['foo', 'bar'] }, {
			pages: [{ raw: 'foo' }, { raw: 'bar', filtered: 'baz' }],
		}, { pages: ['foo', { raw: 'bar' }] }],
	}, {
		mcdoc: 'struct { ...struct { foo: double, bar: boolean }, foo: string }',
		values: [{}, { foo: 'hello' }, { foo: 'hello', bar: true }, { foo: 4, bar: false }],
	}, {
		mcdoc: 'struct { foo: double, bar: string }[foo]',
		values: [{ foo: 4, bar: 'wrong' }, 5, 'hello'],
	}, {
		mcdoc:
			'struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }',
		values: [
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
	}, {
		mcdoc: 'struct { foo?: () }',
		values: [
			{},
			{ foo: 'something' },
		],
	}, {
		mcdoc: 'double @ 3..6.2',
		values: ['hello', 1, 3, 4, 6.2, 6.3],
	}, {
		mcdoc: 'double @ 2..<4',
		values: [2, 3.99, 4],
	}, {
		mcdoc: '(double @ 2..4 | double @ 8..)',
		values: [3, 5, 9],
	}, {
		mcdoc: '(struct { foo: int @ 0..5 } | struct { foo: int @ 4..6 })',
		values: [{ foo: 4 }, { foo: 9 }],
	}, {
		mcdoc: '(struct { foo: (int @ 0..5 | int @ 20..25) } | struct { foo: int @ 4..6 })',
		values: [{ foo: 4 }, { foo: 9 }, { foo: 23 }],
	}, {
		mcdoc: '[int] @ 0..5',
		values: [[], [1, 2, 3], [1, 2, 3, 4, 5, 6]],
	}, {
		mcdoc: '[double @ 0..1] @ 1..3',
		values: [[], [0.3, 0.1], [0.2, 6], [0.3, 0.9, 0.1, 0.1], [2, 0.9, 0.1, 0.1]],
	}, {
		mcdoc: 'string @ ..8',
		values: [1, 'abc', 'abcdefghij'],
	}, {
		mcdoc:
			'struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }',
		values: [
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
	}, {
		mcdoc: 'struct { test: struct { config: double }, other: struct { baz: boolean } }[%fallback]',
		values: [
			{},
			{ config: 'hello' },
			{ config: 5 },
			{ baz: 'world' },
			{ baz: true },
		],
	}, {
		mcdoc: 'struct { foo: string, ...( struct { bar: string } | struct { baz: string } ) }',
		values: [
			{},
			{ foo: 'hi' },
			{ foo: 'hi', bar: 1 },
			{ foo: 'hello', bar: 'world' },
			{ foo: 'hello', baz: 'world' },
		],
	}, {
		mcdoc:
			`struct { foo: string, ...( struct { bar: string } | EmptyUnion ) }
type EmptyUnion = ()`,
		values: [
			{},
			{ foo: 'hi' },
			{ foo: 'hi', bar: 1 },
			{ foo: 'hello', bar: 'world' },
		],
	}, {
		mcdoc: `Bounds<int @ 1..>
type Bounds<T> = struct { min: T, max: T }`,
		values: [{}, { min: 2, max: 5 }, { min: 'hello', max: -1 }],
	}, {
		mcdoc: 'type Tag<V> = (V | [V]); Tag<string>',
		values: [2, 'hello', [], ['test'], [10]],
	}, {
		mcdoc: `Tag<string>
type Tag<V> = [int, V]`,
		values: ['test', [4, 5], [10, 'test'], ['foo', 'test'], [10]],
	}, {
		mcdoc: `Outer<string>
type Inner<B> = struct { bar: B }
type Outer<A> = struct { foo: Inner<[A]> }`,
		values: [{ foo: 3 }, { foo: { bar: 'hello' } }, { foo: { bar: ['hello'] } }, {
			foo: { bar: [2] },
		}],
	}, {
		mcdoc: `struct { foo: Ref }
type Ref = double`,
		values: [{}, { foo: 'hello' }, { foo: 4.1 }],
	}, {
		mcdoc: `struct { id: string, tag?: minecraft:item[[id]] }
dispatch minecraft:item[elytra] to struct { Damage: double }`,
		values: [{}, { id: 'diamond' }, { id: 'elytra', tag: {} }, {
			id: 'elytra',
			tag: { Damage: true },
		}, { id: 'elytra', tag: { Damage: 20 } }],
	}, {
		mcdoc: `struct { id: string, tag?: minecraft:item[[id]] }
dispatch minecraft:item[elytra] to struct { Damage: double }
#[filter] dispatch minecraft:item[filtered] to struct { Test: string }`,
		init: (meta) => {
			registerAttribute(meta, 'filter', _ => true, { filterElement: _ => false })
		},
		values: [{ id: 'filtered', tag: { A: 'abc' } }, { id: 'elytra', tag: {} }],
	}, {
		mcdoc: 'byte',
		values: [127n, -128n, 5n, 255n, -129n, 128n],
	}, {
		mcdoc: 'int',
		values: [255n, 2147483647n, -2147483648n, 2147483648n, -2147483649n],
	}]

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

	for (const { mcdoc, values, init } of suites) {
		describe(`typeDefinition ${localeQuote(mcdoc)}`, () => {
			for (const value of values) {
				it(`with value ${JSON.stringify(value, (_, v) => typeof v === 'bigint' ? `${v}n` : v)}`, async (t) => {
					const errors: McdocRuntimeError<JsValue>[] = []
					const project = mockProjectData()
					init?.(project.meta)

					const doc = TextDocument.create('test.mcdoc', '', 0, '')
					const parseResult = parser(
						new core.Source(mcdoc),
						core.ParserContext.create(project, { doc }),
					)
					if (parseResult === core.Failure) {
						throw new Error(`Failed to parse content: ${mcdoc}`)
					}
					const binderCtx = core.BinderContext.create(project, { doc })
					project.symbols.query(doc, 'mcdoc', '::test').enter({
						data: { data: {nextAnonymousIndex: 0 } },
						usage: { type: 'definition' }
					})
					await binder(parseResult, { ... binderCtx, moduleIdentifier: '::test' })
					const checkerCtx = core.CheckerContext.create(project, { doc })
					const typeAttachments: { node: JsValue, definition: SimplifiedMcdocType, desc?: string }[] = []
					const ctx = McdocCheckerContext.create<JsValue>(checkerCtx, {
						getChildren: (value) => {
							if (Array.isArray(value)) {
								return value.map((e) => [{ originalNode: e, inferredType: inferType(e) }])
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
							typeAttachments.push({node, definition, desc})
						}
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
					t.assert.snapshot(errors)
				})
			}
		})
	}
})
