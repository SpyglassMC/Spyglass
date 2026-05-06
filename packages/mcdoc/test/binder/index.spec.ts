import { BinderContext, Range, SymbolTable } from '@spyglassmc/core'
import {
	mockProjectData,
	showWhitespaceGlyph,
	snapshotWithUri,
} from '@spyglassmc/core/test/utils.ts'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { module_ } from '../../lib/binder/index.js'
import type { ModuleNode, TopLevelNode } from '../../lib/index.js'

const Suites: Partial<
	{
		[P in TopLevelNode['type']]: Record<
			string,
			Exclude<Extract<TopLevelNode, { type: P }>['children'], undefined>
		>
	}
> = {
	'mcdoc:enum': {
		'enum (byte) Foo { A = 1, B = 4b, C = 5B, D = 1.2, E = 1.2f, F = 4s, G = "Hello", }': [
			{
				type: 'mcdoc:literal',
				range: { start: 0, end: 4 },
				value: 'enum',
				colorTokenType: 'keyword',
			},
			{
				type: 'mcdoc:literal',
				range: { start: 6, end: 10 },
				value: 'byte',
				colorTokenType: 'type',
			},
			{
				type: 'mcdoc:identifier',
				options: { category: 'mcdoc/enum' },
				range: { start: 12, end: 15 },
				value: 'Foo',
			},
			{
				type: 'mcdoc:enum/block',
				children: [{
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 23, end: 24 },
						value: 'A',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 27, end: 28 }, value: 1 }],
						range: { start: 27, end: 28 },
					}],
					range: { start: 23, end: 28 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 35, end: 36 },
						value: 'B',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 39, end: 40 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 40, end: 41 },
							value: 'b',
							colorTokenType: 'keyword',
						}],
						range: { start: 39, end: 41 },
					}],
					range: { start: 35, end: 41 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 48, end: 49 },
						value: 'C',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 52, end: 53 }, value: 5 }, {
							type: 'mcdoc:literal',
							range: { start: 53, end: 54 },
							value: 'B',
							colorTokenType: 'keyword',
						}],
						range: { start: 52, end: 54 },
					}],
					range: { start: 48, end: 54 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 61, end: 62 },
						value: 'D',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 65, end: 68 }, value: 1.2 }],
						range: { start: 65, end: 68 },
					}],
					range: { start: 61, end: 68 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 75, end: 76 },
						value: 'E',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 79, end: 82 }, value: 1.2 }, {
							type: 'mcdoc:literal',
							range: { start: 82, end: 83 },
							value: 'f',
							colorTokenType: 'keyword',
						}],
						range: { start: 79, end: 83 },
					}],
					range: { start: 75, end: 83 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 90, end: 91 },
						value: 'F',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 94, end: 95 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 95, end: 96 },
							value: 's',
							colorTokenType: 'keyword',
						}],
						range: { start: 94, end: 96 },
					}],
					range: { start: 90, end: 96 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 103, end: 104 },
						value: 'G',
					}, {
						type: 'string',
						range: { start: 107, end: 114 },
						options: {},
						value: 'Hello',
						valueMap: [{ inner: { start: 0, end: 0 }, outer: { start: 108, end: 108 } }],
						quote: '"',
					}],
					range: { start: 103, end: 114 },
				}],
				range: { start: 16, end: 121 },
			},
		],
		'enum (short) Foo { A = 1, B = 4s, C = 5S, D = 1.2, E = 1.2f, F = 4b, G = "Hello", }': [
			{
				type: 'mcdoc:literal',
				range: { start: 0, end: 4 },
				value: 'enum',
				colorTokenType: 'keyword',
			},
			{
				type: 'mcdoc:literal',
				range: { start: 6, end: 10 },
				value: 'short',
				colorTokenType: 'type',
			},
			{
				type: 'mcdoc:identifier',
				options: { category: 'mcdoc/enum_field' },
				range: { start: 12, end: 15 },
				value: 'Foo',
			},
			{
				type: 'mcdoc:enum/block',
				children: [{
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 23, end: 24 },
						value: 'A',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 27, end: 28 }, value: 1 }],
						range: { start: 27, end: 28 },
					}],
					range: { start: 23, end: 28 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 35, end: 36 },
						value: 'B',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 39, end: 40 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 40, end: 41 },
							value: 's',
							colorTokenType: 'keyword',
						}],
						range: { start: 39, end: 41 },
					}],
					range: { start: 35, end: 41 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 48, end: 49 },
						value: 'C',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 52, end: 53 }, value: 5 }, {
							type: 'mcdoc:literal',
							range: { start: 53, end: 54 },
							value: 'S',
							colorTokenType: 'keyword',
						}],
						range: { start: 52, end: 54 },
					}],
					range: { start: 48, end: 54 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 61, end: 62 },
						value: 'D',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 65, end: 68 }, value: 1.2 }],
						range: { start: 65, end: 68 },
					}],
					range: { start: 61, end: 68 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 75, end: 76 },
						value: 'E',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 79, end: 82 }, value: 1.2 }, {
							type: 'mcdoc:literal',
							range: { start: 82, end: 83 },
							value: 'f',
							colorTokenType: 'keyword',
						}],
						range: { start: 79, end: 83 },
					}],
					range: { start: 75, end: 83 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 90, end: 91 },
						value: 'F',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 94, end: 95 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 95, end: 96 },
							value: 'b',
							colorTokenType: 'keyword',
						}],
						range: { start: 94, end: 96 },
					}],
					range: { start: 90, end: 96 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 103, end: 104 },
						value: 'G',
					}, {
						type: 'string',
						range: { start: 107, end: 114 },
						options: {},
						value: 'Hello',
						valueMap: [{ inner: { start: 0, end: 0 }, outer: { start: 108, end: 108 } }],
						quote: '"',
					}],
					range: { start: 103, end: 114 },
				}],
				range: { start: 16, end: 121 },
			},
		],
		'enum (int) Foo { A = 1, B = 1.2, C = 1.2f, D = 4s, E = "Hello", }': [
			{
				type: 'mcdoc:literal',
				range: { start: 0, end: 4 },
				value: 'enum',
				colorTokenType: 'keyword',
			},
			{
				type: 'mcdoc:literal',
				range: { start: 6, end: 10 },
				value: 'int',
				colorTokenType: 'type',
			},
			{
				type: 'mcdoc:identifier',
				options: { category: 'mcdoc/enum_field' },
				range: { start: 12, end: 15 },
				value: 'Foo',
			},
			{
				type: 'mcdoc:enum/block',
				children: [{
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 23, end: 24 },
						value: 'A',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 27, end: 28 }, value: 1 }],
						range: { start: 27, end: 28 },
					}],
					range: { start: 23, end: 28 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 61, end: 62 },
						value: 'B',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 65, end: 68 }, value: 1.2 }],
						range: { start: 65, end: 68 },
					}],
					range: { start: 61, end: 68 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 75, end: 76 },
						value: 'C',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 79, end: 82 }, value: 1.2 }, {
							type: 'mcdoc:literal',
							range: { start: 82, end: 83 },
							value: 'f',
							colorTokenType: 'keyword',
						}],
						range: { start: 79, end: 83 },
					}],
					range: { start: 75, end: 83 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 90, end: 91 },
						value: 'D',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 94, end: 95 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 95, end: 96 },
							value: 's',
							colorTokenType: 'keyword',
						}],
						range: { start: 94, end: 96 },
					}],
					range: { start: 90, end: 96 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 103, end: 104 },
						value: 'E',
					}, {
						type: 'string',
						range: { start: 107, end: 114 },
						options: {},
						value: 'Hello',
						valueMap: [{ inner: { start: 0, end: 0 }, outer: { start: 108, end: 108 } }],
						quote: '"',
					}],
					range: { start: 103, end: 114 },
				}],
				range: { start: 16, end: 121 },
			},
		],
		'enum (long) Foo { A = 1, B = 4l, C = 5L, D = 1.2, E = 1.2f, F = 4s, G = "Hello", }': [
			{
				type: 'mcdoc:literal',
				range: { start: 0, end: 4 },
				value: 'enum',
				colorTokenType: 'keyword',
			},
			{
				type: 'mcdoc:literal',
				range: { start: 6, end: 10 },
				value: 'long',
				colorTokenType: 'type',
			},
			{
				type: 'mcdoc:identifier',
				options: { category: 'mcdoc/enum_field' },
				range: { start: 12, end: 15 },
				value: 'Foo',
			},
			{
				type: 'mcdoc:enum/block',
				children: [{
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 23, end: 24 },
						value: 'A',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 27, end: 28 }, value: 1 }],
						range: { start: 27, end: 28 },
					}],
					range: { start: 23, end: 28 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 35, end: 36 },
						value: 'B',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'long', range: { start: 39, end: 40 }, value: 4n }, {
							type: 'mcdoc:literal',
							range: { start: 40, end: 41 },
							value: 'l',
							colorTokenType: 'keyword',
						}],
						range: { start: 39, end: 41 },
					}],
					range: { start: 35, end: 41 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 48, end: 49 },
						value: 'C',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'long', range: { start: 52, end: 53 }, value: 5n }, {
							type: 'mcdoc:literal',
							range: { start: 53, end: 54 },
							value: 'L',
							colorTokenType: 'keyword',
						}],
						range: { start: 52, end: 54 },
					}],
					range: { start: 48, end: 54 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 61, end: 62 },
						value: 'D',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 65, end: 68 }, value: 1.2 }],
						range: { start: 65, end: 68 },
					}],
					range: { start: 61, end: 68 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 75, end: 76 },
						value: 'E',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 79, end: 82 }, value: 1.2 }, {
							type: 'mcdoc:literal',
							range: { start: 82, end: 83 },
							value: 'f',
							colorTokenType: 'keyword',
						}],
						range: { start: 79, end: 83 },
					}],
					range: { start: 75, end: 83 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 90, end: 91 },
						value: 'F',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 94, end: 95 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 95, end: 96 },
							value: 's',
							colorTokenType: 'keyword',
						}],
						range: { start: 94, end: 96 },
					}],
					range: { start: 90, end: 96 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 103, end: 104 },
						value: 'G',
					}, {
						type: 'string',
						range: { start: 107, end: 114 },
						options: {},
						value: 'Hello',
						valueMap: [{ inner: { start: 0, end: 0 }, outer: { start: 108, end: 108 } }],
						quote: '"',
					}],
					range: { start: 103, end: 114 },
				}],
				range: { start: 16, end: 121 },
			},
		],
		'enum (float) Foo { A = 1, B = 4f, C = 5F, D = 1.2, E = 1.2f, F = 4s, G = "Hello", }': [
			{
				type: 'mcdoc:literal',
				range: { start: 0, end: 4 },
				value: 'enum',
				colorTokenType: 'keyword',
			},
			{
				type: 'mcdoc:literal',
				range: { start: 6, end: 10 },
				value: 'float',
				colorTokenType: 'type',
			},
			{
				type: 'mcdoc:identifier',
				options: { category: 'mcdoc/enum_field' },
				range: { start: 12, end: 15 },
				value: 'Foo',
			},
			{
				type: 'mcdoc:enum/block',
				children: [{
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 23, end: 24 },
						value: 'A',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 27, end: 28 }, value: 1 }],
						range: { start: 27, end: 28 },
					}],
					range: { start: 23, end: 28 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 35, end: 36 },
						value: 'B',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 39, end: 40 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 40, end: 41 },
							value: 'f',
							colorTokenType: 'keyword',
						}],
						range: { start: 39, end: 41 },
					}],
					range: { start: 35, end: 41 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 48, end: 49 },
						value: 'C',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 52, end: 53 }, value: 5 }, {
							type: 'mcdoc:literal',
							range: { start: 53, end: 54 },
							value: 'F',
							colorTokenType: 'keyword',
						}],
						range: { start: 52, end: 54 },
					}],
					range: { start: 48, end: 54 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 61, end: 62 },
						value: 'D',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 65, end: 68 }, value: 1.2 }],
						range: { start: 65, end: 68 },
					}],
					range: { start: 61, end: 68 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 75, end: 76 },
						value: 'E',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 79, end: 82 }, value: 1.2 }, {
							type: 'mcdoc:literal',
							range: { start: 82, end: 83 },
							value: 'f',
							colorTokenType: 'keyword',
						}],
						range: { start: 79, end: 83 },
					}],
					range: { start: 75, end: 83 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 90, end: 91 },
						value: 'F',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 94, end: 95 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 95, end: 96 },
							value: 's',
							colorTokenType: 'keyword',
						}],
						range: { start: 94, end: 96 },
					}],
					range: { start: 90, end: 96 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 103, end: 104 },
						value: 'G',
					}, {
						type: 'string',
						range: { start: 107, end: 114 },
						options: {},
						value: 'Hello',
						valueMap: [{ inner: { start: 0, end: 0 }, outer: { start: 108, end: 108 } }],
						quote: '"',
					}],
					range: { start: 103, end: 114 },
				}],
				range: { start: 16, end: 121 },
			},
		],
		'enum (double) Foo { A = 1, B = 4d, C = 5D, D = 1.2, E = 1.2f, F = 4s, G = "Hello", }': [
			{
				type: 'mcdoc:literal',
				range: { start: 0, end: 4 },
				value: 'enum',
				colorTokenType: 'keyword',
			},
			{
				type: 'mcdoc:literal',
				range: { start: 6, end: 10 },
				value: 'double',
				colorTokenType: 'type',
			},
			{
				type: 'mcdoc:identifier',
				options: { category: 'mcdoc/enum_field' },
				range: { start: 12, end: 15 },
				value: 'Foo',
			},
			{
				type: 'mcdoc:enum/block',
				children: [{
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 23, end: 24 },
						value: 'A',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 27, end: 28 }, value: 1 }],
						range: { start: 27, end: 28 },
					}],
					range: { start: 23, end: 28 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 35, end: 36 },
						value: 'B',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 39, end: 40 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 40, end: 41 },
							value: 'd',
							colorTokenType: 'keyword',
						}],
						range: { start: 39, end: 41 },
					}],
					range: { start: 35, end: 41 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 48, end: 49 },
						value: 'C',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 52, end: 53 }, value: 5 }, {
							type: 'mcdoc:literal',
							range: { start: 53, end: 54 },
							value: 'D',
							colorTokenType: 'keyword',
						}],
						range: { start: 52, end: 54 },
					}],
					range: { start: 48, end: 54 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 61, end: 62 },
						value: 'D',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 65, end: 68 }, value: 1.2 }],
						range: { start: 65, end: 68 },
					}],
					range: { start: 61, end: 68 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 75, end: 76 },
						value: 'E',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 79, end: 82 }, value: 1.2 }, {
							type: 'mcdoc:literal',
							range: { start: 82, end: 83 },
							value: 'f',
							colorTokenType: 'keyword',
						}],
						range: { start: 79, end: 83 },
					}],
					range: { start: 75, end: 83 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 90, end: 91 },
						value: 'F',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 94, end: 95 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 95, end: 96 },
							value: 's',
							colorTokenType: 'keyword',
						}],
						range: { start: 94, end: 96 },
					}],
					range: { start: 90, end: 96 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 103, end: 104 },
						value: 'G',
					}, {
						type: 'string',
						range: { start: 107, end: 114 },
						options: {},
						value: 'Hello',
						valueMap: [{ inner: { start: 0, end: 0 }, outer: { start: 108, end: 108 } }],
						quote: '"',
					}],
					range: { start: 103, end: 114 },
				}],
				range: { start: 16, end: 121 },
			},
		],
		'enum (string) Foo { A = 1, B = 1.2, C = "Hello", }': [
			{
				type: 'mcdoc:literal',
				range: { start: 0, end: 4 },
				value: 'enum',
				colorTokenType: 'keyword',
			},
			{
				type: 'mcdoc:literal',
				range: { start: 6, end: 10 },
				value: 'string',
				colorTokenType: 'type',
			},
			{
				type: 'mcdoc:identifier',
				options: { category: 'mcdoc/enum_field' },
				range: { start: 12, end: 15 },
				value: 'Foo',
			},
			{
				type: 'mcdoc:enum/block',
				children: [{
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 23, end: 24 },
						value: 'A',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 27, end: 28 }, value: 1 }],
						range: { start: 27, end: 28 },
					}],
					range: { start: 23, end: 28 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 61, end: 62 },
						value: 'B',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 65, end: 68 }, value: 1.2 }],
						range: { start: 65, end: 68 },
					}],
					range: { start: 61, end: 68 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 103, end: 104 },
						value: 'C',
					}, {
						type: 'string',
						range: { start: 107, end: 114 },
						options: {},
						value: 'Hello',
						valueMap: [{ inner: { start: 0, end: 0 }, outer: { start: 108, end: 108 } }],
						quote: '"',
					}],
					range: { start: 103, end: 114 },
				}],
				range: { start: 16, end: 121 },
			},
		],
		'enum () Foo { A = 1, B = 1.2, C = 1.2f, D = 4s, E = "Hello", }': [
			{
				type: 'mcdoc:literal',
				range: { start: 0, end: 4 },
				value: 'enum',
				colorTokenType: 'keyword',
			},
			{
				type: 'mcdoc:identifier',
				options: { category: 'mcdoc/enum_field' },
				range: { start: 12, end: 15 },
				value: 'Foo',
			},
			{
				type: 'mcdoc:enum/block',
				children: [{
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 23, end: 24 },
						value: 'A',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 27, end: 28 }, value: 1 }],
						range: { start: 27, end: 28 },
					}],
					range: { start: 23, end: 28 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 61, end: 62 },
						value: 'B',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 65, end: 68 }, value: 1.2 }],
						range: { start: 65, end: 68 },
					}],
					range: { start: 61, end: 68 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 75, end: 76 },
						value: 'C',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'float', range: { start: 79, end: 82 }, value: 1.2 }, {
							type: 'mcdoc:literal',
							range: { start: 82, end: 83 },
							value: 'f',
							colorTokenType: 'keyword',
						}],
						range: { start: 79, end: 83 },
					}],
					range: { start: 75, end: 83 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 90, end: 91 },
						value: 'D',
					}, {
						type: 'mcdoc:typed_number',
						children: [{ type: 'integer', range: { start: 94, end: 95 }, value: 4 }, {
							type: 'mcdoc:literal',
							range: { start: 95, end: 96 },
							value: 's',
							colorTokenType: 'keyword',
						}],
						range: { start: 94, end: 96 },
					}],
					range: { start: 90, end: 96 },
				}, {
					type: 'mcdoc:enum/field',
					children: [{
						type: 'mcdoc:identifier',
						options: { category: 'mcdoc/enum_field' },
						range: { start: 103, end: 104 },
						value: 'E',
					}, {
						type: 'string',
						range: { start: 107, end: 114 },
						options: {},
						value: 'Hello',
						valueMap: [{ inner: { start: 0, end: 0 }, outer: { start: 108, end: 108 } }],
						quote: '"',
					}],
					range: { start: 103, end: 114 },
				}],
				range: { start: 16, end: 121 },
			},
		],
	},
}

describe('mcdoc binder', () => {
	for (const [binderName, nodeSuites] of Object.entries(Suites)) {
		const fileName = binderName.indexOf(':') > 0
			? binderName.substring(binderName.indexOf(':') + 1)
			: binderName
		const uri = new URL(`./${fileName}.spec.ts`, import.meta.url)
		describe(binderName, async () => {
			for (const [mcdocName, childNodes] of Object.entries(nodeSuites)) {
				const project = mockProjectData()
				const itTitle = `Bind '${mcdocName}'`
				const binderCtx = BinderContext.create(project, {
					doc: TextDocument.create('', '', 0, ''),
				})
				const range = Range.span(childNodes[0].range, childNodes[childNodes.length - 1].range)
				const node: ModuleNode = {
					type: 'mcdoc:module',
					range,
					children: [{ type: binderName, range, children: childNodes } as TopLevelNode],
				}
				await module_(node, { ...binderCtx, moduleIdentifier: 'test' })
				it(itTitle, (t) => {
					snapshotWithUri(t, {
						uri,
						value: {
							symbols: SymbolTable.unlink(binderCtx.symbols.global),
							errors: binderCtx.err.errors,
						},
					})
				})
			}
		})
	}
})
