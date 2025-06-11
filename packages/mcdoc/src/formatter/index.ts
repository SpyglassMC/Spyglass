import type {
	AstNode,
	DeepReadonly,
	Formatter,
	FormatterContext,
	MetaRegistry,
} from '@spyglassmc/core'
import { indentFormatter } from '@spyglassmc/core'
import { node } from 'webpack'
import type {
	AnyTypeNode,
	AttributeNode,
	AttributeTreeNamedValuesNode,
	AttributeTreeNode,
	AttributeTreePosValuesNode,
	BooleanTypeNode,
	DispatcherTypeNode,
	DispatchStatementNode,
	DocCommentsNode,
	DynamicIndexNode,
	EnumBlockNode,
	EnumFieldNode,
	EnumInjectionNode,
	EnumNode,
	FloatRangeNode,
	IdentifierNode,
	IndexBodyNode,
	InjectionNode,
	IntRangeNode,
	ListTypeNode,
	LiteralNode,
	LiteralTypeNode,
	ModuleNode,
	NumericTypeNode,
	PathNode,
	PrimitiveArrayTypeNode,
	ReferenceTypeNode,
	StringTypeNode,
	StructBlockNode,
	StructInjectionNode,
	StructMapKeyNode,
	StructNode,
	StructPairFieldNode,
	StructSpreadFieldNode,
	TupleTypeNode,
	TypeAliasNode,
	TypeArgBlockNode,
	TypedNumberNode,
	TypeParamBlockNode,
	TypeParamNode,
	UnionTypeNode,
	UseStatementNode,
} from '../node'
import { AttributeTreeClosure } from '../parser/index.js'

// These formatters operate under the assumption that each AST node's children are in the same order as they appear when formatted.
// 		With the exception of comments, because those can be moved to the parent if they're at odd locations
// 		(for example a comment between the identifier and '{' of a struct will be moved to before the struct).

const nodeTypesAllowingComments = new Set<string>([
	'mcdoc:module',
	'mcdoc:struct/block',
	'mcdoc:enum/block',
	'mcdoc:doc_comments',
	'mcdoc:type/tuple',
	'mcdoc:type/union',
])

const nodeTypesAllowingTrailingComments = new Set<string>([
	'mcdoc:module',
	'mcdoc:struct/block',
	'mcdoc:enum/block',
	'mcdoc:doc_comments',
])

const prelimNodeTypes = new Set<string>([
	'mcdoc:attribute',
	'mcdoc:doc_comments',
])

interface ChildFormatInfo {
	prefix?: string
	suffix?: string
	indentSelf?: boolean
}

function formatChildren<TNode extends AstNode & { children: AstNode[] }>(
	node: DeepReadonly<TNode>,
	ctx: FormatterContext,
	childFormatInfo: {
		[TChildType in TNode['children'][number]['type']]?: ChildFormatInfo
	},
	excludeLastChildSuffix: boolean = false,
	onlyFormatPrelimType?: TNode['children'][number]['type'],
): string {
	const allowsComments = nodeTypesAllowingComments.has(node.type)
	const allowsTrailingComments = nodeTypesAllowingTrailingComments.has(node.type)
	const children = allowsComments ? liftChildComments(node.children) : node.children
	const lastNonComment = children.findLastIndex((child) => child.type !== 'comment')
	const lastFormattedChild = onlyFormatPrelimType !== undefined
		? children.findLastIndex((child) => child.type === onlyFormatPrelimType)
		// Exclude trailing comments, so trailing comments don't change
		// whether the node in front of the comments has the suffix
		: children.findLastIndex((child) => child.type !== 'comment')

	const content = children.map((child, i) => {
		// Only format prelim when it's supposed to be formatted
		// and don't format other nodes when they're not supposed to be formatted.
		if (onlyFormatPrelimType !== undefined && child.type !== onlyFormatPrelimType) {
			return ''
		}
		if (onlyFormatPrelimType === undefined && prelimNodeTypes.has(child.type)) {
			return ''
		}

		if (child.type === 'comment' && !allowsComments) {
			// Don't format comments if the type doesn't allow them.
			// A parent type that does allow comments should have already included them.
			return ''
		}
		if (i > lastNonComment && !allowsTrailingComments) {
			// Don't format trailing comments if the type doesn't allow them.
			// A parent type that does allow comments should have already included them.
			return ''
		}
		const info = childFormatInfo[child.type as keyof typeof childFormatInfo]
		const value = ctx.meta.getFormatter(child.type)(
			child,
			info?.indentSelf ? indentFormatter(ctx) : ctx,
		)
		const prefix = info?.prefix ?? ''
		const hasSuffix = info?.suffix !== undefined
			&& (!excludeLastChildSuffix || lastFormattedChild !== i)
		const suffix = hasSuffix ? info.suffix : ''
		const formatted = `${prefix}${value}${suffix}`
		return formatted
	}).join('')

	return content
}

