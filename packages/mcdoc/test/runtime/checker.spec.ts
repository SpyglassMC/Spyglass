import * as core from '@spyglassmc/core/lib/index.js'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import { localeQuote } from '@spyglassmc/locales'
import { McdocCheckerContext, typeDefinition } from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import type { McdocType, UnionType } from '@spyglassmc/mcdoc/lib/type/index.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { McdocRuntimeError } from '../../lib/runtime/checker/error.js'

describe('mcdoc runtime checker', () => {
	type JsValue = boolean | number | string | JsValue[] | { [key: string]: JsValue }
	const suites: {
		name: string
		type: McdocType
		init?: (symbols: core.SymbolUtil) => void
		values: JsValue[]
	}[] = [{
		name: 'struct { test: double }',
		type: { kind: 'struct', fields: [{ kind: 'pair', key: 'test', type: { kind: 'double' } }] },
		values: [{ test: 1 }, { test: 'hello' }],
	}, {
		name: 'struct { foo: string, bar: [double] }',
		type: {
			kind: 'struct',
			fields: [{ kind: 'pair', key: 'foo', type: { kind: 'string' } }, {
				kind: 'pair',
				key: 'bar',
				type: { kind: 'list', item: { kind: 'double' } },
			}],
		},
		values: [2, {}, { foo: 'hello' }, { foo: true, bar: [] }],
	}, {
		name: '( struct { text: string } | struct { selector: number })',
		type: {
			kind: 'union',
			members: [{
				kind: 'struct',
				fields: [{ kind: 'pair', key: 'text', type: { kind: 'string' } }],
			}, {
				kind: 'struct',
				fields: [{ kind: 'pair', key: 'selector', type: { kind: 'double' } }],
			}],
		},
		values: [{}, { text: 'something' }, { selector: 20 }, { text: 'foo', selector: 40 }, {
			selector: [1],
		}],
	}, {
		name:
			'( struct { one?: string, two?: int, three?: boolean } | struct { one?: string, four?: int, five?: boolean })',
		type: {
			kind: 'union',
			members: [{
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'one', optional: true, type: { kind: 'string' } },
					{ kind: 'pair', key: 'two', optional: true, type: { kind: 'int' } },
					{ kind: 'pair', key: 'three', optional: true, type: { kind: 'boolean' } },
				],
			}, {
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'one', optional: true, type: { kind: 'string' } },
					{ kind: 'pair', key: 'four', optional: true, type: { kind: 'int' } },
					{ kind: 'pair', key: 'five', optional: true, type: { kind: 'boolean' } },
				],
			}],
		},
		values: [
			{},
			{ one: 'something' },
			{ two: 91 },
			{ two: 91, three: true },
			{ two: 91, four: 91 },
			{ one: 91 },
		],
	}, {
		name: '[struct { foo: double, bar?: boolean }]',
		type: {
			kind: 'list',
			item: {
				kind: 'struct',
				fields: [{ kind: 'pair', key: 'foo', type: { kind: 'double' } }, {
					kind: 'pair',
					key: 'bar',
					optional: true,
					type: { kind: 'boolean' },
				}],
			},
		},
		values: [[], [4], [{}], [{ foo: 5 }], [{ foo: 2 }, { foo: 3, bar: 4 }, 'test']],
	}, {
		name: 'struct { pages: ([struct { raw: string, filtered?: string }] | [string]) }',
		type: {
			kind: 'struct',
			fields: [{
				kind: 'pair',
				key: 'pages',
				type: {
					kind: 'union',
					members: [{
						kind: 'list',
						item: {
							kind: 'struct',
							fields: [{ kind: 'pair', key: 'raw', type: { kind: 'string' } }, {
								kind: 'pair',
								key: 'filtered',
								optional: true,
								type: { kind: 'string' },
							}],
						},
					}, { kind: 'list', item: { kind: 'string' } }],
				},
			}],
		},
		values: [{ pages: [] }, { pages: ['foo', 'bar'] }, {
			pages: [{ raw: 'foo' }, { raw: 'bar', filtered: 'baz' }],
		}, { pages: ['foo', { raw: 'bar' }] }],
	}, {
		name: 'struct { ...struct { foo: double, bar: boolean }, foo: string }',
		type: {
			kind: 'struct',
			fields: [{
				kind: 'spread',
				type: {
					kind: 'struct',
					fields: [{ kind: 'pair', key: 'foo', type: { kind: 'double' } }, {
						kind: 'pair',
						key: 'bar',
						type: { kind: 'boolean' },
					}],
				},
			}, { kind: 'pair', key: 'foo', type: { kind: 'string' } }],
		},
		values: [{}, { foo: 'hello' }, { foo: 'hello', bar: true }, { foo: 4, bar: false }],
	}, {
		name: 'struct { foo: double, bar: string }[foo]',
		type: {
			kind: 'indexed',
			child: {
				kind: 'struct',
				fields: [{ kind: 'pair', key: 'foo', type: { kind: 'double' } }, {
					kind: 'pair',
					key: 'bar',
					type: { kind: 'string' },
				}],
			},
			parallelIndices: [{ kind: 'static', value: 'foo' }],
		},
		values: [{ foo: 4, bar: 'wrong' }, 5, 'hello'],
	}, {
		name:
			'struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }',
		type: {
			kind: 'struct',
			fields: [{ kind: 'pair', key: 'id', type: { kind: 'string' } }, {
				kind: 'spread',
				type: {
					kind: 'indexed',
					child: {
						kind: 'struct',
						fields: [{
							kind: 'pair',
							key: 'test',
							type: {
								kind: 'struct',
								fields: [{ kind: 'pair', key: 'config', type: { kind: 'double' } }],
							},
						}, {
							kind: 'pair',
							key: 'other',
							type: {
								kind: 'struct',
								fields: [{ kind: 'pair', key: 'baz', type: { kind: 'boolean' } }],
							},
						}],
					},
					parallelIndices: [{ kind: 'dynamic', accessor: ['id'] }],
				},
			}],
		},
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
		name: 'struct { foo?: () }',
		type: {
			kind: 'struct',
			fields: [{
				kind: 'pair',
				key: 'foo',
				optional: true,
				type: { kind: 'union', members: [] },
			}],
		},
		values: [
			{},
			{ foo: 'something' },
		],
	}, {
		name: 'double @ 3..6.2',
		type: { kind: 'double', valueRange: { kind: 0b00, min: 3, max: 6.2 } },
		values: ['hello', 1, 3, 4, 6.2, 6.3],
	}, {
		name: 'double @ 2..<4',
		type: { kind: 'double', valueRange: { kind: 0b01, min: 2, max: 4 } },
		values: [2, 3.99, 4],
	}, {
		name: '(double @ 2..4 | double @ 8..)',
		type: {
			kind: 'union',
			members: [{ kind: 'double', valueRange: { kind: 0b00, min: 2, max: 4 } }, {
				kind: 'double',
				valueRange: { kind: 0b00, min: 8 },
			}],
		},
		values: [3, 5, 9],
	}, {
		name: '(struct { foo: int @ 0..5 } | struct { foo: int @ 4..6 })',
		type: {
			kind: 'union',
			members: [{
				kind: 'struct',
				fields: [{
					kind: 'pair',
					key: 'foo',
					type: { kind: 'int', valueRange: { kind: 0b00, min: 0, max: 5 } },
				}],
			}, {
				kind: 'struct',
				fields: [{
					kind: 'pair',
					key: 'foo',
					type: { kind: 'int', valueRange: { kind: 0b00, min: 4, max: 6 } },
				}],
			}],
		},
		values: [{ foo: 4 }, { foo: 9 }],
	}, {
		name: '(struct { foo: (int @ 0..5 | int @ 20..25) } | struct { foo: int @ 4..6 })',
		type: {
			kind: 'union',
			members: [{
				kind: 'struct',
				fields: [{
					kind: 'pair',
					key: 'foo',
					type: {
						kind: 'union',
						members: [{ kind: 'int', valueRange: { kind: 0b00, min: 0, max: 5 } }, {
							kind: 'int',
							valueRange: { kind: 0b00, min: 20, max: 25 },
						}],
					},
				}],
			}, {
				kind: 'struct',
				fields: [{
					kind: 'pair',
					key: 'foo',
					type: { kind: 'int', valueRange: { kind: 0b00, min: 4, max: 6 } },
				}],
			}],
		},
		values: [{ foo: 4 }, { foo: 9 }, { foo: 23 }],
	}, {
		name: '[int] @ 0..5',
		type: { kind: 'list', item: { kind: 'int' }, lengthRange: { kind: 0b00, min: 0, max: 5 } },
		values: [[], [1, 2, 3], [1, 2, 3, 4, 5, 6]],
	}, {
		name: '[double @ 0..1] @ 1..3',
		type: {
			kind: 'list',
			item: { kind: 'double', valueRange: { kind: 0b00, min: 0, max: 1 } },
			lengthRange: { kind: 0b00, min: 1, max: 3 },
		},
		values: [[], [0.3, 0.1], [0.2, 6], [0.3, 0.9, 0.1, 0.1], [2, 0.9, 0.1, 0.1]],
	}, {
		name: 'string @ ..8',
		type: { kind: 'string', lengthRange: { kind: 0b00, max: 8 } },
		values: [1, 'abc', 'abcdefghij'],
	}, {
		name:
			'struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }',
		type: {
			kind: 'struct',
			fields: [{ kind: 'pair', key: 'id', type: { kind: 'string' } }, {
				kind: 'pair',
				key: 'data',
				type: {
					kind: 'indexed',
					child: {
						kind: 'struct',
						fields: [{
							kind: 'pair',
							key: 'test',
							type: {
								kind: 'struct',
								fields: [{ kind: 'pair', key: 'config', type: { kind: 'double' } }],
							},
						}, {
							kind: 'pair',
							key: 'other',
							type: {
								kind: 'struct',
								fields: [{ kind: 'pair', key: 'baz', type: { kind: 'boolean' } }],
							},
						}],
					},
					parallelIndices: [{ kind: 'dynamic', accessor: ['id'] }],
				},
			}],
		},
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
		name: 'struct { test: struct { config: double }, other: struct { baz: boolean } }[%fallback]',
		type: {
			kind: 'indexed',
			child: {
				kind: 'struct',
				fields: [{
					kind: 'pair',
					key: 'test',
					type: {
						kind: 'struct',
						fields: [{ kind: 'pair', key: 'config', type: { kind: 'double' } }],
					},
				}, {
					kind: 'pair',
					key: 'other',
					type: {
						kind: 'struct',
						fields: [{ kind: 'pair', key: 'baz', type: { kind: 'boolean' } }],
					},
				}],
			},
			parallelIndices: [{ kind: 'static', value: '%fallback' }],
		},
		values: [
			{},
			{ config: 'hello' },
			{ config: 5 },
			{ baz: 'world' },
			{ baz: true },
		],
	}, {
		name: 'struct { foo: string, ...( struct { bar: string } | struct { baz: string } ) }',
		type: {
			kind: 'struct',
			fields: [
				{ kind: 'pair', key: 'foo', type: { kind: 'string' } },
				{
					kind: 'spread',
					type: {
						kind: 'union',
						members: [
							{
								kind: 'struct',
								fields: [{ kind: 'pair', key: 'bar', type: { kind: 'string' } }],
							},
							{
								kind: 'struct',
								fields: [{ kind: 'pair', key: 'baz', type: { kind: 'string' } }],
							},
						],
					},
				},
			],
		},
		values: [
			{},
			{ foo: 'hi' },
			{ foo: 'hi', bar: 1 },
			{ foo: 'hello', bar: 'world' },
			{ foo: 'hello', baz: 'world' },
		],
	}, {
		name:
			'type EmptyUnion = (); struct { foo: string, ...( struct { bar: string } | EmptyUnion ) }',
		type: {
			kind: 'struct',
			fields: [
				{ kind: 'pair', key: 'foo', type: { kind: 'string' } },
				{
					kind: 'spread',
					type: {
						kind: 'union',
						members: [
							{
								kind: 'struct',
								fields: [{ kind: 'pair', key: 'bar', type: { kind: 'string' } }],
							},
							{ kind: 'reference', path: '::EmptyUnion' },
						],
					},
				},
			],
		},
		values: [
			{},
			{ foo: 'hi' },
			{ foo: 'hi', bar: 1 },
			{ foo: 'hello', bar: 'world' },
		],
		init: (symbols) => {
			symbols
				.query(TextDocument.create('', '', 0, ''), 'mcdoc', '::EmptyUnion')
				.enter({
					data: {
						data: {
							typeDef: {
								kind: 'union',
								members: [],
							} satisfies McdocType,
						},
					},
					usage: { type: 'definition' },
				})
		},
	}, {
		name: 'type Bounds<T> = struct { min: T, max: T }; Bounds<int @ 1..>',
		type: {
			kind: 'concrete',
			child: { kind: 'reference', path: '::Bounds' },
			typeArgs: [{ kind: 'int', valueRange: { kind: 0b00, min: 1 } }],
		},
		init: (symbols) => {
			symbols.query(TextDocument.create('', '', 0, ''), 'mcdoc', '::Bounds').enter({
				data: {
					subcategory: 'type_alias',
					data: {
						typeDef: {
							kind: 'template',
							typeParams: [{ path: '::T' }],
							child: {
								kind: 'struct',
								fields: [{
									kind: 'pair',
									key: 'min',
									type: { kind: 'reference', path: '::T' },
								}, { kind: 'pair', key: 'max', type: { kind: 'reference', path: '::T' } }],
							},
						} satisfies McdocType,
					},
				},
				usage: { type: 'definition' },
			})
		},
		values: [{}, { min: 2, max: 5 }, { min: 'hello', max: -1 }],
	}, {
		name: 'type Tag<V> = (V | [V]); Tag<string>',
		type: {
			kind: 'concrete',
			child: { kind: 'reference', path: '::Tag' },
			typeArgs: [{ kind: 'string' }],
		},
		init: (symbols) => {
			symbols.query(TextDocument.create('', '', 0, ''), 'mcdoc', '::Tag').enter({
				data: {
					subcategory: 'type_alias',
					data: {
						typeDef: {
							kind: 'template',
							typeParams: [{ path: '::V' }],
							child: {
								kind: 'union',
								members: [{ kind: 'reference', path: '::V' }, {
									kind: 'list',
									item: { kind: 'reference', path: '::V' },
								}],
							},
						} satisfies McdocType,
					},
				},
				usage: { type: 'definition' },
			})
		},
		values: [2, 'hello', [], ['test'], [10]],
	}, {
		name: 'type Tag<V> = [int, V]; Tag<string>',
		type: {
			kind: 'concrete',
			child: { kind: 'reference', path: '::Tag' },
			typeArgs: [{ kind: 'string' }],
		},
		init: (symbols) => {
			symbols.query(TextDocument.create('', '', 0, ''), 'mcdoc', '::Tag').enter({
				data: {
					subcategory: 'type_alias',
					data: {
						typeDef: {
							kind: 'template',
							typeParams: [{ path: '::V' }],
							child: {
								kind: 'tuple',
								items: [{ kind: 'int' }, { kind: 'reference', path: '::V' }],
							},
						} satisfies McdocType,
					},
				},
				usage: { type: 'definition' },
			})
		},
		values: ['test', [4, 5], [10, 'test'], ['foo', 'test'], [10]],
	}, {
		name:
			'type Inner<B> = struct { bar: B }; type Outer<A> = struct { foo: Inner<[A]> }; Outer<string>',
		type: {
			kind: 'concrete',
			child: { kind: 'reference', path: '::Outer' },
			typeArgs: [{ kind: 'string' }],
		},
		init: (symbols) => {
			symbols.query(TextDocument.create('', '', 0, ''), 'mcdoc', '::Outer').enter({
				data: {
					subcategory: 'type_alias',
					data: {
						typeDef: {
							kind: 'template',
							typeParams: [{ path: '::A' }],
							child: {
								kind: 'struct',
								fields: [{
									kind: 'pair',
									key: 'foo',
									type: {
										kind: 'concrete',
										child: { kind: 'reference', path: '::Inner' },
										typeArgs: [{
											kind: 'list',
											item: { kind: 'reference', path: '::A' },
										}],
									},
								}],
							},
						} satisfies McdocType,
					},
				},
				usage: { type: 'definition' },
			})
			symbols.query(TextDocument.create('', '', 0, ''), 'mcdoc', '::Inner').enter({
				data: {
					subcategory: 'type_alias',
					data: {
						typeDef: {
							kind: 'template',
							typeParams: [{ path: '::B' }],
							child: {
								kind: 'struct',
								fields: [{
									kind: 'pair',
									key: 'bar',
									type: { kind: 'reference', path: '::B' },
								}],
							},
						} satisfies McdocType,
					},
				},
				usage: { type: 'definition' },
			})
		},
		values: [{ foo: 3 }, { foo: { bar: 'hello' } }, { foo: { bar: ['hello'] } }, {
			foo: { bar: [2] },
		}],
	}, {
		name: 'type Ref = double; struct { foo: Ref }',
		type: {
			kind: 'struct',
			fields: [{ kind: 'pair', key: 'foo', type: { kind: 'reference', path: '::Ref' } }],
		},
		init: (symbols) => {
			symbols.query(TextDocument.create('', '', 0, ''), 'mcdoc', '::Ref').enter({
				data: {
					subcategory: 'type_alias',
					data: { typeDef: { kind: 'double' } satisfies McdocType },
				},
				usage: { type: 'definition' },
			})
		},
		values: [{}, { foo: 'hello' }, { foo: 4.1 }],
	}, {
		name:
			'dispatch minecraft:item[elytra] to struct { Damage: double }; struct { id: string, tag?: minecraft:item[[id]] }',
		type: {
			kind: 'struct',
			fields: [{ kind: 'pair', key: 'id', type: { kind: 'string' } }, {
				kind: 'pair',
				key: 'tag',
				optional: true,
				type: {
					kind: 'dispatcher',
					registry: 'minecraft:item',
					parallelIndices: [{ kind: 'dynamic', accessor: ['id'] }],
				},
			}],
		},
		init: (symbols) => {
			symbols
				.query(TextDocument.create('', '', 0, ''), 'mcdoc/dispatcher', 'minecraft:item')
				.enter({ usage: { type: 'reference' } })
			symbols
				.query(
					TextDocument.create('', '', 0, ''),
					'mcdoc/dispatcher',
					'minecraft:item',
					'elytra',
				)
				.enter({
					data: {
						data: {
							typeDef: {
								kind: 'struct',
								fields: [{ kind: 'pair', key: 'Damage', type: { kind: 'double' } }],
							} satisfies McdocType,
						},
					},
					usage: { type: 'definition' },
				})
		},
		values: [{}, { id: 'diamond' }, { id: 'elytra', tag: {} }, {
			id: 'elytra',
			tag: { Damage: true },
		}, { id: 'elytra', tag: { Damage: 20 } }],
	}]

	function inferType(value: JsValue): Exclude<McdocType, UnionType> {
		if (typeof value === 'boolean') {
			return { kind: 'boolean' }
		} else if (typeof value === 'number') {
			return { kind: 'literal', value: { kind: 'double', value: Number(value) } }
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

	for (const { name, type, values, init } of suites) {
		describe(`typeDefinition ${localeQuote(name)}`, () => {
			for (const value of values) {
				it(`with value ${JSON.stringify(value)}`, () => {
					const errors: McdocRuntimeError<JsValue>[] = []
					const project = mockProjectData()
					init?.(project.symbols)
					const checkerCtx = core.CheckerContext.create(project, {
						doc: TextDocument.create('', '', 0, ''),
					})
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
						isEquivalent: (inferred, def) => {
							switch (inferred.kind) {
								case 'list':
									return ['list', 'byte_array', 'int_array', 'long_array', 'tuple']
										.includes(def.kind)
								case 'struct':
									return def.kind === 'struct'
								case 'double':
									return ['byte', 'short', 'int', 'long', 'float', 'double'].includes(
										def.kind,
									)
								default:
									return false
							}
						},
					})
					typeDefinition(
						[{ originalNode: value, inferredType: inferType(value) }],
						type,
						ctx,
					)
					snapshot(errors)
				})
			}
		})
	}
})
