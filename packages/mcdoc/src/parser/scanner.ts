import type { AstNode } from '@spyglassmc/core'

export interface Token {
	kind: TokenKind,
	node: AstNode,
}

export type TokenKind = (typeof Tokens)[number]

export const Tokens = Object.freeze([
	'COMMENT',
	'DOC_COMMENT',
	'EOF',
	'FLOAT',
	'FLOAT_RANGE',
	'IDENTIFIER',
	'INTEGER',
	'INT_RANGE',
	'PATH',
	'PERCENTAGE_KEYWORD',
	'PUNC_AT',            // @
	'PUNC_COMMA',         // ,
	'PUNC_BRACE_OPEN',    // {
	'PUNC_BRACE_CLOSE',   // }
	'PUNC_BRACKETS',      // []
	'PUNC_BRACKET_OPEN',  // [
	'PUNC_BRACKET_CLOSE', // ]
	'PUNC_COLON',         // :
	'PUNC_DOT',           // .
	'PUNC_EQUAL',         // =
	'PUNC_GREATER_THAN',  // >
	'PUNC_LESS_THAN',     // <
	'PUNC_PAREN_OPEN',    // (
	'PUNC_PAREN_CLOSE',   // )
	'PUNC_PIPE',          // |
	'PUNC_QUESTION',      // ?
	'PUNC_SPREAD',        // ...
	'RANGE_DELIMITER',
	'RESOURCE_LOCATION',
	'RESWORD_ANY',
	'RESWORD_BOOLEAN',
	'RESWORD_BYTE',
	'RESWORD_DOUBLE',
	'RESWORD_ENUM',
	'RESWORD_FALSE',
	'RESWORD_FLOAT',
	'RESWORD_INT',
	'RESWORD_LONG',
	'RESWORD_SHORT',
	'RESWORD_STRING',
	'RESWORD_STRUCT',
	'RESWORD_SUPER',
	'RESWORD_TRUE',
	'STRING',
	'TYPED_NUMBER',
	'UNKNOWN',
] as const)
