import { JsonObjectAstNode } from '../../node'
import { Schema } from '../Schema'
import { SchemaContext } from '../SchemaContext'

type OptSchema = {
	opt: Schema,
}
function isOpt(schema: Schema | OptSchema): schema is OptSchema {
	return (schema as OptSchema).opt !== undefined
}

function isObject(ctx: SchemaContext): ctx is SchemaContext<JsonObjectAstNode> {
	if (!JsonObjectAstNode.is(ctx.node)) {
		ctx.error('Expected an object')
		return false
	}
	return true
}

export function object(keys: () => string[], values: (key: string) => Schema | OptSchema) {
	return (ctx: SchemaContext) => {
		if (!isObject(ctx)) return

		const givenKeys = ctx.node.properties.map(n => n.key.value)
		keys().filter(k => !isOpt(values(k))).forEach(k => {
			if (!givenKeys.includes(k)) {
				ctx.error(`Missing key "${k}"`)
			}})
		const hasSeen = new Set<string>()
		ctx.node.properties.forEach(p => {
			if (!keys().includes(p.key.value)) {
				return ctx.with(p.key).error(`Unknown object key "${p.key.value}"`, 'warning')
			}
			if (hasSeen.has(p.key.value)) {
				return ctx.with(p.key).error('Duplicate object key', 'warning')
			}
			hasSeen.add(p.key.value)
			if (p.value === undefined) {
				return
			}
			const value = values(p.key.value);
			(isOpt(value) ? value.opt : value)(ctx.with(p.value))
		})
	}
}

export function record(properties: Record<string, Schema | OptSchema>) {
	return object(
		() => Object.keys(properties),
		(key) => properties[key]
	)
}

export function opt(schema: Schema) {
	return { opt: schema }
}

export function dispatch(keyName: string, keySchema: Schema, values: (value: string) => Schema) {
	return (ctx: SchemaContext) => {
		if (!isObject(ctx)) return

		const dispatcher = ctx.node.properties.find(p => p.key.value === keyName)
		if (!dispatcher) {
			return ctx.error(`Missing key "${keyName}"`)
		}
		if (!dispatcher.value) {
			return
		}
		keySchema(ctx.with(dispatcher.value))
		if (dispatcher.value.type === 'json:string') {
			const newCtx = ctx.clone()
			newCtx.node = { ...newCtx.node, properties: newCtx.node.properties.filter(p => p.key.value !== keyName)}
			values(dispatcher.value.value)(newCtx)
		}
	}
}

export function pick(value: string, cases: Record<string, Record<string, Schema>>) {
	return cases[value.replace(/^minecraft:/, '')]
}
