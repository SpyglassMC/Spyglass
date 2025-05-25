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
	StructSpreadFieldNode,
	TypedNumberNode,
} from '../node'

// These formatters operate under the assumption that each AST node's children are in the same order as they appear when formatted.
// 		With the exception of comments, because those can be moved to the parent if they're at odd locations
// 		(for example a comment between the identifier and '{' of a struct will be moved to before the struct).

const nodeTypesAllowingComments = new Set<string>([
	'mcdoc:module',
	'mcdoc:struct/block',
	'mcdoc:doc_comments',
])

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
	const allowsComments = nodeTypesAllowingComments.has(node.type)
	const children = allowsComments ? liftChildComments(node.children) : node.children

	return children.map((child) => {
		if (child.type === 'comment' && !allowsComments) {
			// Don't format comments if the type doesn't allow them.
			// A parent type that does allow comments should have already included them.
			return ''
		}
		const info = childFormatInfo[child.type as keyof typeof childFormatInfo]
		const value = ctx.meta.getFormatter(child.type)(
			child,
			info?.indentSelf ? indentFormatter(ctx) : ctx,
		)
		const formatted = `${info?.prefix ?? ''}${value}${info?.suffix ?? ''}`
		return formatted
	}).join('')
}

function liftChildComments(
	children: DeepReadonly<AstNode[]>,
): DeepReadonly<AstNode>[] {
	// Get mutable children list so comments from children that don't allow comments can be added to the list.
	const mutableChildren = [...children]
	for (let i = 0; i < mutableChildren.length; i++) {
		const child = mutableChildren[i]
		const comments = findComments(child)
		// Add comments and advance i to not iterate over them again
		mutableChildren.splice(i, 0, ...comments)
		i += comments.length
	}
	return mutableChildren
}

function findComments(node: DeepReadonly<AstNode>): DeepReadonly<AstNode>[] {
	if (!node.children) {
		return []
	}
	return node.children.flatMap((child) => {
		if (child.type === 'comment') {
			return [child]
		}
		if (nodeTypesAllowingComments.has(child.type)) {
			// The child will format its own comments, so we don't need to lift them.
			return []
		}
		return findComments(child)
	})
}

const module: Formatter<ModuleNode> = (node, ctx) => {
	return liftChildComments(node.children).map((child) => {
		const formatted = ctx.meta.getFormatter(child.type)(child, ctx)
		if (child.type !== 'comment') {
			// With an empty line between each non-comment child
			// (comments don't have them, because they probably refer to the next child)
			return `${formatted}\n`
		}
		return formatted
	}).join('\n')
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