function hasMultilineChild(
	node: DeepReadonly<AstNode>,
	isRecursiveCall: boolean = false,
	alwaysIncludeComments: boolean = false,
): boolean {
	if (!node.children) {
		return false
	}
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i]
		if (child.type === 'comment') {
			if (alwaysIncludeComments) {
				return true
			}
			if (nodeTypesAllowingComments.has(node.type)) {
				if (nodeTypesAllowingTrailingComments.has(node.type)) {
					return true
				}
				// Only return true if there's a non-comment node after the comment, so
				// the comment isn't moved outside the node.
				// We only need to check whether i+1 is not a comment instead of checking
				// all of the nodes after i, because even in the case where i+1 is a comment,
				// but i+2 is a non-comment, the check will still succeed true in the next iteration.
				if (i < node.children.length - 1 && node.children[i + 1].type !== 'comment') {
					return true
				}
			}
		}
		if (child.type === 'mcdoc:struct') {
			return true
		}
		if (child.type === 'mcdoc:enum') {
			return true
		}
		if (isRecursiveCall && child.type === 'mcdoc:attribute') {
			// Attributes only count as multiline for a recursive call, because attributes found
			// during the first call would be put in front of the node and not inside it.
			return true
		}
		if (
			hasMultilineChild(
				child,
				true,
				alwaysIncludeComments || i < node.children.length - 1,
			)
		) {
			return true
		}
	}
	return false
}

const maxDynamicInlineLength = 80 // Kind of arbitrary

function formatDynamicMultiline(
	node: DeepReadonly<AstNode>,
	formatter: (doMultiline: boolean) => string,
): string {
	if (hasMultilineChild(node)) {
		return formatter(true)
	}
	const inlineFormat = formatter(false)
	if (inlineFormat.length > maxDynamicInlineLength) {
		return formatter(true)
	}
	return inlineFormat
}

function formatWithPrelim<TNode extends AstNode & { children: AstNode[] }>(
	node: DeepReadonly<TNode>,
	ctx: FormatterContext,
	putAttributesOnSeparateLine: boolean,
	putDocOnSeparateLine: boolean,
	contentFormatter: (contentCtx: FormatterContext) => string,
): string {
	function attributeFormatter(doMultiline: boolean, attributeCtx: FormatterContext): string {
		const childFormatInfo = {
			'mcdoc:attribute': {
				suffix: doMultiline ? `\n${attributeCtx.indent()}` : ' ',
			},
		}
		return formatChildren<TNode>(
			node,
			attributeCtx,
			childFormatInfo,
			// Last suffix is excluded, because it is specified separately through `putAttributesOnSeparateLine`.
			// This makes it possible to put all attributes on one line but still add a newline at the end.
			true,
			'mcdoc:attribute',
		)
	}

	const shouldIndentPrelim = !putDocOnSeparateLine
		&& node.children.some((child) => child.type === 'mcdoc:doc_comments')

	function processFormattedAttributes(
		formattedAttributes: string,
		areAttributesMultiline: boolean,
	): string {
		const formattedDocComments = formatChildren(
			node,
			putDocOnSeparateLine ? ctx : indentFormatter(ctx),
			{},
			false,
			'mcdoc:doc_comments',
		)

		const hasAdditionalIndent = shouldIndentPrelim
			|| (!putAttributesOnSeparateLine && areAttributesMultiline)

		if (formattedAttributes !== '') {
			if (hasAdditionalIndent) {
				formattedAttributes += `\n${ctx.indent(1)}`
			} else if (putAttributesOnSeparateLine) {
				formattedAttributes += `\n${ctx.indent()}`
			} else {
				formattedAttributes += ' '
			}
		}

		const prelim = (hasAdditionalIndent ? `\n${ctx.indent(1)}` : '')
			+ formattedDocComments + formattedAttributes

		const content = contentFormatter(
			hasAdditionalIndent
				? indentFormatter(ctx)
				: ctx,
		)
		return prelim + content
	}

	const multilineChild = node.children?.some((child) => {
		child.type === 'mcdoc:attribute' && hasMultilineChild(child)
	})
	if (multilineChild) {
		return processFormattedAttributes(
			attributeFormatter(true, putAttributesOnSeparateLine ? ctx : indentFormatter(ctx)),
			true,
		)
	}
	const inlineAttributes = attributeFormatter(false, ctx)
	if (inlineAttributes.length > maxDynamicInlineLength) {
		return processFormattedAttributes(
			attributeFormatter(true, putAttributesOnSeparateLine ? ctx : indentFormatter(ctx)),
			true,
		)
	}
	return processFormattedAttributes(
		(shouldIndentPrelim ? ctx.indent(1) : '') + inlineAttributes,
		false,
	)
}

