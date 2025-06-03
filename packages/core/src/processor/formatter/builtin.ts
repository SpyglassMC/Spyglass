import type {
	AstNode,
	BooleanBaseNode,
	BooleanNode,
	CommentNode,
	ErrorNode,
	FileNode,
	FloatBaseNode,
	FloatNode,
	IntegerNode,
	LiteralBaseNode,
	LiteralNode,
	LongNode,
	ResourceLocationBaseNode,
	StringBaseNode,
	StringNode,
} from '../../node/index.js'
import { ResourceLocationNode } from '../../node/index.js'
import type { MetaRegistry } from '../../service/index.js'
import type { Formatter } from './Formatter.js'

export const fallback: Formatter = (node) => {
	throw new Error(`No formatter registered for type ${node.type}`)
}

export const error: Formatter<ErrorNode> = (node) => {
	return ''
}

export const file: Formatter<FileNode<AstNode>> = (node, ctx) => {
	return node.children.map((child) => {
		return ctx.meta.getFormatter(child.type)(child, ctx)
	}).join('')
}

export const boolean: Formatter<BooleanBaseNode> = (node) => {
	return node.value ? 'true' : 'false'
}

export const comment: Formatter<CommentNode> = (node) => {
	return node.prefix + node.comment
}

export const float: Formatter<FloatBaseNode> = (node) => {
	return node.value.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 1 })
}

export const integer: Formatter<IntegerNode> = (node) => {
	return node.value.toFixed()
}

export const literal: Formatter<LiteralBaseNode> = (node) => {
	return node.value
}

export const long: Formatter<LongNode> = (node) => {
	return node.value.toString()
}

export const resourceLocation: Formatter<ResourceLocationBaseNode> = (node) => {
	return ResourceLocationNode.toString(node, 'origin', true)
}

export const string: Formatter<StringBaseNode> = (node) => {
	// FIXME: escape this value according to the node's IndexMap and context
	return `"${node.value}"`
}

export function registerFormatters(meta: MetaRegistry) {
	meta.registerFormatter<ErrorNode>('error', error)
	meta.registerFormatter<FileNode<AstNode>>('file', file)
	meta.registerFormatter<BooleanNode>('boolean', boolean)
	meta.registerFormatter<CommentNode>('comment', comment)
	meta.registerFormatter<FloatNode>('float', float)
	meta.registerFormatter<IntegerNode>('integer', integer)
	meta.registerFormatter<LongNode>('long', long)
	meta.registerFormatter<LiteralNode>('literal', literal)
	meta.registerFormatter<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerFormatter<StringNode>('string', string)
}
