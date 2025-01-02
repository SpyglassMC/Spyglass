import * as core from '@spyglassmc/core'
import type { Formatter, MetaRegistry } from '@spyglassmc/core'
import { indentFormatter } from '@spyglassmc/core'
import type {
	JsonArrayNode,
	JsonBooleanNode,
	JsonFileNode,
	JsonNullNode,
	JsonNumberNode,
	JsonObjectNode,
	JsonStringNode,
} from '../node/index.js'

const file: Formatter<JsonFileNode> = (node, ctx) => {
	const child = node.children[0]
	return ctx.meta.getFormatter(child.type)(child, ctx)
}

const array: Formatter<JsonArrayNode> = (node, ctx) => {
	if (node.children.length === 0) {
		return '[]'
	}
	const values = node.children.map((child) => {
		const value = child.value
			&& ctx.meta.getFormatter(child.value.type)(child.value, indentFormatter(ctx))
		return `${ctx.indent(1)}${value ?? ''}`
	})
	return `[\n${values.join(',\n')}\n${ctx.indent()}]`
}

const object: Formatter<JsonObjectNode> = (node, ctx) => {
	if (node.children.length === 0) {
		return '{}'
	}
	const fields = node.children.map((child) => {
		const key = child.key && string(child.key, ctx)
		const value = child.value
			&& ctx.meta.getFormatter(child.value.type)(child.value, indentFormatter(ctx))
		return `${ctx.indent(1)}${key ?? ''}: ${value ?? ''}`
	})
	return `{\n${fields.join(',\n')}\n${ctx.indent()}}`
}

const number: Formatter<JsonNumberNode> = (node, ctx) => {
	return ctx.meta.getFormatter(node.value.type)(node.value, ctx)
}

const string: Formatter<JsonStringNode> = (node, ctx) => {
	// TODO: Use core.formatter.string when it correctly escapes the string
	return JSON.stringify(node.value)
}

export function register(meta: MetaRegistry): void {
	meta.registerFormatter<JsonFileNode>('json:file', file)
	meta.registerFormatter<JsonArrayNode>('json:array', array)
	meta.registerFormatter<JsonBooleanNode>('json:boolean', core.formatter.boolean)
	meta.registerFormatter<JsonNullNode>('json:null', () => 'null')
	meta.registerFormatter<JsonNumberNode>('json:number', number)
	meta.registerFormatter<JsonObjectNode>('json:object', object)
	meta.registerFormatter<JsonStringNode>('json:string', string)
}