function liftChildComments(
	children: DeepReadonly<AstNode[]>,
): DeepReadonly<AstNode>[] {
	// Get mutable children list so comments from children that don't allow comments can be added to the list.
	const mutableChildren = [...children]
	for (let i = 0; i < mutableChildren.length; i++) {
		const child = mutableChildren[i]
		const { beforeNode, afterNode } = findComments(child)
		// Add comments and advance i to not iterate over them again
		mutableChildren.splice(i, 0, ...beforeNode)
		i += beforeNode.length
		mutableChildren.splice(i + 1, 0, ...afterNode)
		i += afterNode.length
	}
	return mutableChildren
}

function findComments(node: DeepReadonly<AstNode>): {
	beforeNode: DeepReadonly<AstNode>[]
	afterNode: DeepReadonly<AstNode>[]
} {
	const result = {
		beforeNode: [] as DeepReadonly<AstNode>[],
		afterNode: [] as DeepReadonly<AstNode>[],
	}
	if (!node.children) {
		return result
	}
	let currentCommentSequence = [] as DeepReadonly<AstNode>[]
	node.children.forEach((child) => {
		if (child.type === 'comment') {
			currentCommentSequence.push(child)
			return
		}
		result.beforeNode.push(...currentCommentSequence)
		currentCommentSequence = []
		const childComments = findComments(child)
		if (nodeTypesAllowingComments.has(child.type)) {
			// The child will format its own comments, so we don't need to lift them.

			// Comments at the end of the child are still lifted for some nodes, because they can't be distinguished from comments
			// that come after the child.
			if (!nodeTypesAllowingTrailingComments.has(child.type)) {
				currentCommentSequence = childComments.afterNode
			}
			return
		}
		result.beforeNode.push(...childComments.beforeNode)
		currentCommentSequence = childComments.afterNode
	})
	result.afterNode.push(...currentCommentSequence)
	return result
}

function getTypeNodes(
	children: DeepReadonly<AstNode[]>,
): DeepReadonly<AstNode[]> {
	return children.filter((child) =>
		child.type.startsWith('mcdoc:type/') || child.type === 'mcdoc:enum'
		|| child.type === 'mcdoc:struct'
	)
}

const module: Formatter<ModuleNode> = (node, ctx) => {
	const children = liftChildComments(node.children)
	return children.map((child, i) => {
		const formatted = ctx.meta.getFormatter(child.type)(child, ctx)
		if (child.type === 'comment') {
			return formatted
		}
		if (child.type === 'mcdoc:use_statement' && children[i + 1]?.type === 'mcdoc:use_statement') {
			return formatted
		}
		// With an empty line between nodes
		// (comments don't have them, because they probably refer to the next child)
		// (use statements don't have them between each other, because use statements are supposed to be grouped together)
		return `${formatted}\n`
	}).join('\n')
}

