import * as core from '@spyglassmc/core/lib/index.js'
import { mockProjectData } from '@spyglassmc/core/test-out/utils.js'
import { localeQuote } from '@spyglassmc/locales'
import type {
	McdocCheckerError,
	McdocCheckerOptions,
} from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import { typeDefinition } from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import type { McdocType, UnionType } from '@spyglassmc/mcdoc/lib/type/index.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('mcdoc runtime checker', () => {
	type JsValue = boolean | number | string | JsValue[] | {
		[key: string]: JsValue
	}
	const suites: {
		name: string
		type: McdocType
		init?: (symbols: core.SymbolUtil) => void
		values: JsValue[]
	}[] = [
		{
			name: 'struct { test: double }',
			type: {
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'test', type: { kind: 'double' } },
				],
			},
			values: [
				{ test: 1 },
				{ test: 'hello' },
			],
		},
		{
			name: 'struct { foo: string, bar: [double] }',
			type: {
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'foo', type: { kind: 'string' } },
					{
						kind: 'pair',
						key: 'bar',
						type: { kind: 'list', item: { kind: 'double' } },
					},
				],
			},
			values: [
				2,
				{},
				{ foo: 'hello' },
				{ foo: true, bar: [] },
			],
		},
		{
			name: '( struct { text: string } | struct { selector: number })',
			type: {
				kind: 'union',
				members: [
					{
						kind: 'struct',
						fields: [
							{ kind: 'pair', key: 'text', type: { kind: 'string' } },
						],
					},
					{
						kind: 'struct',
						fields: [
							{
								kind: 'pair',
								key: 'selector',
								type: { kind: 'double' },
							},
						],
					},
				],
			},
			values: [
				{},
				{ text: 'something' },
				{ selector: 20 },
				{ text: 'foo', selector: 40 },
				{ selector: [1] },
			],
		},
		{
			name: '[struct { foo: double, bar?: boolean }]',
			type: {
				kind: 'list',
				item: {
					kind: 'struct',
					fields: [
						{ kind: 'pair', key: 'foo', type: { kind: 'double' } },
						{
							kind: 'pair',
							key: 'bar',
							optional: true,
							type: { kind: 'boolean' },
						},
					],
				},
			},
			values: [
				[],
				[4],
				[{}],
				[{ foo: 5 }],
				[{ foo: 2 }, { foo: 3, bar: 4 }, 'test'],
			],
		},
		{
			name:
				'struct { pages: ([struct { raw: string, filtered?: string }] | [string]) }',
			type: {
				kind: 'struct',
				fields: [
					{
						kind: 'pair',
						key: 'pages',
						type: {
							kind: 'union',
							members: [
								{
									kind: 'list',
									item: {
										kind: 'struct',
										fields: [
											{
												kind: 'pair',
												key: 'raw',
												type: { kind: 'string' },
											},
											{
												kind: 'pair',
												key: 'filtered',
												optional: true,
												type: { kind: 'string' },
											},
										],
									},
								},
								{
									kind: 'list',
									item: {
										kind: 'string',
									},
								},
							],
						},
					},
				],
			},
			values: [
				{ pages: [] },
				{ pages: ['foo', 'bar'] },
				{ pages: [{ raw: 'foo' }, { raw: 'bar', filtered: 'baz' }] },
				{ pages: ['foo', { raw: 'bar' }] },
			],
		},
		{
			name:
				'struct { ...struct { foo: double, bar: boolean }, foo: string }',
			type: {
				kind: 'struct',
				fields: [
					{
						kind: 'spread',
						type: {
							kind: 'struct',
							fields: [
								{ kind: 'pair', key: 'foo', type: { kind: 'double' } },
								{ kind: 'pair', key: 'bar', type: { kind: 'boolean' } },
							],
						},
					},
					{ kind: 'pair', key: 'foo', type: { kind: 'string' } },
				],
			},
			values: [
				{},
				{ foo: 'hello' },
				{ foo: 'hello', bar: true },
				{ foo: 4, bar: false },
			],
		},
		{
			name: 'struct { foo: double, bar: string }[foo]',
			type: {
				kind: 'indexed',
				child: {
					kind: 'struct',
					fields: [
						{ kind: 'pair', key: 'foo', type: { kind: 'double' } },
						{ kind: 'pair', key: 'bar', type: { kind: 'string' } },
					],
				},
				parallelIndices: [
					{ kind: 'static', value: 'foo' },
				],
			},
			values: [
				{ foo: 4, bar: 'wrong' },
				5,
				'hello',
			],
		},
		{
			name:
				'struct { id: string, ...struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }',
			type: {
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'id', type: { kind: 'string' } },
					{
						kind: 'spread',
						type: {
							kind: 'indexed',
							child: {
								kind: 'struct',
								fields: [
									{
										kind: 'pair',
										key: 'test',
										type: {
											kind: 'struct',
											fields: [
												{
													kind: 'pair',
													key: 'config',
													type: { kind: 'double' },
												},
											],
										},
									},
									{
										kind: 'pair',
										key: 'other',
										type: {
											kind: 'struct',
											fields: [
												{
													kind: 'pair',
													key: 'baz',
													type: { kind: 'boolean' },
												},
											],
										},
									},
								],
							},
							parallelIndices: [
								{ kind: 'dynamic', accessor: ['id'] },
							],
						},
					},
				],
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
		},
		{
			name: 'double @ 3..6.2',
			type: {
				kind: 'double',
				valueRange: { kind: 0b00, min: 3, max: 6.2 },
			},
			values: [
				'hello',
				1,
				3,
				4,
				6.2,
				6.3,
			],
		},
		{
			name: 'double @ 2..<4',
			type: {
				kind: 'double',
				valueRange: { kind: 0b01, min: 2, max: 4 },
			},
			values: [
				2,
				3.99,
				4,
			],
		},
		{
			name: '(double @ 2..4 | double @ 8..)',
			type: {
				kind: 'union',
				members: [
					{
						kind: 'double',
						valueRange: { kind: 0b00, min: 2, max: 4 },
					},
					{
						kind: 'double',
						valueRange: { kind: 0b00, min: 8 },
					},
				],
			},
			values: [
				3,
				5,
				9,
			],
		},
		{
			name: '(struct { foo: int @ 0..5 } | struct { foo: int @ 4..6 })',
			type: {
				kind: 'union',
				members: [
					{
						kind: 'struct',
						fields: [
							{
								kind: 'pair',
								key: 'foo',
								type: {
									kind: 'int',
									valueRange: { kind: 0b00, min: 0, max: 5 },
								},
							},
						],
					},
					{
						kind: 'struct',
						fields: [
							{
								kind: 'pair',
								key: 'foo',
								type: {
									kind: 'int',
									valueRange: { kind: 0b00, min: 4, max: 6 },
								},
							},
						],
					},
				],
			},
			values: [
				{ foo: 4 },
				{ foo: 9 },
			],
		},
		{
			name:
				'(struct { foo: (int @ 0..5 | int @ 20..25) } | struct { foo: int @ 4..6 })',
			type: {
				kind: 'union',
				members: [
					{
						kind: 'struct',
						fields: [
							{
								kind: 'pair',
								key: 'foo',
								type: {
									kind: 'union',
									members: [
										{
											kind: 'int',
											valueRange: { kind: 0b00, min: 0, max: 5 },
										},
										{
											kind: 'int',
											valueRange: { kind: 0b00, min: 20, max: 25 },
										},
									],
								},
							},
						],
					},
					{
						kind: 'struct',
						fields: [
							{
								kind: 'pair',
								key: 'foo',
								type: {
									kind: 'int',
									valueRange: { kind: 0b00, min: 4, max: 6 },
								},
							},
						],
					},
				],
			},
			values: [
				{ foo: 4 },
				{ foo: 9 },
				{ foo: 23 },
			],
		},
		{
			name: '[int] @ 0..5',
			type: {
				kind: 'list',
				item: { kind: 'int' },
				lengthRange: { kind: 0b00, min: 0, max: 5 },
			},
			values: [
				[],
				[1, 2, 3],
				[1, 2, 3, 4, 5, 6],
			],
		},
		{
			name: '[double @ 0..1] @ 1..3',
			type: {
				kind: 'list',
				item: {
					kind: 'double',
					valueRange: { kind: 0b00, min: 0, max: 1 },
				},
				lengthRange: { kind: 0b00, min: 1, max: 3 },
			},
			values: [
				[],
				[0.3, 0.1],
				[0.2, 6],
				[0.3, 0.9, 0.1, 0.1],
				[2, 0.9, 0.1, 0.1],
			],
		},
		{
			name:
				'struct { id: string, data: struct { test: struct { config: double }, other: struct { baz: boolean } }[[id]] }',
			type: {
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'id', type: { kind: 'string' } },
					{
						kind: 'pair',
						key: 'data',
						type: {
							kind: 'indexed',
							child: {
								kind: 'struct',
								fields: [
									{
										kind: 'pair',
										key: 'test',
										type: {
											kind: 'struct',
											fields: [
												{
													kind: 'pair',
													key: 'config',
													type: { kind: 'double' },
												},
											],
										},
									},
									{
										kind: 'pair',
										key: 'other',
										type: {
											kind: 'struct',
											fields: [
												{
													kind: 'pair',
													key: 'baz',
													type: { kind: 'boolean' },
												},
											],
										},
									},
								],
							},
							parallelIndices: [
								{ kind: 'dynamic', accessor: ['id'] },
							],
						},
					},
				],
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
		},
		{
			name: 'type Ref = double; struct { foo: Ref }',
			type: {
				kind: 'struct',
				fields: [
					{
						kind: 'pair',
						key: 'foo',
						type: { kind: 'reference', path: '::Ref' },
					},
				],
			},
			init: (symbols) => {
				symbols.query(
					TextDocument.create('', '', 0, ''),
					'mcdoc',
					'::Ref',
				).enter({
					data: {
						subcategory: 'type_alias',
						data: {
							typeDef: {
								kind: 'double',
							} satisfies McdocType,
						},
					},
					usage: { type: 'definition' },
				})
			},
			values: [
				{},
				{ foo: 'hello' },
				{ foo: 4.1 },
			],
		},
		{
			name:
				'dispatch minecraft:item[elytra] to struct { Damage: double }; struct { id: string, tag?: minecraft:item[[id]] }',
			type: {
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'id', type: { kind: 'string' } },
					{
						kind: 'pair',
						key: 'tag',
						optional: true,
						type: {
							kind: 'dispatcher',
							registry: 'minecraft:item',
							parallelIndices: [
								{ kind: 'dynamic', accessor: ['id'] },
							],
						},
					},
				],
			},
			init: (symbols) => {
				symbols.query(
					TextDocument.create('', '', 0, ''),
					'mcdoc/dispatcher',
					'minecraft:item',
				).enter({
					usage: { type: 'reference' },
				})
				symbols.query(
					TextDocument.create('', '', 0, ''),
					'mcdoc/dispatcher',
					'minecraft:item',
					'elytra',
				).enter({
					data: {
						data: {
							typeDef: {
								kind: 'struct',
								fields: [
									{
										kind: 'pair',
										key: 'Damage',
										type: { kind: 'double' },
									},
								],
							} satisfies McdocType,
						},
					},
					usage: { type: 'definition' },
				})
			},
			values: [
				{},
				{ id: 'diamond' },
				{ id: 'elytra', tag: {} },
				{ id: 'eltrya', tag: { Damage: true } },
				{ id: 'eltrya', tag: { Damage: 20 } },
			],
		},
	]

	function inferType(value: JsValue): Exclude<McdocType, UnionType> {
		if (typeof value === 'boolean') {
			return { kind: 'boolean' }
		} else if (typeof value === 'number') {
			return {
				kind: 'literal',
				value: { kind: 'double', value: Number(value) },
			}
		} else if (typeof value === 'string') {
			return { kind: 'literal', value: { kind: 'string', value: value } }
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
					const errors: McdocCheckerError<JsValue>[] = []
					const project = mockProjectData()
					init?.(project.symbols)
					const options: McdocCheckerOptions<JsValue> = {
						context: core.CheckerContext.create(project, {
							doc: TextDocument.create('', '', 0, ''),
						}),
						getChildren: (value) => {
							if (Array.isArray(value)) {
								return value.map((e) => [{
									originalNode: e,
									inferredType: inferType(e),
								}])
							} else if (typeof value === 'object') {
								return Object.entries(value).map(([k, v]) => ({
									key: { originalNode: k, inferredType: inferType(k) },
									possibleValues: [{
										originalNode: v,
										inferredType: inferType(v),
									}],
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
									return [
										'list',
										'byte_array',
										'int_array',
										'long_array',
										'tuple',
									].includes(def.kind)
								case 'struct':
									return def.kind === 'struct'
								case 'double':
									return [
										'byte',
										'short',
										'int',
										'long',
										'float',
										'double',
									].includes(def.kind)
								default:
									return false
							}
						},
						attachTypeInfo: () => {},
					}
					typeDefinition(
						[{ originalNode: value, inferredType: inferType(value) }],
						type,
						options,
					)
					snapshot(errors)
				})
			}
		})
	}
})
