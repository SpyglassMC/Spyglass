import { ErrorSeverity, Range } from '@spyglassmc/core'
import { JsonAstNode, JsonObjectAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'
import { as } from './util'

type OptChecker = {
	opt: Checker<JsonAstNode>,
}

type CheckerProperty = Checker<JsonAstNode> | OptChecker

type CheckerRecord = Record<string, CheckerProperty>

function isOpt(checker: CheckerProperty): checker is OptChecker {
	return (checker as OptChecker).opt !== undefined
}

export function object(keys: () => string[], values: (key: string) => CheckerProperty): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonObjectAstNode.is(node)) {
			ctx.err.report('Expected an object', node)
		} else {
			const givenKeys = node.properties.map(n => n.key.value)
			keys().filter(k => !isOpt(values(k))).forEach(k => {
				if (!givenKeys.includes(k)) {
					ctx.err.report(`Missing key "${k}"`, Range.create(node.range.start, node.range.start + 1))
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

export function record(properties: CheckerRecord): Checker<JsonAstNode> {
	return object(
		() => Object.keys(properties),
		(key) => properties[key]
	)
}

export function opt(checker: Checker<JsonAstNode>): OptChecker {
	return { opt: checker }
}

export function dispatch(keyName: string, keyChecker: Checker<JsonAstNode>, values: (value: string) => Checker<JsonAstNode>): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonObjectAstNode.is(node)) {
			ctx.err.report('Expected an object', node)
		} else {
			const dispatcherIndex = node.properties.findIndex(p => p.key.value === keyName)
			const dispatcher = node.properties[dispatcherIndex]
			if (!dispatcher) {
				ctx.err.report(`Missing key "${keyName}"`, Range.create(node.range.start, node.range.start + 1))
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

export function pick(value: string, cases: Record<string, CheckerRecord>): CheckerRecord {
	const properties = cases[value.replace(/^minecraft:/, '')]
	if (properties === undefined) {
		return {}
	}
	Object.keys(properties).forEach(key => {
		const p = properties[key]
		properties[key] = isOpt(p) ? as(key, p.opt) : as(key, p)
	})
	return properties
}