const useStatement: Formatter<UseStatementNode> = (node, ctx) => {
	const hasAlias = node.children.some((child) => child.type === 'mcdoc:identifier')
	return formatChildren(node, ctx, {
		'mcdoc:literal': { suffix: ' ' },
		'mcdoc:path': { suffix: hasAlias ? ' ' : '' },
	})
}

const injection: Formatter<InjectionNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:literal': { suffix: ' ' },
	})
}

const struct: Formatter<StructNode> = (node, ctx) => {
	const isTopLevel = node.parent?.type === 'mcdoc:module'
	return formatWithPrelim(node, ctx, isTopLevel, isTopLevel, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			'mcdoc:literal': { suffix: ' ' },
			'mcdoc:identifier': { suffix: ' ' },
		})
	})
}

const structInjection: Formatter<StructInjectionNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:literal': { suffix: ' ' },
		'mcdoc:path': { suffix: ' ' },
	})
}

const structBlock: Formatter<StructBlockNode> = (node, ctx) => {
	if (node.children.length === 0) {
		return '{}'
	}
	const content = formatChildren(node, ctx, {
		'comment': { prefix: ctx.indent(1), suffix: '\n', indentSelf: true },
		'mcdoc:struct/field/pair': { suffix: ',\n', indentSelf: true },
		'mcdoc:struct/field/spread': { suffix: ',\n', indentSelf: true },
	})
	return `{\n${content}${ctx.indent()}}`
}

const structPairField: Formatter<StructPairFieldNode> = (node, ctx) => {
	const keySuffix = `${node.isOptional ? '?' : ''}: `
	return ctx.indent() + formatWithPrelim(node, ctx, true, true, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			'mcdoc:struct/map_key': { suffix: keySuffix },
			'mcdoc:identifier': { suffix: keySuffix },
			'string': { suffix: keySuffix },
		})
	})
}

const structMapKey: Formatter<StructMapKeyNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)[0]
	return formatChildren(node, ctx, {
		[typeNode.type]: { prefix: '[', suffix: ']' },
	})
}

const structSpreadField: Formatter<StructSpreadFieldNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)[0]
	return ctx.indent() + formatWithPrelim(node, ctx, true, true, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			[typeNode.type]: { prefix: '...' },
		})
	})
}

const _enum: Formatter<EnumNode> = (node, ctx) => {
	const isTopLevel = node.parent?.type === 'mcdoc:module'
	return formatWithPrelim(node, ctx, isTopLevel, isTopLevel, (contentCtx) => {
		return node.children.map((child) => {
			if (child.type === 'comment') {
				// Don't format comments if the type doesn't allow them.
				// A parent type that does allow comments should have already included them.
				return ''
			}
			if (child.type === 'mcdoc:attribute') {
				// Formatted separately
				return ''
			}
			const formatted = contentCtx.meta.getFormatter(child.type)(child, contentCtx)
			if (child.type === 'mcdoc:identifier') {
				return formatted + ' '
			}
			if (child.type !== 'mcdoc:literal' || child.value === 'enum') {
				return formatted
			}
			// Add parentheses to type
			return `(${formatted}) `
		}).join('')
	})
}

const enumInjection: Formatter<EnumInjectionNode> = (node, ctx) => {
	return node.children.map((child) => {
		if (child.type === 'comment') {
			// Don't format comments if the type doesn't allow them.
			// A parent type that does allow comments should have already included them.
			return ''
		}
		const formatted = ctx.meta.getFormatter(child.type)(child, ctx)
		if (child.type === 'mcdoc:path') {
			return formatted + ' '
		}
		if (child.type !== 'mcdoc:literal' || child.value === 'enum') {
			return formatted
		}
		// Add parentheses to type
		return `(${formatted}) `
	}).join('')
}

const enumBlock: Formatter<EnumBlockNode> = (node, ctx) => {
	if (node.children.length === 0) {
		return '{}'
	}
	const content = formatChildren(node, ctx, {
		'comment': { prefix: ctx.indent(1), suffix: '\n', indentSelf: true },
		'mcdoc:enum/field': { prefix: ctx.indent(1), suffix: ',\n', indentSelf: true },
	})
	return `{\n${content}${ctx.indent()}}`
}

