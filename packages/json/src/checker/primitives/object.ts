import type { Checker, CheckerContext } from '@spyglassmc/core'
import { ErrorSeverity, Range } from '@spyglassmc/core'
import { arrayToMessage, localize } from '@spyglassmc/locales'
import type { JsonAstNode, JsonPropertyAstNode } from '../../node'
import { JsonObjectAstNode } from '../../node'
import { as } from './util'

type OptChecker = {
	opt: Checker<JsonAstNode>,
}

type CheckerProperty = Checker<JsonAstNode> | OptChecker

type CheckerRecord = Record<string, CheckerProperty>

function isOpt(Checker: CheckerProperty): Checker is OptChecker {
	return (Checker as OptChecker).opt !== undefined
}

export function object(): Checker<JsonAstNode>
export function object(keys: string[], values: (key: string) => CheckerProperty): Checker<JsonAstNode>
export function object(keys: Checker<JsonAstNode>, values: (key: string) => CheckerProperty): Checker<JsonAstNode>
export function object(keys?: string[] | Checker<JsonAstNode>, values?: (key: string) => CheckerProperty): Checker<JsonAstNode> {
	return async (node: JsonAstNode, ctx: CheckerContext) => {
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

export function opt(Checker: Checker<JsonAstNode>): OptChecker {
	return { opt: Checker }
}

export function dispatch(keyName: string, values: (value: string | undefined, properties: JsonPropertyAstNode[]) => Checker<JsonAstNode>): Checker<JsonAstNode> {
	return async (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonObjectAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('object')]), node)
		} else {
			const dispatcherIndex = node.properties.findIndex(p => p.key.value === keyName)
			const dispatcher = node.properties[dispatcherIndex]
			const value = dispatcher.value?.type === 'json:string' ? dispatcher.value.value : undefined
			values(value, node.properties)(node, ctx)
		}
	}
}

export function pick(value: string | undefined, cases: Record<string, CheckerRecord>): CheckerRecord {
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

export function having(node: JsonAstNode, ctx: CheckerContext, cases: Record<string, CheckerRecord | (() => CheckerRecord)>): CheckerRecord {
	if (!JsonObjectAstNode.is(node)) {
		return {}
	}

	const givenKeys = new Set(node.properties.map(n => n.key.value))
	const key = Object.keys(cases).find(c => givenKeys.has(c))
	if (key === undefined) {
		ctx.err.report(localize('missing-key', [arrayToMessage(Object.keys(cases), true, 'or')]), Range.create(node.range.start, node.range.start + 1))
		return {}
	}
	const c = cases[key]
	return typeof c === 'function' ? c() : c
}
