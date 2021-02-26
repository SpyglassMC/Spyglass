import { JsonObjectAstNode, JsonStringAstNode } from '../../node'
import { Schema } from '../Schema'
import { SchemaContext } from '../SchemaContext'
import { enumString } from './string'

export function object(keys: Schema<JsonStringAstNode>, values: (key: string) => Schema) {
	return (ctx: SchemaContext) => {
		if (!JsonObjectAstNode.is(ctx.node)) {
			return ctx.error('Expected an object')
		}
		const hasSeen = new Set<string>()
		return ctx.node.properties.every(p => {
			if (!keys(ctx.with(p.key))) {
				return ctx.with(p.key).error('Unknown object key', 'warning')
			}
			if (hasSeen.has(p.key.value)) {
				return ctx.with(p.key).error('Duplicate object key', 'warning')
			}
			hasSeen.add(p.key.value)
			if (p.value === undefined) {
				return true
			}
			return values(p.key.value)(ctx.with(p.value))
		})
	}
}

export function record(properties: Record<string, Schema>) {
	return object(
		enumString(Object.keys(properties)),
		(key) => properties[key]
	)
}

export function dispatch(keyName: string, values: (value: string) => Schema) {
	return (ctx: SchemaContext) => {
		if (!JsonObjectAstNode.is(ctx.node)) {
			return ctx.error('Expected an object')
		}
		const dispatcher = ctx.node.properties.find(p => p.key.value === keyName)
		if (dispatcher) {
			if (dispatcher.value && dispatcher.value.type === 'json:string') {
				return values(dispatcher.value.value)(ctx)
			} else {
				return false
			}
		} else {
			return ctx.error(`Missing key "${keyName}"`)
		}
	}
}