const enumField: Formatter<EnumFieldNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, false, true, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			'mcdoc:identifier': { suffix: ' = ' },
		})
	})
}

const tupleType: Formatter<TupleTypeNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatDynamicMultiline(node, (doMultiline) => {
			const childFormatInfo: { [key: string]: ChildFormatInfo } = {
				'comment': {
					prefix: contentCtx.indent(1),
					suffix: `\n`,
				},
			}
			const typeFormatInfo = {
				prefix: doMultiline ? contentCtx.indent(1) : '',
				suffix: ',' + (doMultiline ? `\n` : ' '),
				indentSelf: true,
			}
			for (const child of typeNode) {
				childFormatInfo[child.type] = typeFormatInfo
			}
			const content = formatChildren(
				node,
				contentCtx,
				childFormatInfo,
				!doMultiline,
			)
			return doMultiline ? `[\n${content}${contentCtx.indent()}]` : `[${content}]`
		})
	})
}

const unionType: Formatter<UnionTypeNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatDynamicMultiline(node, (doMultiline) => {
			const childFormatInfo: { [key: string]: ChildFormatInfo } = {
				'comment': {
					prefix: contentCtx.indent(1),
					suffix: `\n`,
				},
			}
			const typeFormatInfo = {
				prefix: doMultiline ? contentCtx.indent(1) : '',
				suffix: ' |' + (doMultiline ? `\n` : ' '),
				indentSelf: true,
			}
			for (const child of typeNode) {
				childFormatInfo[child.type] = typeFormatInfo
			}
			const content = formatChildren(
				node,
				contentCtx,
				childFormatInfo,
				!doMultiline,
			)
			return doMultiline ? `(\n${content}${contentCtx.indent()})` : `(${content})`
		})
	})
}

const referenceType: Formatter<ReferenceTypeNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatChildren(node, contentCtx, {})
	})
}

const path: Formatter<PathNode> = (node, ctx) => {
	const formatted = formatChildren(node, ctx, {
		'mcdoc:literal': { prefix: '::' },
		'mcdoc:identifier': { prefix: '::' },
	})
	if (!node.isAbsolute) {
		return formatted.substring(2) // Remove the leading '::' for relative paths
	}
	return formatted
}

const stringType: Formatter<StringTypeNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			'mcdoc:int_range': { prefix: ' @ ' },
		})
	})
}

const primitiveArrayType: Formatter<PrimitiveArrayTypeNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			'mcdoc:int_range': { prefix: ' @ ' },
		})
	})
}

const listType: Formatter<ListTypeNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)[0]
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			[typeNode.type]: { prefix: '[', suffix: ']' },
			'mcdoc:int_range': { prefix: ' @ ' },
		})
	})
}

const typeAlias: Formatter<TypeAliasNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)[0]
	return formatWithPrelim(node, ctx, true, true, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			[typeNode.type]: { prefix: ' = ' },
			'mcdoc:literal': { suffix: ' ' },
		})
	})
}

const dispatcherType: Formatter<DispatcherTypeNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, true, true, (contentCtx) => {
		return formatChildren(node, contentCtx, {})
	})
}

const dispatchStatement: Formatter<DispatchStatementNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, true, true, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			'mcdoc:literal': { suffix: ' ' },
			'mcdoc:index_body': { suffix: ' ' },
		})
	})
}

const indexBody: Formatter<IndexBodyNode> = (node, ctx) => {
	return formatDynamicMultiline(node, (doMultiline) => {
		const indexFormatInfo: ChildFormatInfo = {
			prefix: doMultiline ? ctx.indent(1) : '',
			suffix: ',' + (doMultiline ? `\n` : ' '),
			indentSelf: true,
		}
		const content = formatChildren(node, ctx, {
			'mcdoc:dynamic_index': indexFormatInfo,
			'mcdoc:identifier': indexFormatInfo,
			'mcdoc:literal': indexFormatInfo,
			'resource_location': indexFormatInfo,
			'string': indexFormatInfo,
		}, !doMultiline)
		return doMultiline ? `[\n${content}${ctx.indent()}]` : `[${content}]`
	})
}

