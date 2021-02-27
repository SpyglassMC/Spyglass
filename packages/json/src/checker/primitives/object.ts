import { ErrorSeverity } from '@spyglassmc/core'
import { JsonObjectAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'
import { as } from './util'

type OptChecker = {
	opt: Checker,
}
function isOpt(checker: Checker | OptChecker): checker is OptChecker {
	return (checker as OptChecker).opt !== undefined
}

export function object(keys: () => string[], values: (key: string) => Checker | OptChecker) {
	return (ctx: CheckerContext) => {
		if (!JsonObjectAstNode.is(ctx.node)) {
			ctx.report('Expected an object')
		} else {
			const givenKeys = ctx.node.properties.map(n => n.key.value)
			keys().filter(k => !isOpt(values(k))).forEach(k => {
				if (!givenKeys.includes(k)) {
					ctx.report(`Missing key "${k}"`)
				}})
			const hasSeen = new Set<string>()
			ctx.node.properties.forEach(prop => {
				if (!keys().includes(prop.key.value)) {
					ctx.with(prop.key).report(`Unknown object key "${prop.key.value}"`, ErrorSeverity.Warning)
				} else if (hasSeen.has(prop.key.value)) {
					ctx.with(prop.key).report('Duplicate object key', ErrorSeverity.Warning)
				} else if (prop.value !== undefined) {
					hasSeen.add(prop.key.value)
					const value = values(prop.key.value);
					(isOpt(value) ? value.opt : value)(ctx.with(prop.value))
				}
			})
		}
	}
}

export function record(properties: Record<string, Checker | OptChecker>) {
	return object(
		() => Object.keys(properties),
		(key) => properties[key]
	)
}

export function opt(checker: Checker) {
	return { opt: checker }
}

export function dispatch(keyName: string, keyChecker: Checker, values: (value: string) => Checker) {
	return (ctx: CheckerContext) => {
		if (!JsonObjectAstNode.is(ctx.node)) {
			ctx.report('Expected an object')
		} else {
			const dispatcherIndex = ctx.node.properties.findIndex(p => p.key.value === keyName)
			const dispatcher = ctx.node.properties[dispatcherIndex]
			if (!dispatcher) {
				ctx.report(`Missing key "${keyName}"`)
			} else if (dispatcher.value) {
				keyChecker(ctx.with(dispatcher.value))
				if (dispatcher.value.type === 'json:string') {
					ctx.node.properties.splice(dispatcherIndex, 1)
					values(dispatcher.value.value)(ctx)
					ctx.node.properties.splice(dispatcherIndex, 0, dispatcher)
				}
			}
		}
	}
}

export function pick(value: string, cases: Record<string, Record<string, Checker>>) {
	const properties = cases[value.replace(/^minecraft:/, '')]
	Object.keys(properties).forEach(key => properties[key] = as(key, properties[key]))
	return properties
}
