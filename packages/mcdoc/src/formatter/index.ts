import type {
	AstNode,
	DeepReadonly,
	Formatter,
	FormatterContext,
	MetaRegistry,
} from '@spyglassmc/core'
import { indentFormatter } from '@spyglassmc/core'
import type {
	AttributeNode,
	DocCommentsNode,
	IdentifierNode,
	LiteralNode,
	LiteralTypeNode,
	ModuleNode,
	NumericTypeNode,
	StructBlockNode,
	StructNode,
	StructPairFieldNode,
	TypedNumberNode,
} from '../node'

// These formatters operate under the assumption that each AST node's children are in the same order as they appear when formatted.

function formatChildren<TNode extends AstNode & { children: AstNode[] }>(
	node: DeepReadonly<TNode>,
	ctx: FormatterContext,
	childFormatInfo: {
		[TChildType in TNode['children'][number]['type']]?: {
			prefix?: string
			suffix?: string
			indentSelf?: boolean
		}
	},
): string {
	return node.children.map((child) => {
		const info = childFormatInfo[child.type as keyof typeof childFormatInfo]
		const value = ctx.meta.getFormatter(child.type)(
			child,
			info?.indentSelf ? indentFormatter(ctx) : ctx,
		)
		const formatted = `${info?.prefix ?? ''}${value}${info?.suffix ?? ''}`
		return formatted
	}).join('')
}

const module: Formatter<ModuleNode> = (node, ctx) => {
	return node.children.map((child) => {
		return ctx.meta.getFormatter(child.type)(child, ctx)
	}).join('\n\n') // With an empty line between each child
}

const struct: Formatter<StructNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:attribute': { suffix: '\n' },
		'mcdoc:literal': { suffix: ' ' },
		'mcdoc:identifier': { suffix: ' ' },
	})
}

const structBlock: Formatter<StructBlockNode> = (node, ctx) => {
	if (node.children.length === 0) {
		return '{}'
	}
	const content = formatChildren(node, ctx, {
		'comment': { prefix: ctx.indent(1), suffix: '\n', indentSelf: true },
		'mcdoc:struct/field/pair': { prefix: ctx.indent(1), suffix: ',\n', indentSelf: true },
		'mcdoc:struct/field/spread': { prefix: ctx.indent(1), suffix: ',\n', indentSelf: true }, // TODO: Type
	})
	return `{\n${content}${ctx.indent()}}`
}

const structPairField: Formatter<StructPairFieldNode> = (node, ctx) => {
	const keySuffix = `${node.isOptional ? '?' : ''}: `
	return formatChildren(node, ctx, {
		'mcdoc:struct/map_key': { suffix: keySuffix },
		'mcdoc:identifier': { suffix: keySuffix },
		'string': { suffix: keySuffix },
	})
}

const attribute: Formatter<AttributeNode> = (node, ctx) => {
	const hasTypeValue = node.children.some(child => child.type.startsWith('mcdoc:type/'))
	return formatChildren(node, ctx, {
		'comment': { suffix: '\n' },
		'mcdoc:identifier': { prefix: '#[', suffix: hasTypeValue ? '=' : '' },
	}) + ']'
}

const literalType: Formatter<LiteralTypeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const typedNumber: Formatter<TypedNumberNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const numericType: Formatter<NumericTypeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const literal: Formatter<LiteralNode> = (node) => {
	return node.value
}

const identifier: Formatter<IdentifierNode> = (node) => {
	return node.value
}

const docComments: Formatter<DocCommentsNode> = (node, ctx) => {
	if (node.children.length === 0) {
		return ''
	}
	// No need to add new lines, because DocCommentNodes include them
	return formatChildren(node, ctx, {})
}

export function registerMcdocFormatter(meta: MetaRegistry): void {
	meta.registerFormatter<ModuleNode>('mcdoc:module', module)
	meta.registerFormatter<StructNode>('mcdoc:struct', struct)
	meta.registerFormatter<StructBlockNode>('mcdoc:struct/block', structBlock)
	meta.registerFormatter<StructPairFieldNode>('mcdoc:struct/field/pair', structPairField)
	meta.registerFormatter<AttributeNode>('mcdoc:attribute', attribute)
	meta.registerFormatter<LiteralTypeNode>('mcdoc:type/literal', literalType)
	meta.registerFormatter<TypedNumberNode>('mcdoc:typed_number', typedNumber)
	meta.registerFormatter<NumericTypeNode>('mcdoc:type/numeric_type', numericType)
	meta.registerFormatter<LiteralNode>('mcdoc:literal', literal)
	meta.registerFormatter<IdentifierNode>('mcdoc:identifier', identifier)
	meta.registerFormatter<DocCommentsNode>('mcdoc:doc_comments', docComments)
}
