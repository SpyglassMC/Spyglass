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

// TODO: Allow comments in list-like nodes (for example tuples, unions and dispatchers)

const nodeTypesAllowingComments = new Set<string>([
	'mcdoc:module',
	'mcdoc:struct/block',
	'mcdoc:enum/block',
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

function getTypeNodes(
	children: DeepReadonly<AstNode[]>,
): DeepReadonly<AstNode[]> {
	return children.filter((child) =>
		child.type.startsWith('mcdoc:type/') || child.type === 'mcdoc:enum'
		|| child.type === 'mcdoc:struct'
	)
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

const useStatement: Formatter<UseStatementNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:literal': { suffix: ' ' },
		'mcdoc:path': { suffix: ' ' },
	})
}

const injection: Formatter<InjectionNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:literal': { suffix: ' ' },
	})
}

const struct: Formatter<StructNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:attribute': { suffix: '\n' },
		'mcdoc:literal': { suffix: ' ' },
		'mcdoc:identifier': { suffix: ' ' },
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
		'mcdoc:struct/field/pair': { prefix: ctx.indent(1), suffix: ',\n', indentSelf: true },
		'mcdoc:struct/field/spread': { prefix: ctx.indent(1), suffix: ',\n', indentSelf: true },
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

const structMapKey: Formatter<StructMapKeyNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)[0]
	return formatChildren(node, ctx, {
		[typeNode.type]: { prefix: '[', suffix: ']' },
	})
}

const structSpreadField: Formatter<StructSpreadFieldNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)[0]
	return formatChildren(node, ctx, {
		[typeNode.type]: { prefix: '...' },
	})
}

const _enum: Formatter<EnumNode> = (node, ctx) => {
	return node.children.map((child) => {
		if (child.type === 'comment') {
			// Don't format comments if the type doesn't allow them.
			// A parent type that does allow comments should have already included them.
			return ''
		}
		const formatted = ctx.meta.getFormatter(child.type)(child, ctx)
		if (child.type === 'mcdoc:attribute') {
			return formatted + '\n'
		}
		if (child.type === 'mcdoc:identifier') {
			return formatted + ' '
		}
		if (child.type !== 'mcdoc:literal' || child.value === 'enum') {
			return formatted
		}
		// Add parentheses to type
		return `(${formatted}) `
	}).join('')
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
	return formatChildren(node, ctx, {
		'mcdoc:identifier': { suffix: ' = ' },
	})
}

const tupleType: Formatter<TupleTypeNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	const childFormatInfo: { [key: string]: ChildFormatInfo } = {}
	for (const child of typeNode) {
		childFormatInfo[child.type] = { suffix: ', ' }
	}
	const content = formatChildren(node, ctx, childFormatInfo)
	return `[${content}]`
}

const unionType: Formatter<UnionTypeNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	const childFormatInfo: { [key: string]: ChildFormatInfo } = {}
	for (const child of typeNode) {
		childFormatInfo[child.type] = { suffix: ' | ' }
	}
	const content = formatChildren(node, ctx, childFormatInfo)
	return `(${content})`
}

const referenceType: Formatter<ReferenceTypeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
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
	return formatChildren(node, ctx, {
		'mcdoc:int_range': { prefix: '@' },
	})
}

const primitiveArrayType: Formatter<PrimitiveArrayTypeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:int_range': { prefix: '@' },
	})
}

const listType: Formatter<ListTypeNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)[0]
	return formatChildren(node, ctx, {
		[typeNode.type]: { prefix: '[', suffix: ']' },
		'mcdoc:int_range': { prefix: '@' },
	})
}

const typeAlias: Formatter<TypeAliasNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)[0]
	return formatChildren(node, ctx, {
		[typeNode.type]: { prefix: ' = ' },
		'mcdoc:literal': { suffix: ' ' },
	})
}

const dispatcherType: Formatter<DispatcherTypeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const dispatchStatement: Formatter<DispatchStatementNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:literal': { suffix: ' ' },
		'mcdoc:index_body': { suffix: ' ' },
	})
}

const indexBody: Formatter<IndexBodyNode> = (node, ctx) => {
	const content = formatChildren(node, ctx, {
		'mcdoc:dynamic_index': { suffix: ', ' },
		'mcdoc:identifier': { suffix: ', ' },
		'mcdoc:literal': { suffix: ', ' },
		'resource_location': { suffix: ', ' },
		'string': { suffix: ', ' },
	})
	return `[${content}]`
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
	const childFormatInfo: { [key: string]: ChildFormatInfo } = {
		'mcdoc:attribute/tree': { suffix: ', ' },
	}
	for (const child of typeNode) {
		childFormatInfo[child.type] = { suffix: ', ' }
	}
	return formatChildren(node, ctx, childFormatInfo)
}

const attributeTreeNamedValues: Formatter<AttributeTreeNamedValuesNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	const childFormatInfo: { [key: string]: ChildFormatInfo } = {
		'mcdoc:attribute/tree': { prefix: '=', suffix: ', ' },
	}
	for (const child of typeNode) {
		childFormatInfo[child.type] = { prefix: '=', suffix: ', ' }
	}
	return formatChildren(node, ctx, childFormatInfo)
}

const typeArgBlock: Formatter<TypeArgBlockNode> = (node, ctx) => {
	const typeNode = getTypeNodes(node.children)
	const childFormatInfo: { [key: string]: ChildFormatInfo } = {}
	for (const child of typeNode) {
		childFormatInfo[child.type] = { suffix: ', ' }
	}
	const content = formatChildren(node, ctx, childFormatInfo)
	return `<${content}>`
}

const typeParamBlock: Formatter<TypeParamBlockNode> = (node, ctx) => {
	const content = formatChildren(node, ctx, {
		'mcdoc:type_param': { suffix: ', ' },
	})
	return `<${content}>`
}

const typeParam: Formatter<TypeParamNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const literalType: Formatter<LiteralTypeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:attribute': { suffix: ' ' },
	})
}

const typedNumber: Formatter<TypedNumberNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const numericType: Formatter<NumericTypeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {
		'mcdoc:int_range': { prefix: '@' },
		'mcdoc:float_range': { prefix: '@' },
	})
}

const intRange: Formatter<IntRangeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const floatRange: Formatter<FloatRangeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const anyType: Formatter<AnyTypeNode> = (node, ctx) => {
	return formatChildren(node, ctx, {})
}

const booleanType: Formatter<BooleanTypeNode> = (node, ctx) => {
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
