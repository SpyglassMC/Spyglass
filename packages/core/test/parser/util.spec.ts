import assert from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type {
	AstNode,
	Parser,
	ParserContext,
	Result,
	Source,
} from '../../lib/index.js'
import { any, boolean, dumpErrors, Failure, Range } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.js'

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
function literal(
	literal: string,
	meta?: string,
	errorAmount = 0,
): Parser<LiteralNode> {
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

describe('core util parsers', () => {
	describe('any()', () => {
		const suites: {
			content: string
			parsers: [Parser<AstNode>, ...Parser<AstNode>[]]
			parserToString: string
		}[] = [
			{
				parsers: [literal('foo'), literal('bar')],
				content: 'foo',
				parserToString: 'foo | bar',
			},
			{
				parsers: [literal('foo'), literal('bar')],
				content: 'bar',
				parserToString: 'foo | bar',
			},
			{
				parsers: [literal('foo'), literal('bar')],
				content: 'qux',
				parserToString: 'foo | bar',
			},
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
			it(
				`Parse "${
					showWhitespaceGlyph(
						content,
					)
				}" with "${parserToString}"`,
				() => {
					const parser = any(parsers)
					snapshot(testParser(parser, content))
				},
			)
		}
	})

	describe('dumpErrors()', () => {
		const suites: {
			name: string
			parser: Parser<AstNode>
			content: string
			expectedErrors: any[]
		}[] = [
			{
				name: 'should output errors when not wrapped with `dumpErrors()`',
				parser: boolean,
				content: 'bar',
				expectedErrors: [{
					range: {
						start: 0,
						end: 0,
					},
					message: 'Expected “false” or “true”',
					severity: 3,
				}],
			},
			{
				name: 'should not output errors when wrapped with `dumpErrors()`',
				parser: dumpErrors(boolean),
				content: 'bar',
				expectedErrors: [],
			},
		]
		for (const { name, content, parser, expectedErrors } of suites) {
			it(name, () => {
				const res = testParser(parser, content)
				snapshot(res)
				assert.deepEqual(res.errors, expectedErrors)
			})
		}
	})
})
