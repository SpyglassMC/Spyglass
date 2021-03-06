import { ErrorSeverity, Range } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { JsonAstNode, JsonObjectAstNode, JsonPropertyAstNode } from '../../node'
import { Schema } from '../Schema'
import { SchemaContext } from '../SchemaContext'
import { as } from './util'

type OptSchema = {
	opt: Schema<JsonAstNode>,
}

type SchemaProperty = Schema<JsonAstNode> | OptSchema

type SchemaRecord = Record<string, SchemaProperty>

function isOpt(schema: SchemaProperty): schema is OptSchema {
	return (schema as OptSchema).opt !== undefined
}

export function object(): Schema<JsonAstNode>
export function object(keys: string[], values: (key: string) => SchemaProperty): Schema<JsonAstNode>
export function object(keys: Schema<JsonAstNode>, values: (key: string) => SchemaProperty): Schema<JsonAstNode>
export function object(keys?: string[] | Schema<JsonAstNode>, values?: (key: string) => SchemaProperty): Schema<JsonAstNode> {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		if (!JsonObjectAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('object')]), node)
		} else if (Array.isArray(keys) && values) {
			const givenKeys = node.properties.map(n => n.key.value)
			keys.filter(k => !isOpt(values(k))).forEach(k => {
				if (!givenKeys.includes(k)) {
					ctx.err.report(localize('missing-key', [localize('punc.quote', [k])]), Range.create(node.range.start, node.range.start + 1))
				}})
			node.properties.forEach(prop => {
				const key = prop.key.value
				if (!keys.includes(key)) {
					ctx.err.report(localize('unknown-key', [localize('punc.quote', [key])]), prop.key, ErrorSeverity.Warning)
				} else if (prop.value !== undefined) {
					const value = values(key);
					(isOpt(value) ? value.opt : value)(prop.value, ctx)
				}
			})
		} else if (typeof keys === 'function' && values) {
			node.properties.forEach(prop => {
				keys(prop.key, ctx)
				if (prop.value !== undefined) {
					const value = values(prop.key.value);
					(isOpt(value) ? value.opt : value)(prop.value, ctx)
				}
			})
		}
	}
}

export function record(properties: SchemaRecord): Schema<JsonAstNode> {
	return object(
		Object.keys(properties),
		(key) => properties[key]
	)
}

export function opt(schema: Schema<JsonAstNode>): OptSchema {
	return { opt: schema }
}

export function ref(schema: () => Schema<JsonAstNode>): Schema<JsonAstNode> {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		return schema()(node, ctx)
	}
}

export function dispatch(keyName: string, keySchema: Schema<JsonAstNode>, values: (value: string, properties: JsonPropertyAstNode[]) => Schema<JsonAstNode>): Schema<JsonAstNode> {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		if (!JsonObjectAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('object')]), node)
		} else {
			const dispatcherIndex = node.properties.findIndex(p => p.key.value === keyName)
			const dispatcher = node.properties[dispatcherIndex]
			if (!dispatcher) {
				ctx.err.report(localize('missing-key', [localize('punc.quote', [keyName])]), Range.create(node.range.start, node.range.start + 1))
			} else if (dispatcher.value) {
				keySchema(dispatcher.value, ctx)
				if (dispatcher.value.type === 'json:string') {
					node.properties.splice(dispatcherIndex, 1)
					values(dispatcher.value.value, node.properties)(node, ctx)
					node.properties.splice(dispatcherIndex, 0, dispatcher)
				}
			}
		}
	}
}

export function pick(value: string | undefined, cases: Record<string, SchemaRecord>): SchemaRecord {
	if (value === undefined) {
		return {}
	}
	const properties = cases[value.replace(/^minecraft:/, '')]
	if (properties === undefined) {
		return {}
	}
	Object.keys(properties).forEach(key => {
		const p = properties[key]
		properties[key] = isOpt(p) ? opt(as(key, p.opt)) : as(key, p)
	})
	return properties
}

export function extract(value: string, properties: JsonPropertyAstNode[]) {
	const node = properties.find(p => p.key.value === value)
	return node?.value?.type === 'json:string' ? node.value.value : undefined
}
