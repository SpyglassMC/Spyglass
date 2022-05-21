import type { AstNode, ColorTokenType, CommentNode, FloatNode, InfallibleParser, Mutable, Parser, ParserContext, ResourceLocationNode, ResourceLocationOptions, SequenceUtil, Source, StringNode } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { any, Arrayable, failOnEmpty, failOnError, Failure, map, optional, Range, repeat, ResourceLocation, select, sequence, setType, SymbolAccessType, validate } from '@spyglassmc/core'
import { arrayToMessage, localeQuote, localize } from '@spyglassmc/locales'
import type { AccessorKeyNode, AnyTypeNode, AttributeNode, AttributeTreeNamedValuesNode, AttributeTreeNode, AttributeTreePosValuesNode, AttributeValueNode, BooleanTypeNode, DispatcherTypeNode, DispatchStatementNode, DocCommentsNode, DynamicIndexNode, EnumBlockNode, EnumFieldNode, EnumInjectionNode, EnumNode, EnumValueNode, IdentifierNode, IndexBodyNode, InjectionNode, ListTypeNode, LiteralNode, LiteralTypeNode, ModuleNode, NumericTypeNode, PathNode, PrimitiveArrayTypeNode, StringTypeNode, StructBlockNode, StructInjectionNode, StructKeyNode, StructMapKeyNode, StructNode, StructPairFieldNode, StructSpreadFieldNode, TopLevelNode, TupleTypeNode, TypeAliasNode, TypedNumberNode, TypeNode, TypeParamBlockNode, TypeParamNode, UnionTypeNode, UseStatementNode } from '../node'

declare const TODO: any

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
function syntax<PA extends SP<AstNode>[]>(parsers: PA, delegatesDocComments?: boolean): PA extends SIP<AstNode>[]
	? InfallibleParser<SyntaxUtil<{ [K in number]: PA[K] extends SP<infer V> ? V : never }[number]>>
	: Parser<SyntaxUtil<{ [K in number]: PA[K] extends SP<infer V> ? V : never }[number]>>
function syntax(parsers: SP<AstNode>[], delegatesDocComments = false): Parser<SyntaxUtil<AstNode>> {
	return (src, ctx) => {
		src.skipWhitespace()
		const ans = sequence(parsers, syntaxGap(delegatesDocComments))(src, ctx)
		src.skipWhitespace()
		return ans
	}
}

/**
 * @template CN Child node.
 * 
 * @param parser Must be fallible.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parser being repeated zero or more times.
 */