const dynamicIndex: Formatter<DynamicIndexNode> = (node, ctx) => {
	const path = node.children.map((child) => {
		if (child.type === 'comment') {
			// Don't format comments if the type doesn't allow them.
			// A parent type that does allow comments should have already included them.
			return ''
		}
		return ctx.meta.getFormatter(child.type)(child, ctx)
	}).join('.')
	return `[${path}]`
}

const attribute: Formatter<AttributeNode> = (node, ctx) => {
	const hasTypeValue = getTypeNodes(node.children).length !== 0
	return formatChildren(node, ctx, {
		'mcdoc:identifier': { prefix: '#[', suffix: hasTypeValue ? '=' : '' },
	}) + ']'
}

const attributeTree: Formatter<AttributeTreeNode> = (node, ctx) => {
	const content = formatChildren(node, ctx, {})
	return `${node.delim}${content}${AttributeTreeClosure[node.delim]}`
}

const attributeTreePosValues: Formatter<AttributeTreePosValuesNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	return formatDynamicMultiline(node, (doMultiline) => {
		const childFormatInfo = {
			prefix: doMultiline ? ctx.indent(1) : '',
			suffix: ',' + (doMultiline ? `\n` : ' '),
			indentSelf: true,
		}
		const childFormatInfoMap: { [key: string]: ChildFormatInfo } = {
			'mcdoc:attribute/tree': childFormatInfo,
		}
		for (const child of typeNode) {
			childFormatInfoMap[child.type] = childFormatInfo
		}
		const content = formatChildren(node, ctx, childFormatInfoMap, !doMultiline)
		return doMultiline ? `\n${content}${ctx.indent()}` : content
	})
}

const attributeTreeNamedValues: Formatter<AttributeTreeNamedValuesNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	return formatDynamicMultiline(node, (doMultiline) => {
		const childFormatInfo = {
			prefix: '=',
			suffix: ',' + (doMultiline ? `\n` : ' '),
			indentSelf: true,
		}
		const childFormatInfoMap: { [key: string]: ChildFormatInfo } = {
			'mcdoc:attribute/tree': childFormatInfo,
			'mcdoc:identifier': { prefix: doMultiline ? ctx.indent(1) : '' },
			'string': { prefix: doMultiline ? ctx.indent(1) : '' },
		}
		for (const child of typeNode) {
			childFormatInfoMap[child.type] = childFormatInfo
		}
		const content = formatChildren(node, ctx, childFormatInfoMap, !doMultiline)
		return doMultiline ? `\n${content}${ctx.indent()}` : content
	})
}

const typeArgBlock: Formatter<TypeArgBlockNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	const childFormatInfo: { [key: string]: ChildFormatInfo } = {}
	for (const child of typeNode) {
		childFormatInfo[child.type] = { suffix: ', ' }
	}
	const content = formatChildren(node, ctx, childFormatInfo, true)
	return `<${content}>`
}

const typeParamBlock: Formatter<TypeParamBlockNode> = (node, ctx) => {
	const content = formatChildren(node, ctx, {
		'mcdoc:type_param': { suffix: ', ' },
	}, true)
	return `<${content}>`
}

const typeParam: Formatter<TypeParamNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const literalType: Formatter<LiteralTypeNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatChildren(node, contentCtx, {})
	})
}

const typedNumber: Formatter<TypedNumberNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const numericType: Formatter<NumericTypeNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatChildren(node, contentCtx, {
			'mcdoc:int_range': { prefix: ' @ ' },
			'mcdoc:float_range': { prefix: ' @ ' },
		})
	})
}

const intRange: Formatter<IntRangeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const floatRange: Formatter<FloatRangeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const anyType: Formatter<AnyTypeNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatChildren(node, contentCtx, {})
	})
}

const booleanType: Formatter<BooleanTypeNode> = (node, ctx) => {
	return formatWithPrelim(node, ctx, false, false, (contentCtx) => {
		return formatChildren(node, contentCtx, {})
	})
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
	return formatChildren(node, ctx, {
		comment: { suffix: ctx.indent() }, // No need to add new lines, because DocCommentNodes include them
	})
}

