/**
 * @type {Record<'terminator' | 'syntax' | 'syntax/type', Record<string, { content: string[], functionParams?: string }>>}
 */
export const McdocParserTestSuites = {
	terminator: {
		comment: {
			content: [
				'',
				'/',
				'//',
				'// This is a comment.',
				'/// This is a doc comment.',
				'// This is a comment.\nnext line test;',
			],
		},
		docComment: {
			content: [
				'',
				'/',
				'// This is a comment.',
				'/// This is a doc comment.',
				'/// This is a doc comment.\nnext line test;',
			],
		},
		float: {
			content: [
				'',
				'-1.4',
				'0',
				'.7e+3',
			],
		},
		floatRange: {
			content: [
				'',
				'4.2',
				'4.2..',
				'4.2/..',
				'..9.1',
				'../9.1',
				'4.2..9.1',
				'4.2/../9.1',
			]
		},
		identifier: {
			content: [
				'',
				'foo',
				'123',
				'foo123',
				'foo()bar',
				'foo;bar',
				'foo\nbar',
				'ĦĔĽĻŎ你好捏',
				'super',
			],
		},
		integer: {
			content: [
				'',
				'-1',
				'0',
				'1',
			],
		},
		intRange: {
			content: [
				'',
				'1',
				'1..1',
				'1..',
				'1/..',
				'..2',
				'../2',
				'1..2',
				'1/../2',
			]
		},
		literal: {
			functionParams: "('foo')",
			content: [
				'',
				'foo',
				'foobar',
				'foo something else;',
			],
		},
		path: {
			content: [
				'',
				'foo',
				'foo::bar',
				'::foo::bar',
				'super::foo',
				'super::foo::bar',
				'super::foo something else;',
			],
		},
		resLoc: {
			functionParams: '({ pool: [], allowUnknown: true })',
			content: [
				'',
				'foo',
				'foo:',
				'foo:bar',
				'foo:bar/baz',
				'foo:bar:baz',
				':/',
				'foo:bar\nsomething else;',
			],
		},
		string: {
			content: [
				'',
				'foo',
				'"foo',
				'"foo"',
				'"fo\no"',
				'"fo\\no"',
				'"fo\\Ao"',
			],
		},
	},
	syntax: {
		attribute: {
			content: [
				'',
				'#[',
				'#[]',
				'#[uuid]',
				'#[since=1.17]',
				'#[color=composite_int]',
				'#[vector(dimension=3,integer=true)]',
				'#[advancement_criterion=(type=definition,id=test)]',
				'#[bitfield(enum (int) {})]',
				`#[bitfield=enum (int) {
					Foo = 1,
					Bar = 2,
					Qux = 3,
				}]`,
			],
		},
		dispatchStatement: {
			content: [
				'',
				'dispatch',
				'dispatch minecraft:entity[] to any',
				'dispatch :entity[cow] to boolean',
				`#[since=1.17]
				dispatch minecraft:entity[
					cow,
					sheep,
				] to boolean`,
			],
		},
		docComments: {
			content: [
				`/// First line
				/// Second line
				Not comment`,
			],
		},
		useStatement: {
			content: [
				'',
				'other',
				'use',
				'use foo',
				'use foo/// Trailing doc comment.',
				'use foo as bar',
				'use foo::bar as qux// Trailing comment.',
			],
		},
	},
	'syntax/type': {
		anyType: {
			content: [
				'',
				'other',
				'any',
				'#[id] any',
			],
		},
		booleanType: {
			content: [
				'',
				'other',
				'boolean',
			],
		},
		dispatcherType: {
			content: [
				'',
				'entity[cow]',
				':entity[]',
				'minecraft:entity[cow,[%parent.id],sheep]',
			],
		},
		enum_: {
			content: [
				'',
				'other',
				'enum',
				'enum Foo',
				'enum () Foo',
				'enum (int) Foo',
				'enum (int) {',
				'enum (int) {}',
				'enum (int) Foo {}',
				`enum (double) Foo {
					/// Bar doc
					Bar = 1.2,
					/// Boo doc
					/// Another line
					Boo = 4.2d,
					/// Qux doc
					Qux = 12e3,
				}`,
			],
		},
		listType: {
			content: [
				'',
				'[',
				'[]',
				'[boolean',
				'[boolean]',
				'[[boolean]]',
				'[boolean,]',
			],
		},
		literalType: {
			content: [
				'',
				'other',
				'false',
				'true',
				'"a literal string"',
				'1b',
				'42',
				'1.23e4',
				'9.1f',
			],
		},
		numericType: {
			content: [
				'',
				'other',
				'byte',
				'int @ 4',
				'int @ 4..',
				'int @ ..4',
				'int @ 0..1',
				'double@4.2..5.5',
				'double[]',
			],
		},
		primitiveArrayType: {
			content: [
				'',
				'other[]',
				'byte',
				'byte[]',
				'byte@0..1[]',
				'int[] @ 4',
				'byte @ 0..1 [] @ 0..',
			],
		},
		referenceType: {
			content: [
				'',
				'#[uuid] UuidMostLeast',
				'MinMaxBounds<float @ 1..2>',
			],
		},
		stringType: {
			content: [
				'',
				'other',
				'string',
				'string @',
				'string@42..',
			],
		},
		struct: {
			content: [
				'',
				'other',
				'struct',
				'struct Foo',
				'struct {}',
				'struct Foo {',
				'struct Foo {}',
				`struct Foo {
					/// Hello world.
					Bar: boolean,
					Boo: struct Duh { Ha: any },
					UUID: #[uuid] int[] @ 4,
					#[meh]
					Qux: enum (int) {},
					#[since=1.17]
					...Lol,
				}`,
			],
		},
		tupleType: {
			content: [
				'',
				'[',
				'[]',
				'[boolean',
				'[boolean,',
				'[boolean]',
				'[boolean,]',
				'[boolean,string]',
				'[false,true,[string,],]',
			],
		},
		unionType: {
			content: [
				'',
				'(',
				'()',
				'(boolean)',
				'(boolean | string)',
				'(boolean | string | )',
				`(
					#[until=1.16]
					#[uuid] string |
					#[since=1.16]
					#[uuid] int[] @ 4 |
				)`,
			],
		},
	},
}
