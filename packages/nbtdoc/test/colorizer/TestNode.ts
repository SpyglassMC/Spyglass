import type { SymbolTable } from '@spyglassmc/core'
import type { MainNode } from '../../lib'

export const TestContent = `
/// Doc comment.
compound Foo {
	Bar: byte,
	Baz: Qux
}

enum(int) Qux {
	One = 1
}

enum(float) Eww {
	One = 1.0
}

enum(string) Huh {
	One = "One"
}

Foo describes minecraft:block;

inject compound Foo {
	Injected: [Eww] @ 4
}
`

export const TestNode: MainNode = {
	type: 'nbtdoc:main',
	range: {
		start: 0,
		end: 230,
	},
	children: [
		{
			type: 'nbtdoc:compound_definition',
			range: {
				start: 1,
				end: 56,
			},
			children: [
				{
					type: 'nbtdoc:doc_comments',
					range: {
						start: 1,
						end: 18,
					},
					children: [
						{
							type: 'comment',
							range: {
								start: 1,
								end: 18,
							},
							comment: ' Doc comment.\n',
						},
					],
					value: ' Doc comment.\n',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 18,
						end: 26,
					},
					value: 'compound',
				},
				{
					type: 'nbtdoc:identifier',
					range: {
						start: 27,
						end: 30,
					},
					value: 'Foo',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 31,
						end: 32,
					},
					value: '{',
				},
				{
					type: 'nbtdoc:compound_definition/field',
					range: {
						start: 34,
						end: 43,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 34,
								end: 34,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 34,
								end: 37,
							},
							value: 'Bar',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 37,
								end: 38,
							},
							value: ':',
						},
						{
							type: 'nbtdoc:compound_definition/field/type',
							range: {
								start: 39,
								end: 43,
							},
							typeType: 'byte',
							valueRange: undefined,
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 34,
							end: 34,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 34,
							end: 37,
						},
						value: 'Bar',
					},
					fieldType: {
						type: 'nbtdoc:compound_definition/field/type',
						range: {
							start: 39,
							end: 43,
						},
						typeType: 'byte',
						valueRange: undefined,
					},
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 43,
						end: 44,
					},
					value: ',',
				},
				{
					type: 'nbtdoc:compound_definition/field',
					range: {
						start: 46,
						end: 54,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 46,
								end: 46,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 46,
								end: 49,
							},
							value: 'Baz',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 49,
								end: 50,
							},
							value: ':',
						},
						{
							type: 'nbtdoc:compound_definition/field/type',
							range: {
								start: 51,
								end: 54,
							},
							typeType: 'path',
							path: {
								type: 'nbtdoc:ident_path',
								fromGlobalRoot: false,
								children: [
									{
										type: 'nbtdoc:identifier',
										range: {
											start: 51,
											end: 54,
										},
										value: 'Qux',
									},
								],
								range: {
									start: 51,
									end: 54,
								},
							},
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 46,
							end: 46,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 46,
							end: 49,
						},
						value: 'Baz',
					},
					fieldType: {
						type: 'nbtdoc:compound_definition/field/type',
						range: {
							start: 51,
							end: 54,
						},
						typeType: 'path',
						path: {
							type: 'nbtdoc:ident_path',
							fromGlobalRoot: false,
							children: [
								{
									type: 'nbtdoc:identifier',
									range: {
										start: 51,
										end: 54,
									},
									value: 'Qux',
								},
							],
							range: {
								start: 51,
								end: 54,
							},
						},
					},
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 55,
						end: 56,
					},
					value: '}',
				},
			],
			doc: {
				type: 'nbtdoc:doc_comments',
				range: {
					start: 1,
					end: 18,
				},
				children: [
					{
						type: 'comment',
						range: {
							start: 1,
							end: 18,
						},
						comment: ' Doc comment.\n',
					},
				],
				value: ' Doc comment.\n',
			},
			identifier: {
				type: 'nbtdoc:identifier',
				range: {
					start: 27,
					end: 30,
				},
				value: 'Foo',
			},
			extends: undefined,
			fields: [
				{
					type: 'nbtdoc:compound_definition/field',
					range: {
						start: 34,
						end: 43,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 34,
								end: 34,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 34,
								end: 37,
							},
							value: 'Bar',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 37,
								end: 38,
							},
							value: ':',
						},
						{
							type: 'nbtdoc:compound_definition/field/type',
							range: {
								start: 39,
								end: 43,
							},
							typeType: 'byte',
							valueRange: undefined,
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 34,
							end: 34,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 34,
							end: 37,
						},
						value: 'Bar',
					},
					fieldType: {
						type: 'nbtdoc:compound_definition/field/type',
						range: {
							start: 39,
							end: 43,
						},
						typeType: 'byte',
						valueRange: undefined,
					},
				},
				{
					type: 'nbtdoc:compound_definition/field',
					range: {
						start: 46,
						end: 54,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 46,
								end: 46,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 46,
								end: 49,
							},
							value: 'Baz',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 49,
								end: 50,
							},
							value: ':',
						},
						{
							type: 'nbtdoc:compound_definition/field/type',
							range: {
								start: 51,
								end: 54,
							},
							typeType: 'path',
							path: {
								type: 'nbtdoc:ident_path',
								fromGlobalRoot: false,
								children: [
									{
										type: 'nbtdoc:identifier',
										range: {
											start: 51,
											end: 54,
										},
										value: 'Qux',
									},
								],
								range: {
									start: 51,
									end: 54,
								},
							},
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 46,
							end: 46,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 46,
							end: 49,
						},
						value: 'Baz',
					},
					fieldType: {
						type: 'nbtdoc:compound_definition/field/type',
						range: {
							start: 51,
							end: 54,
						},
						typeType: 'path',
						path: {
							type: 'nbtdoc:ident_path',
							fromGlobalRoot: false,
							children: [
								{
									type: 'nbtdoc:identifier',
									range: {
										start: 51,
										end: 54,
									},
									value: 'Qux',
								},
							],
							range: {
								start: 51,
								end: 54,
							},
						},
					},
				},
			],
		},
		{
			type: 'nbtdoc:enum_definition',
			range: {
				start: 58,
				end: 84,
			},
			children: [
				{
					type: 'nbtdoc:doc_comments',
					range: {
						start: 58,
						end: 58,
					},
					children: [],
					value: '',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 58,
						end: 62,
					},
					value: 'enum',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 62,
						end: 63,
					},
					value: '(',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 63,
						end: 66,
					},
					value: 'int',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 66,
						end: 67,
					},
					value: ')',
				},
				{
					type: 'nbtdoc:identifier',
					range: {
						start: 68,
						end: 71,
					},
					value: 'Qux',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 72,
						end: 73,
					},
					value: '{',
				},
				{
					type: 'nbtdoc:enum_definition/field',
					range: {
						start: 75,
						end: 82,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 75,
								end: 75,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 75,
								end: 78,
							},
							value: 'One',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 79,
								end: 80,
							},
							value: '=',
						},
						{
							type: 'integer',
							range: {
								start: 81,
								end: 82,
							},
							value: '1',
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 75,
							end: 75,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 75,
							end: 78,
						},
						value: 'One',
					},
					value: {
						type: 'integer',
						range: {
							start: 81,
							end: 82,
						},
						value: '1',
					},
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 83,
						end: 84,
					},
					value: '}',
				},
			],
			doc: {
				type: 'nbtdoc:doc_comments',
				range: {
					start: 58,
					end: 58,
				},
				children: [],
				value: '',
			},
			enumType: {
				type: 'nbtdoc:literal',
				range: {
					start: 63,
					end: 66,
				},
				value: 'int',
			},
			identifier: {
				type: 'nbtdoc:identifier',
				range: {
					start: 68,
					end: 71,
				},
				value: 'Qux',
			},
			fields: [
				{
					type: 'nbtdoc:enum_definition/field',
					range: {
						start: 75,
						end: 82,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 75,
								end: 75,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 75,
								end: 78,
							},
							value: 'One',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 79,
								end: 80,
							},
							value: '=',
						},
						{
							type: 'integer',
							range: {
								start: 81,
								end: 82,
							},
							value: '1',
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 75,
							end: 75,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 75,
							end: 78,
						},
						value: 'One',
					},
					value: {
						type: 'integer',
						range: {
							start: 81,
							end: 82,
						},
						value: '1',
					},
				},
			],
		},
		{
			type: 'nbtdoc:enum_definition',
			range: {
				start: 86,
				end: 116,
			},
			children: [
				{
					type: 'nbtdoc:doc_comments',
					range: {
						start: 86,
						end: 86,
					},
					children: [],
					value: '',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 86,
						end: 90,
					},
					value: 'enum',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 90,
						end: 91,
					},
					value: '(',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 91,
						end: 96,
					},
					value: 'float',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 96,
						end: 97,
					},
					value: ')',
				},
				{
					type: 'nbtdoc:identifier',
					range: {
						start: 98,
						end: 101,
					},
					value: 'Eww',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 102,
						end: 103,
					},
					value: '{',
				},
				{
					type: 'nbtdoc:enum_definition/field',
					range: {
						start: 105,
						end: 114,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 105,
								end: 105,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 105,
								end: 108,
							},
							value: 'One',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 109,
								end: 110,
							},
							value: '=',
						},
						{
							type: 'float',
							range: {
								start: 111,
								end: 114,
							},
							value: 1,
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 105,
							end: 105,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 105,
							end: 108,
						},
						value: 'One',
					},
					value: {
						type: 'float',
						range: {
							start: 111,
							end: 114,
						},
						value: 1,
					},
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 115,
						end: 116,
					},
					value: '}',
				},
			],
			doc: {
				type: 'nbtdoc:doc_comments',
				range: {
					start: 86,
					end: 86,
				},
				children: [],
				value: '',
			},
			enumType: {
				type: 'nbtdoc:literal',
				range: {
					start: 91,
					end: 96,
				},
				value: 'float',
			},
			identifier: {
				type: 'nbtdoc:identifier',
				range: {
					start: 98,
					end: 101,
				},
				value: 'Eww',
			},
			fields: [
				{
					type: 'nbtdoc:enum_definition/field',
					range: {
						start: 105,
						end: 114,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 105,
								end: 105,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 105,
								end: 108,
							},
							value: 'One',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 109,
								end: 110,
							},
							value: '=',
						},
						{
							type: 'float',
							range: {
								start: 111,
								end: 114,
							},
							value: 1,
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 105,
							end: 105,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 105,
							end: 108,
						},
						value: 'One',
					},
					value: {
						type: 'float',
						range: {
							start: 111,
							end: 114,
						},
						value: 1,
					},
				},
			],
		},
		{
			type: 'nbtdoc:enum_definition',
			range: {
				start: 118,
				end: 151,
			},
			children: [
				{
					type: 'nbtdoc:doc_comments',
					range: {
						start: 118,
						end: 118,
					},
					children: [],
					value: '',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 118,
						end: 122,
					},
					value: 'enum',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 122,
						end: 123,
					},
					value: '(',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 123,
						end: 129,
					},
					value: 'string',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 129,
						end: 130,
					},
					value: ')',
				},
				{
					type: 'nbtdoc:identifier',
					range: {
						start: 131,
						end: 134,
					},
					value: 'Huh',
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 135,
						end: 136,
					},
					value: '{',
				},
				{
					type: 'nbtdoc:enum_definition/field',
					range: {
						start: 138,
						end: 149,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 138,
								end: 138,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 138,
								end: 141,
							},
							value: 'One',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 142,
								end: 143,
							},
							value: '=',
						},
						{
							type: 'string',
							range: {
								start: 144,
								end: 149,
							},
							options: {},
							value: 'One',
							childrenMaps: [
								{
									outerRange: {
										start: 145,
										end: 148,
									},
									innerRange: {
										start: 0,
										end: 3,
									},
									pairs: [],
								},
							],
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 138,
							end: 138,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 138,
							end: 141,
						},
						value: 'One',
					},
					value: {
						type: 'string',
						range: {
							start: 144,
							end: 149,
						},
						options: {},
						value: 'One',
						childrenMaps: [
							{
								outerRange: {
									start: 145,
									end: 148,
								},
								innerRange: {
									start: 0,
									end: 3,
								},
								pairs: [],
							},
						],
					},
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 150,
						end: 151,
					},
					value: '}',
				},
			],
			doc: {
				type: 'nbtdoc:doc_comments',
				range: {
					start: 118,
					end: 118,
				},
				children: [],
				value: '',
			},
			enumType: {
				type: 'nbtdoc:literal',
				range: {
					start: 123,
					end: 129,
				},
				value: 'string',
			},
			identifier: {
				type: 'nbtdoc:identifier',
				range: {
					start: 131,
					end: 134,
				},
				value: 'Huh',
			},
			fields: [
				{
					type: 'nbtdoc:enum_definition/field',
					range: {
						start: 138,
						end: 149,
					},
					children: [
						{
							type: 'nbtdoc:doc_comments',
							range: {
								start: 138,
								end: 138,
							},
							children: [],
							value: '',
						},
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 138,
								end: 141,
							},
							value: 'One',
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 142,
								end: 143,
							},
							value: '=',
						},
						{
							type: 'string',
							range: {
								start: 144,
								end: 149,
							},
							value: 'One',
							options: {},
							childrenMaps: [
								{
									outerRange: {
										start: 145,
										end: 148,
									},
									innerRange: {
										start: 0,
										end: 3,
									},
									pairs: [],
								},
							],
						},
					],
					doc: {
						type: 'nbtdoc:doc_comments',
						range: {
							start: 138,
							end: 138,
						},
						children: [],
						value: '',
					},
					key: {
						type: 'nbtdoc:identifier',
						range: {
							start: 138,
							end: 141,
						},
						value: 'One',
					},
					value: {
						type: 'string',
						range: {
							start: 144,
							end: 149,
						},
						options: {},
						value: 'One',
						childrenMaps: [
							{
								outerRange: {
									start: 145,
									end: 148,
								},
								innerRange: {
									start: 0,
									end: 3,
								},
								pairs: [],
							},
						],
					},
				},
			],
		},
		{
			type: 'nbtdoc:describes_clause',
			range: {
				start: 153,
				end: 183,
			},
			children: [
				{
					type: 'nbtdoc:ident_path',
					fromGlobalRoot: false,
					children: [
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 153,
								end: 156,
							},
							value: 'Foo',
						},
					],
					range: {
						start: 153,
						end: 156,
					},
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 157,
						end: 166,
					},
					value: 'describes',
				},
				{
					type: 'resource_location',
					range: {
						start: 167,
						end: 182,
					},
					options: { pool: ['block', 'entity_type', 'item'] },
					namespace: 'minecraft',
					path: [
						'block',
					],
				},
				{
					type: 'nbtdoc:literal',
					range: {
						start: 182,
						end: 183,
					},
					value: ';',
				},
			],
			path: {
				type: 'nbtdoc:ident_path',
				fromGlobalRoot: false,
				children: [
					{
						type: 'nbtdoc:identifier',
						range: {
							start: 153,
							end: 156,
						},
						value: 'Foo',
					},
				],
				range: {
					start: 153,
					end: 156,
				},
			},
			registry: {
				type: 'resource_location',
				range: {
					start: 167,
					end: 182,
				},
				options: { pool: ['block', 'entity_type', 'item'] },
				namespace: 'minecraft',
				path: [
					'block',
				],
			},
			objects: undefined,
		},
		{
			type: 'nbtdoc:inject_clause',
			range: {
				start: 185,
				end: 229,
			},
			children: [
				{
					type: 'nbtdoc:literal',
					range: {
						start: 185,
						end: 191,
					},
					value: 'inject',
				},
				{
					type: 'nbtdoc:inject_clause/compound',
					range: {
						start: 192,
						end: 229,
					},
					children: [
						{
							type: 'nbtdoc:literal',
							range: {
								start: 192,
								end: 200,
							},
							value: 'compound',
						},
						{
							type: 'nbtdoc:ident_path',
							fromGlobalRoot: false,
							children: [
								{
									type: 'nbtdoc:identifier',
									range: {
										start: 201,
										end: 204,
									},
									value: 'Foo',
								},
							],
							range: {
								start: 201,
								end: 204,
							},
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 205,
								end: 206,
							},
							value: '{',
						},
						{
							type: 'nbtdoc:compound_definition/field',
							range: {
								start: 208,
								end: 227,
							},
							children: [
								{
									type: 'nbtdoc:doc_comments',
									range: {
										start: 208,
										end: 208,
									},
									children: [],
									value: '',
								},
								{
									type: 'nbtdoc:identifier',
									range: {
										start: 208,
										end: 216,
									},
									value: 'Injected',
								},
								{
									type: 'nbtdoc:literal',
									range: {
										start: 216,
										end: 217,
									},
									value: ':',
								},
								{
									type: 'nbtdoc:compound_definition/field/type',
									range: {
										start: 218,
										end: 227,
									},
									typeType: 'list',
									lengthRange: {
										type: 'nbtdoc:unsigned_range',
										range: {
											start: 224,
											end: 227,
										},
										children: [
											{
												type: 'nbtdoc:literal',
												range: {
													start: 224,
													end: 225,
												},
												value: '@',
											},
											{
												type: 'integer',
												range: {
													start: 226,
													end: 227,
												},
												value: '4',
											},
										],
										value: [
											4,
											4,
										],
									},
									item: {
										type: 'nbtdoc:compound_definition/field/type',
										range: {
											start: 219,
											end: 222,
										},
										typeType: 'path',
										path: {
											type: 'nbtdoc:ident_path',
											fromGlobalRoot: false,
											children: [
												{
													type: 'nbtdoc:identifier',
													range: {
														start: 219,
														end: 222,
													},
													value: 'Eww',
												},
											],
											range: {
												start: 219,
												end: 222,
											},
										},
									},
								},
							],
							doc: {
								type: 'nbtdoc:doc_comments',
								range: {
									start: 208,
									end: 208,
								},
								children: [],
								value: '',
							},
							key: {
								type: 'nbtdoc:identifier',
								range: {
									start: 208,
									end: 216,
								},
								value: 'Injected',
							},
							fieldType: {
								type: 'nbtdoc:compound_definition/field/type',
								range: {
									start: 218,
									end: 227,
								},
								typeType: 'list',
								lengthRange: {
									type: 'nbtdoc:unsigned_range',
									range: {
										start: 224,
										end: 227,
									},
									children: [
										{
											type: 'nbtdoc:literal',
											range: {
												start: 224,
												end: 225,
											},
											value: '@',
										},
										{
											type: 'integer',
											range: {
												start: 226,
												end: 227,
											},
											value: '4',
										},
									],
									value: [
										4,
										4,
									],
								},
								item: {
									type: 'nbtdoc:compound_definition/field/type',
									range: {
										start: 219,
										end: 222,
									},
									typeType: 'path',
									path: {
										type: 'nbtdoc:ident_path',
										fromGlobalRoot: false,
										children: [
											{
												type: 'nbtdoc:identifier',
												range: {
													start: 219,
													end: 222,
												},
												value: 'Eww',
											},
										],
										range: {
											start: 219,
											end: 222,
										},
									},
								},
							},
						},
						{
							type: 'nbtdoc:literal',
							range: {
								start: 228,
								end: 229,
							},
							value: '}',
						},
					],
					path: {
						type: 'nbtdoc:ident_path',
						fromGlobalRoot: false,
						children: [
							{
								type: 'nbtdoc:identifier',
								range: {
									start: 201,
									end: 204,
								},
								value: 'Foo',
							},
						],
						range: {
							start: 201,
							end: 204,
						},
					},
					fields: [
						{
							type: 'nbtdoc:compound_definition/field',
							range: {
								start: 208,
								end: 227,
							},
							children: [
								{
									type: 'nbtdoc:doc_comments',
									range: {
										start: 208,
										end: 208,
									},
									children: [],
									value: '',
								},
								{
									type: 'nbtdoc:identifier',
									range: {
										start: 208,
										end: 216,
									},
									value: 'Injected',
								},
								{
									type: 'nbtdoc:literal',
									range: {
										start: 216,
										end: 217,
									},
									value: ':',
								},
								{
									type: 'nbtdoc:compound_definition/field/type',
									range: {
										start: 218,
										end: 227,
									},
									typeType: 'list',
									lengthRange: {
										type: 'nbtdoc:unsigned_range',
										range: {
											start: 224,
											end: 227,
										},
										children: [
											{
												type: 'nbtdoc:literal',
												range: {
													start: 224,
													end: 225,
												},
												value: '@',
											},
											{
												type: 'integer',
												range: {
													start: 226,
													end: 227,
												},
												value: '4',
											},
										],
										value: [
											4,
											4,
										],
									},
									item: {
										type: 'nbtdoc:compound_definition/field/type',
										range: {
											start: 219,
											end: 222,
										},
										typeType: 'path',
										path: {
											type: 'nbtdoc:ident_path',
											fromGlobalRoot: false,
											children: [
												{
													type: 'nbtdoc:identifier',
													range: {
														start: 219,
														end: 222,
													},
													value: 'Eww',
												},
											],
											range: {
												start: 219,
												end: 222,
											},
										},
									},
								},
							],
							doc: {
								type: 'nbtdoc:doc_comments',
								range: {
									start: 208,
									end: 208,
								},
								children: [],
								value: '',
							},
							key: {
								type: 'nbtdoc:identifier',
								range: {
									start: 208,
									end: 216,
								},
								value: 'Injected',
							},
							fieldType: {
								type: 'nbtdoc:compound_definition/field/type',
								range: {
									start: 218,
									end: 227,
								},
								typeType: 'list',
								lengthRange: {
									type: 'nbtdoc:unsigned_range',
									range: {
										start: 224,
										end: 227,
									},
									children: [
										{
											type: 'nbtdoc:literal',
											range: {
												start: 224,
												end: 225,
											},
											value: '@',
										},
										{
											type: 'integer',
											range: {
												start: 226,
												end: 227,
											},
											value: '4',
										},
									],
									value: [
										4,
										4,
									],
								},
								item: {
									type: 'nbtdoc:compound_definition/field/type',
									range: {
										start: 219,
										end: 222,
									},
									typeType: 'path',
									path: {
										type: 'nbtdoc:ident_path',
										fromGlobalRoot: false,
										children: [
											{
												type: 'nbtdoc:identifier',
												range: {
													start: 219,
													end: 222,
												},
												value: 'Eww',
											},
										],
										range: {
											start: 219,
											end: 222,
										},
									},
								},
							},
						},
					],
				},
			],
			def: {
				type: 'nbtdoc:inject_clause/compound',
				range: {
					start: 192,
					end: 229,
				},
				children: [
					{
						type: 'nbtdoc:literal',
						range: {
							start: 192,
							end: 200,
						},
						value: 'compound',
					},
					{
						type: 'nbtdoc:ident_path',
						fromGlobalRoot: false,
						children: [
							{
								type: 'nbtdoc:identifier',
								range: {
									start: 201,
									end: 204,
								},
								value: 'Foo',
							},
						],
						range: {
							start: 201,
							end: 204,
						},
					},
					{
						type: 'nbtdoc:literal',
						range: {
							start: 205,
							end: 206,
						},
						value: '{',
					},
					{
						type: 'nbtdoc:compound_definition/field',
						range: {
							start: 208,
							end: 227,
						},
						children: [
							{
								type: 'nbtdoc:doc_comments',
								range: {
									start: 208,
									end: 208,
								},
								children: [],
								value: '',
							},
							{
								type: 'nbtdoc:identifier',
								range: {
									start: 208,
									end: 216,
								},
								value: 'Injected',
							},
							{
								type: 'nbtdoc:literal',
								range: {
									start: 216,
									end: 217,
								},
								value: ':',
							},
							{
								type: 'nbtdoc:compound_definition/field/type',
								range: {
									start: 218,
									end: 227,
								},
								typeType: 'list',
								lengthRange: {
									type: 'nbtdoc:unsigned_range',
									range: {
										start: 224,
										end: 227,
									},
									children: [
										{
											type: 'nbtdoc:literal',
											range: {
												start: 224,
												end: 225,
											},
											value: '@',
										},
										{
											type: 'integer',
											range: {
												start: 226,
												end: 227,
											},
											value: '4',
										},
									],
									value: [
										4,
										4,
									],
								},
								item: {
									type: 'nbtdoc:compound_definition/field/type',
									range: {
										start: 219,
										end: 222,
									},
									typeType: 'path',
									path: {
										type: 'nbtdoc:ident_path',
										fromGlobalRoot: false,
										children: [
											{
												type: 'nbtdoc:identifier',
												range: {
													start: 219,
													end: 222,
												},
												value: 'Eww',
											},
										],
										range: {
											start: 219,
											end: 222,
										},
									},
								},
							},
						],
						doc: {
							type: 'nbtdoc:doc_comments',
							range: {
								start: 208,
								end: 208,
							},
							children: [],
							value: '',
						},
						key: {
							type: 'nbtdoc:identifier',
							range: {
								start: 208,
								end: 216,
							},
							value: 'Injected',
						},
						fieldType: {
							type: 'nbtdoc:compound_definition/field/type',
							range: {
								start: 218,
								end: 227,
							},
							typeType: 'list',
							lengthRange: {
								type: 'nbtdoc:unsigned_range',
								range: {
									start: 224,
									end: 227,
								},
								children: [
									{
										type: 'nbtdoc:literal',
										range: {
											start: 224,
											end: 225,
										},
										value: '@',
									},
									{
										type: 'integer',
										range: {
											start: 226,
											end: 227,
										},
										value: '4',
									},
								],
								value: [
									4,
									4,
								],
							},
							item: {
								type: 'nbtdoc:compound_definition/field/type',
								range: {
									start: 219,
									end: 222,
								},
								typeType: 'path',
								path: {
									type: 'nbtdoc:ident_path',
									fromGlobalRoot: false,
									children: [
										{
											type: 'nbtdoc:identifier',
											range: {
												start: 219,
												end: 222,
											},
											value: 'Eww',
										},
									],
									range: {
										start: 219,
										end: 222,
									},
								},
							},
						},
					},
					{
						type: 'nbtdoc:literal',
						range: {
							start: 228,
							end: 229,
						},
						value: '}',
					},
				],
				path: {
					type: 'nbtdoc:ident_path',
					fromGlobalRoot: false,
					children: [
						{
							type: 'nbtdoc:identifier',
							range: {
								start: 201,
								end: 204,
							},
							value: 'Foo',
						},
					],
					range: {
						start: 201,
						end: 204,
					},
				},
				fields: [
					{
						type: 'nbtdoc:compound_definition/field',
						range: {
							start: 208,
							end: 227,
						},
						children: [
							{
								type: 'nbtdoc:doc_comments',
								range: {
									start: 208,
									end: 208,
								},
								children: [],
								value: '',
							},
							{
								type: 'nbtdoc:identifier',
								range: {
									start: 208,
									end: 216,
								},
								value: 'Injected',
							},
							{
								type: 'nbtdoc:literal',
								range: {
									start: 216,
									end: 217,
								},
								value: ':',
							},
							{
								type: 'nbtdoc:compound_definition/field/type',
								range: {
									start: 218,
									end: 227,
								},
								typeType: 'list',
								lengthRange: {
									type: 'nbtdoc:unsigned_range',
									range: {
										start: 224,
										end: 227,
									},
									children: [
										{
											type: 'nbtdoc:literal',
											range: {
												start: 224,
												end: 225,
											},
											value: '@',
										},
										{
											type: 'integer',
											range: {
												start: 226,
												end: 227,
											},
											value: '4',
										},
									],
									value: [
										4,
										4,
									],
								},
								item: {
									type: 'nbtdoc:compound_definition/field/type',
									range: {
										start: 219,
										end: 222,
									},
									typeType: 'path',
									path: {
										type: 'nbtdoc:ident_path',
										fromGlobalRoot: false,
										children: [
											{
												type: 'nbtdoc:identifier',
												range: {
													start: 219,
													end: 222,
												},
												value: 'Eww',
											},
										],
										range: {
											start: 219,
											end: 222,
										},
									},
								},
							},
						],
						doc: {
							type: 'nbtdoc:doc_comments',
							range: {
								start: 208,
								end: 208,
							},
							children: [],
							value: '',
						},
						key: {
							type: 'nbtdoc:identifier',
							range: {
								start: 208,
								end: 216,
							},
							value: 'Injected',
						},
						fieldType: {
							type: 'nbtdoc:compound_definition/field/type',
							range: {
								start: 218,
								end: 227,
							},
							typeType: 'list',
							lengthRange: {
								type: 'nbtdoc:unsigned_range',
								range: {
									start: 224,
									end: 227,
								},
								children: [
									{
										type: 'nbtdoc:literal',
										range: {
											start: 224,
											end: 225,
										},
										value: '@',
									},
									{
										type: 'integer',
										range: {
											start: 226,
											end: 227,
										},
										value: '4',
									},
								],
								value: [
									4,
									4,
								],
							},
							item: {
								type: 'nbtdoc:compound_definition/field/type',
								range: {
									start: 219,
									end: 222,
								},
								typeType: 'path',
								path: {
									type: 'nbtdoc:ident_path',
									fromGlobalRoot: false,
									children: [
										{
											type: 'nbtdoc:identifier',
											range: {
												start: 219,
												end: 222,
											},
											value: 'Eww',
										},
									],
									range: {
										start: 219,
										end: 222,
									},
								},
							},
						},
					},
				],
			},
		},
	],
} as MainNode

export declare const TestSymbolTable: SymbolTable
