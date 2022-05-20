import type { AstNode, ColorTokenType, CommentNode, InfallibleParser, Parser, ParserContext, ResourceLocationNode, ResourceLocationOptions, SequenceUtil, Source } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { Range, repeat, select, sequence, setType, validate } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { DispatchStatementNode, LiteralNode, ModuleNode, TopLevelNode } from '../node'

/**
 * @returns A comment parser that accepts normal comments (`//`) and reports an error if it's a doc comment (`///`).
 * 
 * `Failure` when there isn't a comment.
 */
const comment: Parser<CommentNode> = validate(
	core.comment({
		singleLinePrefixes: new Set(['//']),
	}),
	(res, src) => !src.slice(res).startsWith('///'),
	localize('mcdoc.parser.syntax.doc-comment-unexpected')
)

/**
 * @returns A parser that parses the gap between **SYNTAX** rules, which may contains whitespace and regular comments.
 */
function syntaxGap(
	/* istanbul ignore next */
	forbidsDocCommentsInGap = false
): InfallibleParser<CommentNode[]> {
	return (src: Source, ctx: ParserContext): CommentNode[] => {
		const ans: CommentNode[] = []

		src.skipWhitespace()

		while (src.canRead() && src.peek(2) === '//' && (!forbidsDocCommentsInGap || src.peek(3) !== '///')) {
			const result = comment(src, ctx) as CommentNode
			ans.push(result)
			src.skipWhitespace()
		}

		return ans
	}
}

type SyntaxUtil<CN extends AstNode> = SequenceUtil<CN | CommentNode>
type SP<CN extends AstNode> = SIP<CN> | Parser<CN | SyntaxUtil<CN> | undefined> | { get: (result: SyntaxUtil<CN>) => Parser<CN | SyntaxUtil<CN> | undefined> }
type SIP<CN extends AstNode> = InfallibleParser<CN | SyntaxUtil<CN> | undefined> | { get: (result: SyntaxUtil<CN>) => InfallibleParser<CN | SyntaxUtil<CN> | undefined> }
/**
 * @template CN Child node.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parsers.
 * 
 * `Failure` when any of the `parsers` returns a `Failure`.
 */
function syntax<PA extends SIP<AstNode>[]>(parsers: PA, delegatesDocComments?: boolean): InfallibleParser<SyntaxUtil<{ [K in number]: PA[K] extends SP<infer V> ? V : never }[number]>>
function syntax<PA extends SP<AstNode>[]>(parsers: PA, delegatesDocComments?: boolean): Parser<SyntaxUtil<{ [K in number]: PA[K] extends SP<infer V> ? V : never }[number]>>
function syntax(parsers: SP<AstNode>[], delegatesDocComments = false): Parser<SyntaxUtil<AstNode>> {
	return sequence(parsers, syntaxGap(delegatesDocComments))
}

/**
 * @template CN Child node.
 * 
 * @param parser Must be fallible.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parser being repeated zero or more times.
 */
function syntaxRepeat<CN extends AstNode>(parser: InfallibleParser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap?: boolean): void
function syntaxRepeat<CN extends AstNode>(parser: Parser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN>>
function syntaxRepeat<CN extends AstNode>(parser: Parser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap = false): InfallibleParser<SyntaxUtil<CN>> {
	return repeat<CN | CommentNode>(parser, syntaxGap(forbidsDocCommentsInGap))
}

function literal(literal: string, options?: { colorTokenType?: ColorTokenType }): InfallibleParser<LiteralNode> {
	return (src, ctx) => {
		const ans: LiteralNode = {
			type: 'mcdoc:literal',
			range: Range.create(src),
			value: '',
			colorTokenType: options?.colorTokenType,
		}
		ans.value = src.readIf(c => /[a-z]/i.test(c))
		ans.range.end = src.cursor
		if (ans.value !== literal) {
			ctx.err.report(localize('expected-got', localeQuote(literal), localeQuote(ans.value)), ans)
		}
		return ans
	}
}

function resLoc(options: ResourceLocationOptions): InfallibleParser<ResourceLocationNode> {
	return validate(
		core.resourceLocation(options),
		(res, _, ctx) => {
			
		}
	)
}

const dispatchStatement: Parser<DispatchStatementNode> = setType(
	'mcdoc:dispatch_statement',
	syntax([
		literal('dispatch'),
		resLoc({ category: 'nbtdoc/dispatcher' }),
		indexBody({ noDynamic: true }),
		literal('to'),
		type,
	], true)
)

const topLevel: Parser<TopLevelNode> = (src, ctx) => {
	src.skipWhitespace()
	return select([
		{
			predicate: src => src.tryPeek('//') && !src.tryPeek('///'),
			parser: comment,
		},
		{
			predicate: src => src.tryPeek('dispatch'),
			parser: dispatchStatement,
		},
		{
			predicate: src => src.tryPeek('enum'),
			parser: enum_,
		},
		{
			predicate: src => src.tryPeek('inject'),
			parser: injection,
		},
		{
			predicate: src => src.tryPeek('struct'),
			parser: struct,
		},
		{
			predicate: src => src.tryPeek('type'),
			parser: typeAlias,
		},
		{
			predicate: src => src.tryPeek('use'),
			parser: useStatement,
		},
		{
			parser: unknownKeyword,
		},
	])(src, ctx)
}

export const module: Parser<ModuleNode> = setType('mcdoc:module', syntaxRepeat(topLevel))