function syntaxRepeat<CN extends AstNode>(parser: InfallibleParser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap?: boolean): { _inputParserIsInfallible: never } & void
function syntaxRepeat<CN extends AstNode>(parser: Parser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN>>
function syntaxRepeat<CN extends AstNode>(parser: Parser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap = false): InfallibleParser<SyntaxUtil<CN>> | void {
	return repeat<CN | CommentNode>(parser, syntaxGap(forbidsDocCommentsInGap))
}

function literal(literal: Arrayable<string>, options?: { specialChars?: Set<string>, colorTokenType?: ColorTokenType }): InfallibleParser<LiteralNode> {
	return (src, ctx) => {
		const ans: LiteralNode = {
			type: 'mcdoc:literal',
			range: Range.create(src),
			value: '',
			colorTokenType: options?.colorTokenType,
		}
		ans.value = src.readIf(c => options?.specialChars?.has(c) || /[a-z]/i.test(c))
		ans.range.end = src.cursor
		if (Arrayable.toArray(literal).every(l => l !== ans.value)) {
			ctx.err.report(localize('expected-got', arrayToMessage(literal), localeQuote(ans.value)), ans)
		}
		return ans
	}
}

function punctuation(punctuation: string): InfallibleParser<undefined> {
	return (src, ctx) => {
		src.skipWhitespace()
		if (!src.trySkip(punctuation)) {
			ctx.err.report(localize('expected-got', localeQuote(punctuation), localeQuote(src.peek())), src)
		}
		return undefined
	}
}

function marker(punctuation: string): Parser<undefined> {
	return (src, _ctx) => {
		src.skipWhitespace()
		if (!src.trySkip(punctuation)) {
			return Failure
		}
		return undefined
	}
}

function resLoc(options: ResourceLocationOptions): InfallibleParser<ResourceLocationNode> {
	return validate(
		core.resourceLocation(options),
		res => res.namespace !== undefined,
		localize('mcdoc.parser.resource-location.colon-expected', localeQuote(ResourceLocation.NamespacePathSep))
	)
}

const string: InfallibleParser<StringNode> = core.string({
	escapable: { characters: ['b', 'f', 'n', 'r', 't', '\\', '"'], unicode: true },
	quotes: ['"'],
})

const identifier: InfallibleParser<IdentifierNode> = (src, ctx) => {
	// https://spyglassmc.com/user/mcdoc/#identifier
	const IdentifierStart = /^[\p{L}\p{Nl}]$/u
	const IdentifierContinue = /^[\p{L}\p{Nl}\u200C\u200D\p{Mn}\p{Mc}\p{Nd}\p{Pc}]$/u
	const ReservedWords = new Set(['any', 'boolean', 'byte', 'double', 'enum', 'false', 'float', 'int', 'long', 'short', 'string', 'struct', 'super', 'true'])
	const ans: Mutable<IdentifierNode> = {
		type: 'mcdoc:identifier',
		range: Range.create(src),
		options: { category: 'mcdoc' },
		value: '',
	}
	const start = src.innerCursor

	if (IdentifierStart.test(src.peek())) {
		src.skip()
		while (IdentifierContinue.test(src.peek())) {
			src.skip()
		}
	} else {
		ctx.err.report(localize('expected', localize('mcdoc.node.identifier')), src)
	}

	ans.value = src.string.slice(start, src.innerCursor)
	ans.range.end = src.cursor

	if (ReservedWords.has(ans.value)) {
		ctx.err.report(localize('mcdoc.parser.identifier.reserved-word', localeQuote(ans.value)), ans)
	}

	return ans
}

function indexBody(options?: { accessType?: SymbolAccessType, noDynamic?: boolean }): InfallibleParser<IndexBodyNode> {
	const accessorKey: InfallibleParser<AccessorKeyNode> = select([
		{
			prefix: '%',
			parser: literal(['%key', '%parent'], { specialChars: new Set(['%']) }),
		},
		{
			prefix: '"',
			parser: string,
		},
		{
			parser: identifier,
		},
	])

	const dynamicIndex: InfallibleParser<DynamicIndexNode> = setType(
		'mcdoc:dynamic_index',
		syntax([
			punctuation('['),
			accessorKey,
			repeat(sequence([marker('.'), accessorKey])),
			punctuation(']'),
		])
	)

	const index: InfallibleParser<LiteralNode | IdentifierNode | StringNode | ResourceLocationNode | DynamicIndexNode> = select([
		{
			prefix: '%',
			parser: literal(['%fallback', '%none'], { specialChars: new Set(['%']) }),
		},
		{
			prefix: '"',
			parser: string,
		},
		{
			prefix: '[',
			parser: dynamicIndex,
		},
		{
			parser: any([resLoc({ category: 'mcdoc/dispatcher', accessType: options?.accessType }), identifier]),
		},
	])

	return setType(
		'mcdoc:index_body',
		syntax([
			punctuation('['),
			index,
			syntaxRepeat(syntax([marker(','), failOnEmpty(index)])),
			optional(marker(',')),
		])
	)
}

const pathSegment: InfallibleParser<IdentifierNode | LiteralNode> = select([
	{ prefix: 'super', parser: literal('super') },
	{ parser: identifier },
])

const path: InfallibleParser<PathNode> = (src, ctx) => {
	let isAbsolute: boolean | undefined
	if (src.trySkip('..')) {
		isAbsolute = true
	}
	return map(
		sequence([
			pathSegment,
			repeat(sequence([marker('::'), pathSegment])),
		]),
		res => {
			const ans: PathNode = {
				type: 'mcdoc:path',
				children: res.children,
				range: res.range,
				isAbsolute,
			}
			return ans
		}
	)(src, ctx)
}

const dispatchStatement: Parser<DispatchStatementNode> = setType(
	'mcdoc:dispatch_statement',
	syntax([
		literal('dispatch', { colorTokenType: 'keyword' }),
		resLoc({ category: 'mcdoc/dispatcher', accessType: SymbolAccessType.Write }),
		indexBody({ noDynamic: true }),
		literal('to'),
		{ get: () => type },
	], true)
)

const docComment: Parser<CommentNode> = core.comment({
	singleLinePrefixes: new Set(['///']),
	includesEol: true,
})

const docComments: InfallibleParser<DocCommentsNode> = setType('mcdoc:doc_comments', repeat(docComment))

const treeBody: InfallibleParser<SyntaxUtil<AttributeTreePosValuesNode | AttributeTreeNamedValuesNode>> = TODO

const attributeTree: InfallibleParser<AttributeTreeNode> = (src, ctx) => {
	const delim = src.trySkip('(') ? '(' : (src.trySkip('[') ? '[' : '{')
	const res = treeBody(src, ctx)
	const ans: AttributeTreeNode = {
		type: 'mcdoc:attribute/tree',
		range: res.range,
		children: res.children,
		delim,
	}
	return ans
}

const attributeValue: InfallibleParser<AttributeValueNode> = select([
	{ predicate: src => ['(', '[', '{'].includes(src.peek()), parser: attributeTree },
	{ parser: { get: () => type } },
])

const attribute: Parser<AttributeNode> = setType(
	'mcdoc:attribute',
	syntax([
		marker('#['),
		identifier,
		select([
			{ prefix: ']', parser: punctuation(']') },
			{ prefix: '=', parser: syntax([attributeValue, punctuation(']')], true) },
			{ parser: syntax([attributeTree, punctuation(']')], true) },
		]),
	], true)
)

const attributes = repeat(attribute)

const prelim: InfallibleParser<SyntaxUtil<DocCommentsNode | AttributeNode>> = syntax([
	optional(failOnEmpty(docComments)),
	attributes,
])

const enumType: InfallibleParser<LiteralNode> = literal([
	'byte',
	'short',
	'int',
	'long',
	'string',
	'float',
	'double',
])

const float: InfallibleParser<FloatNode> = core.float({
	pattern: /^[-+]?(?:[0-9]+(?:[eE][-+]?[0-9]+)?|[0-9]*\.[0-9]+(?:[eE][-+]?[0-9]+)?)$/,
})

const typedNumber: InfallibleParser<TypedNumberNode> = setType(
	'mcdoc:typed_number',
	sequence([
		float,
		literal(['b', 'B', 'd', 'D', 'f', 'F', 'l', 'L', 's', 'S'], { colorTokenType: 'keyword' }),
	])
)

const enumValue: InfallibleParser<EnumValueNode> = select([
	{ prefix: '"', parser: string },
	{ parser: typedNumber },
])

const enumField: InfallibleParser<EnumFieldNode> = setType(
	'mcdoc:enum/field',
	syntax([
		prelim,
		identifier,
		punctuation('='),
		enumValue,
	], true)
)

const enumBlock: InfallibleParser<EnumBlockNode> = setType(
	'mcdoc:enum/block',
	syntax([
		punctuation('{'),
		select([
			{ prefix: '}', parser: punctuation('}') },
			{
				parser: syntax([
					enumField,
					syntaxRepeat(syntax([marker(','), failOnEmpty(enumField)])),
					optional(marker(',')),
					punctuation('}'),
				], true),
			},
		]),
	], true)
)

const enum_: InfallibleParser<EnumNode> = setType(
	'mcdoc:enum',
	syntax([
		prelim,
		literal('enum', { colorTokenType: 'keyword' }),
		punctuation('('),
		enumType,
		punctuation(')'),
		optional(failOnError(identifier)),
		enumBlock,
	], true)
)

const typeParam: InfallibleParser<TypeParamNode> = setType(
	'mcdoc:type_param',
	syntax([
		identifier,
		optional(syntax([failOnError(literal('extends')), path])),
	])
)

const typeParamBlock: InfallibleParser<TypeParamBlockNode> = setType(
	'mcdoc:type_param_block',
	syntax([
		punctuation('<'),
		select([
			{ prefix: '>', parser: punctuation('>') },
			{
				parser: syntax([
					typeParam,
					syntaxRepeat(syntax([marker(','), failOnEmpty(typeParam)])),
					optional(marker(',')),
					punctuation('>'),
				]),
			},
		]),
	])
)

const noop: InfallibleParser<undefined> = () => undefined

const optionalTypeParamBlock: InfallibleParser<TypeParamBlockNode | undefined> = select([
	{ prefix: '<', parser: typeParamBlock },
	{ parser: noop },
])

const structMapKey: InfallibleParser<StructMapKeyNode> = setType(
	'mcdoc:struct/map_key',
	syntax([
		punctuation('['),
		{ get: () => type },
		punctuation(']'),
	], true)
)

const structKey: InfallibleParser<StructKeyNode> = select([
	{ prefix: '"', parser: string },
	{ prefix: '[', parser: structMapKey },
	{ parser: identifier },
])

const structPairField: InfallibleParser<StructPairFieldNode> = (src, ctx) => {
	let isOptional: boolean | undefined
	const result0 = syntax([
		prelim,
		structKey,
	], true)(src, ctx)
	if (src.trySkip('?')) {
		isOptional = true
	}
	const result1 = syntax([
		punctuation(':'),
		{ get: () => type },
	])(src, ctx)
	const ans: StructPairFieldNode = {
		type: 'mcdoc:struct/field/pair',
		children: [...result0.children, ...result1.children],
		range: Range.span(result0, result1),
	}
	return ans
}

const structSpreadField: InfallibleParser<StructSpreadFieldNode> = setType(
	'mcdoc:struct/field/spread',
	syntax([
		punctuation('...'),
		{ get: () => type },
	], true)
)

const structField: InfallibleParser<StructPairFieldNode | StructSpreadFieldNode> = select([
	{ prefix: '...', parser: structSpreadField },
	{ parser: structPairField },
])

const structBlock: InfallibleParser<StructBlockNode> = setType(
	'mcdoc:struct/block',
	syntax([
		punctuation('{'),
		select([
			{ prefix: '}', parser: punctuation('}') },
			{
				parser: syntax([
					structField,
					syntaxRepeat(syntax([marker(','), failOnEmpty(structField)], true), true),
					optional(marker(',')),
					punctuation('}'),
				], true),
			},
		]),
	])
)

const struct: InfallibleParser<StructNode> = setType(
	'mcdoc:struct',
	syntax([
		prelim,
		literal('struct', { colorTokenType: 'keyword' }),
		optional(failOnEmpty(identifier)),
		optionalTypeParamBlock,
		structBlock,
	], true)
)

const enumInjection: InfallibleParser<EnumInjectionNode> = setType(
	'mcdoc:injection/enum',
	syntax([
		literal('enum'),
		punctuation('('),
		enumType,
		punctuation(')'),
		path,
		enumBlock,
	])
)

const structInjection: InfallibleParser<StructInjectionNode> = setType(
	'mcdoc:injection/struct',
	syntax([
		literal('struct'),
		path,
		optionalTypeParamBlock,
		structBlock,
	])
)

const injection: InfallibleParser<InjectionNode> = setType(
	'mcdoc:injection',
	syntax([
		literal('inject', { colorTokenType: 'keyword' }),
		select([
			{ prefix: 'enum', parser: enumInjection },
			{ parser: structInjection },
		]),
	])
)

const typeAlias: InfallibleParser<TypeAliasNode> = setType(
	'mcdoc:type_alias',
	syntax([
		prelim,
		literal('type', { colorTokenType: 'keyword' }),
		identifier,
		optionalTypeParamBlock,
		punctuation('='),
		{ get: () => type },
	], true)
)

const useStatement: InfallibleParser<UseStatementNode> = setType(
	'mcdoc:use_statement',
	syntax([
		literal('use', { colorTokenType: 'keyword' }),
		path,
		select([
			{ prefix: 'as', parser: syntax([literal('as'), identifier]) },
			{ parser: noop },
		]),
	])
)

const topLevel: Parser<TopLevelNode> = (src, ctx) => {
	src.skipWhitespace()
	return select([
		{
			predicate: src => src.tryPeek('//') && !src.tryPeek('///'),
			parser: comment,
		},
		{
			prefix: 'dispatch',
			parser: dispatchStatement,
		},
		{
			prefix: 'enum',
			parser: enum_,
		},
		{
			prefix: 'inject',
			parser: injection,
		},
		{
			prefix: 'struct',
			parser: struct,
		},
		{
			prefix: 'type',
			parser: typeAlias,
		},
		{
			prefix: 'use',
			parser: useStatement,
		},
	])(src, ctx)
}

export const module: Parser<ModuleNode> = setType('mcdoc:module', syntaxRepeat(topLevel, true))

function typeBase<T extends string, P extends InfallibleParser>(type: T, parser: P): InfallibleParser<{ type: T } & SyntaxUtil<AttributeNode | IndexBodyNode | (P extends InfallibleParser<infer V> ? V : never)>>
function typeBase<T extends string>(type: T, parser: InfallibleParser): InfallibleParser<{ type: T } & SyntaxUtil<AstNode>> {
	return setType(type, syntax([
		attributes,
		parser,
		syntaxRepeat(failOnEmpty(indexBody())),
	], true))
}

const anyType: InfallibleParser<AnyTypeNode> = typeBase('mcdoc:type/any', literal('any'))

const booleanType: InfallibleParser<BooleanTypeNode> = typeBase('mcdoc:type/boolean', literal('boolean'))

const stringType: InfallibleParser<StringTypeNode> = TODO

const literalType: InfallibleParser<LiteralTypeNode> = TODO

const numericType: InfallibleParser<NumericTypeNode> = TODO

const primitiveArrayType: InfallibleParser<PrimitiveArrayTypeNode> = TODO

const listType: InfallibleParser<ListTypeNode> = TODO

const tupleType: InfallibleParser<TupleTypeNode> = TODO

const dispatcherType: InfallibleParser<DispatcherTypeNode> = TODO

const unionType: InfallibleParser<UnionTypeNode> = TODO

export const type: InfallibleParser<TypeNode> = select([
	{ prefix: 'any', parser: anyType },
	{ prefix: 'boolean', parser: booleanType },
	{ prefix: 'string', parser: stringType },
	{ predicate: src => src.tryPeek('byte') || src.tryPeek('int') || src.tryPeek('long'), parser: any([numericType, primitiveArrayType]) },
	{ predicate: src => src.tryPeek('short') || src.tryPeek('float') || src.tryPeek('double'), parser: numericType },
	{ prefix: '[', parser: any([listType, tupleType]) },
	{ prefix: 'enum', parser: enum_ },
	{ prefix: 'struct', parser: struct },
	{ prefix: '(', parser: unionType },
	{ parser: any([literalType, path, dispatcherType]) },
])
