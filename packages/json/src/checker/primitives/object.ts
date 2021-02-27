import { ErrorSeverity } from '@spyglassmc/core'
import { JsonAstNode, JsonObjectAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'
import { as } from './util'

type OptChecker = {
	opt: Checker<JsonAstNode>,
}
function isOpt(checker: Checker<JsonAstNode> | OptChecker): checker is OptChecker {
	return (checker as OptChecker).opt !== undefined
}

export function object(keys: () => string[], values: (key: string) => Checker<JsonAstNode> | OptChecker) {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonObjectAstNode.is(node)) {
			ctx.err.report('Expected an object', node)
		} else {
			const givenKeys = node.properties.map(n => n.key.value)
			keys().filter(k => !isOpt(values(k))).forEach(k => {
				if (!givenKeys.includes(k)) {
					ctx.err.report(`Missing key "${k}"`, node)
				}})
			const hasSeen = new Set<string>()
			node.properties.forEach(prop => {
				if (!keys().includes(prop.key.value)) {
					ctx.err.report(`Unknown object key "${prop.key.value}"`, prop.key, ErrorSeverity.Warning)
				} else if (hasSeen.has(prop.key.value)) {
					ctx.err.report('Duplicate object key', prop.key, ErrorSeverity.Warning)
				} else if (prop.value !== undefined) {
					hasSeen.add(prop.key.value)
					const value = values(prop.key.value);
					(isOpt(value) ? value.opt : value)(prop.value, ctx)
				}
			})
		}
	}
}

export function record(properties: Record<string, Checker<JsonAstNode> | OptChecker>) {
	return object(
		() => Object.keys(properties),
		(key) => properties[key]
	)
}

export function opt(checker: Checker<JsonAstNode>) {
	return { opt: checker }
}

export function dispatch(keyName: string, keyChecker: Checker<JsonAstNode>, values: (value: string) => Checker<JsonAstNode>) {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonObjectAstNode.is(node)) {
			ctx.err.report('Expected an object', node)
		} else {
			const dispatcherIndex = node.properties.findIndex(p => p.key.value === keyName)
			const dispatcher = node.properties[dispatcherIndex]
			if (!dispatcher) {
				ctx.err.report(`Missing key "${keyName}"`, node)
			} else if (dispatcher.value) {
				keyChecker(dispatcher.value, ctx)
				if (dispatcher.value.type === 'json:string') {
					node.properties.splice(dispatcherIndex, 1)
					values(dispatcher.value.value)(node, ctx)
					node.properties.splice(dispatcherIndex, 0, dispatcher)
				}
			}
		}
	}
}

export function pick(value: string, cases: Record<string, Record<string, Checker<JsonAstNode> | OptChecker>>) {
	const properties = cases[value.replace(/^minecraft:/, '')]
	Object.keys(properties).forEach(key => {
		const p = properties[key]
		properties[key] = isOpt(p) ? as(key, p.opt) : as(key, p)
	})
	return properties
}
