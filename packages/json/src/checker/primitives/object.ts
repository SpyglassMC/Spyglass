import { ErrorSeverity, Range } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
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

export function object(): Checker<JsonAstNode>
export function object(keys: string[], values: (key: string) => CheckerProperty): Checker<JsonAstNode>
export function object(keys: Checker<JsonAstNode>, values: (key: string) => CheckerProperty): Checker<JsonAstNode>
export function object(keys?: string[] | Checker<JsonAstNode>, values?: (key: string) => CheckerProperty): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
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

export function record(properties: CheckerRecord): Checker<JsonAstNode> {
	return object(
		Object.keys(properties),
		(key) => properties[key]
	)
}

export function opt(checker: Checker<JsonAstNode>): OptChecker {
	return { opt: checker }
}

export function dispatch(keyName: string, keyChecker: Checker<JsonAstNode>, values: (value: string) => Checker<JsonAstNode>): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonObjectAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('object')]), node)
		} else {
			const dispatcherIndex = node.properties.findIndex(p => p.key.value === keyName)
			const dispatcher = node.properties[dispatcherIndex]
			if (!dispatcher) {
				ctx.err.report(localize('missing-key', [localize('punc.quote', [keyName])]), Range.create(node.range.start, node.range.start + 1))
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
		properties[key] = isOpt(p) ? opt(as(key, p.opt)) : as(key, p)
	})
	return properties
}
