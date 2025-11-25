import { describe, it } from 'node:test'
import type { AstNode, Parser, ParserContext, Result, Source } from '../../lib/index.js'
import {
	any,
	boolean,
	concatOnTrailingBackslash,
	dumpErrors,
	Failure,
	Range,
} from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

interface LiteralNode extends AstNode {
	type: 'literal'
	literal: string
	meta?: string
}

/**
 * @returns A parser that takes `literal` only.
 *
 * `Failure` when it does not encounter the `literal`.
 */
function literal(literal: string, meta?: string, errorAmount = 0): Parser<LiteralNode> {
	return (src: Source, ctx: ParserContext): Result<LiteralNode> => {
		const ans: LiteralNode = {
			type: 'literal',
			literal,
			meta,
			range: Range.create(src, src.cursor + literal.length),
		}
		for (let i = 0; i < errorAmount; i++) {
			ctx.err.report('Parse Error', Range.Beginning)
		}
		if (src.trySkip(literal)) {
			return ans
		}
		return Failure
	}
}

describe('any()', () => {
	const suites: {
		content: string
		parsers: [Parser<AstNode>, ...Parser<AstNode>[]]
		parserToString: string
	}[] = [
		{ parsers: [literal('foo'), literal('bar')], content: 'foo', parserToString: 'foo | bar' },
		{ parsers: [literal('foo'), literal('bar')], content: 'bar', parserToString: 'foo | bar' },
		{ parsers: [literal('foo'), literal('bar')], content: 'qux', parserToString: 'foo | bar' },
		{
			parsers: [literal('foo', 'correct', 1), literal('foo', 'wrong', 1)],
			content: 'foo',
			parserToString: 'foo*1 | foo*1',
		},
		{
			parsers: [literal('foo', 'correct', 1), literal('foo', 'wrong', 2)],
			content: 'foo',
			parserToString: 'foo*1 | foo*2',
		},
		{
			parsers: [literal('foo', 'wrong', 2), literal('foo', 'correct', 1)],
			content: 'foo',
			parserToString: 'foo*2 | foo*1',
		},
	]
	for (const { content, parsers, parserToString } of suites) {
		it(`Parse '${showWhitespaceGlyph(content)}' with '${parserToString}'`, (t) => {
			const parser = any(parsers)
			t.assert.snapshot(testParser(parser, content))
		})
	}
})

describe('dumpErrors()', () => {
	const suites: { name: string; parser: Parser<AstNode>; content: string }[] = [{
		name: 'should output errors when not wrapped with `dumpErrors()`',
		parser: boolean,
		content: 'bar',
	}, {
		name: 'should not output errors when wrapped with `dumpErrors()`',
		parser: dumpErrors(boolean),
		content: 'bar',
	}]
	for (const { name, content, parser } of suites) {
		it(name, (t) => {
			t.assert.snapshot(testParser(parser, content))
		})
	}
})

describe('concatOnTrailingBackslash()', () => {
	const parsers: { parser: Parser<AstNode>; suites: Array<{ content: string }> }[] = [{
		parser: boolean,
		suites: [
			{ content: 'true' },
			{ content: 'true\n' },
			{ content: 'tru\\\ne' },
			{ content: 'tru\\ \ne' },
			{ content: 'tru\\\n e' },
			{ content: 'tru\\ \n e' },
			{ content: 'tru\\ \n \\\n e' },
			{ content: 'tru\\e \\ \n e' },
			{ content: 'tru\\\n\ne' },
			{ content: 'tru\\' },
			{ content: 'tru\\ \n' },
			{ content: 'tru\\ \n ' },
		],
	}]
	for (const { parser, suites } of parsers) {
		for (const { content } of suites) {
			it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
				const wrappedParser = concatOnTrailingBackslash(parser)
				t.assert.snapshot(testParser(wrappedParser, content))
			})
		}
	}
})