export function registerMcdocFormatter(meta: MetaRegistry): void {
	meta.registerFormatter<ModuleNode>('mcdoc:module', module)
	meta.registerFormatter<UseStatementNode>('mcdoc:use_statement', useStatement)
	meta.registerFormatter<InjectionNode>('mcdoc:injection', injection)
	meta.registerFormatter<StructNode>('mcdoc:struct', struct)
	meta.registerFormatter<StructInjectionNode>('mcdoc:injection/struct', structInjection)
	meta.registerFormatter<StructBlockNode>('mcdoc:struct/block', structBlock)
	meta.registerFormatter<StructPairFieldNode>('mcdoc:struct/field/pair', structPairField)
	meta.registerFormatter<StructMapKeyNode>('mcdoc:struct/map_key', structMapKey)
	meta.registerFormatter<StructSpreadFieldNode>('mcdoc:struct/field/spread', structSpreadField)
	meta.registerFormatter<EnumNode>('mcdoc:enum', _enum)
	meta.registerFormatter<EnumInjectionNode>('mcdoc:injection/enum', enumInjection)
	meta.registerFormatter<EnumBlockNode>('mcdoc:enum/block', enumBlock)
	meta.registerFormatter<EnumFieldNode>('mcdoc:enum/field', enumField)
	meta.registerFormatter<TupleTypeNode>('mcdoc:type/tuple', tupleType)
	meta.registerFormatter<UnionTypeNode>('mcdoc:type/union', unionType)
	meta.registerFormatter<ReferenceTypeNode>('mcdoc:type/reference', referenceType)
	meta.registerFormatter<PathNode>('mcdoc:path', path)
	meta.registerFormatter<StringTypeNode>('mcdoc:type/string', stringType)
	meta.registerFormatter<PrimitiveArrayTypeNode>('mcdoc:type/primitive_array', primitiveArrayType)
	meta.registerFormatter<ListTypeNode>('mcdoc:type/list', listType)
	meta.registerFormatter<TypeAliasNode>('mcdoc:type_alias', typeAlias)
	meta.registerFormatter<DispatcherTypeNode>('mcdoc:type/dispatcher', dispatcherType)
	meta.registerFormatter<DispatchStatementNode>('mcdoc:dispatch_statement', dispatchStatement)
	meta.registerFormatter<IndexBodyNode>('mcdoc:index_body', indexBody)
	meta.registerFormatter<DynamicIndexNode>('mcdoc:dynamic_index', dynamicIndex)
	meta.registerFormatter<AttributeNode>('mcdoc:attribute', attribute)
	meta.registerFormatter<AttributeTreeNode>('mcdoc:attribute/tree', attributeTree)
	meta.registerFormatter<AttributeTreePosValuesNode>(
		'mcdoc:attribute/tree/pos',
		attributeTreePosValues,
	)
	meta.registerFormatter<AttributeTreeNamedValuesNode>(
		'mcdoc:attribute/tree/named',
		attributeTreeNamedValues,
	)
	meta.registerFormatter<TypeArgBlockNode>('mcdoc:type_arg_block', typeArgBlock)
	meta.registerFormatter<TypeParamBlockNode>('mcdoc:type_param_block', typeParamBlock)
	meta.registerFormatter<TypeParamNode>('mcdoc:type_param', typeParam)
	meta.registerFormatter<LiteralTypeNode>('mcdoc:type/literal', literalType)
	meta.registerFormatter<TypedNumberNode>('mcdoc:typed_number', typedNumber)
	meta.registerFormatter<NumericTypeNode>('mcdoc:type/numeric_type', numericType)
	meta.registerFormatter<IntRangeNode>('mcdoc:int_range', intRange)
	meta.registerFormatter<FloatRangeNode>('mcdoc:float_range', floatRange)
	meta.registerFormatter<AnyTypeNode>('mcdoc:type/any', anyType)
	meta.registerFormatter<BooleanTypeNode>('mcdoc:type/boolean', booleanType)
	meta.registerFormatter<LiteralNode>('mcdoc:literal', literal)
	meta.registerFormatter<IdentifierNode>('mcdoc:identifier', identifier)
	meta.registerFormatter<DocCommentsNode>('mcdoc:doc_comments', docComments)
}
