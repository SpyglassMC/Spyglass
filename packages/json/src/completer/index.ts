import type { CompleterContext } from '@spyglassmc/core'
import { CompletionItem, CompletionKind, selectedNode } from '@spyglassmc/core'
import type { JsonAstNode, JsonExpectation, JsonObjectAstNode, JsonObjectExpectation, JsonStringExpectation } from '../node'

export const JsonTriggerCharacters = ['\n', ':', '"']

const SIMPLE_SNIPPETS = {
	'json:object': '{$1}',
	'json:array': '[$1]',
	'json:string': '"$1"',
	'json:boolean': '${1|false,true|}',
	'json:number': '${1:0}',
	'json:union': '',
}

export function entry(root: JsonAstNode, ctx: CompleterContext): CompletionItem[] {
	const result = selectedNode(root, ctx.offset)
	if (result) {
		const n0 = result.node as JsonAstNode
		const n1 = result.parents[0] as JsonAstNode
		const n2 = result.parents[1] as JsonAstNode

		// Object properties
		// { "foo": 1, | }
		if (n0.type === 'json:object') {
			if (n0.expectation?.type === 'json:object') {
				return objectCompletion(n0, n0.expectation, ctx, false)
			} else if (n0.expectation?.type === 'json:union') {
				const expectation = n0.expectation.options.find(o => o.type === 'json:object')
				if (expectation) {
					return objectCompletion(n0, expectation as JsonObjectExpectation, ctx, false)
				}
			}
		}
		// { "foo": 1, "|" }
		if (n0.type === 'json:string' && n1.type === 'json:property' && n1.key === n0 && n2.type === 'json:object') {
			if (n2.expectation?.type == 'json:object') {
				return objectCompletion(n2, n2.expectation, ctx, true)
			} else if (n2.expectation?.type === 'json:union') {
				const expectation = n2.expectation.options.find(o => o.type === 'json:object')
				if (expectation) {
					return objectCompletion(n2, expectation as JsonObjectExpectation, ctx, true)
				}
			}
		}

		// Inside a string
		// { "foo": "|" }
		if (n0.type === 'json:string' && n0.expectation?.type === 'json:string') {
			return stringCompletion(n0.expectation, ctx, true)
		}

		// Values after an object property
		// { "foo": | }
		if (n0.type === 'json:property' && n0.value === undefined && ctx.offset >= n0.key.range.end && n1.type === 'json:object' && n1.expectation?.type === 'json:object' && n1.expectation.fields) {
			const field = n1.expectation.fields.find(f => f.key === n0.key.value)
			if (field?.value) {
				if (field.value.type === 'json:string') {
					return stringCompletion(field.value, ctx, false)
				}
				const comma = n1.properties.find(p => p.key.range.start > ctx.offset) !== undefined
				return valueCompletion(field.value, ctx, comma)
			}
		}

		// Values in an array
		// { "foo": [|] }
		if (n0.type === 'json:array' && n0.expectation?.type === 'json:array' && n0.expectation.items) {
			const comma = n0.items.find(i => i.range.start > ctx.offset) !== undefined
			return valueCompletion(n0.expectation.items, ctx, comma)
		}
	}
	return []
}

function objectCompletion(node: JsonObjectAstNode, expectation: JsonObjectExpectation, ctx: CompleterContext, quoted: boolean) {
	const comma = node.properties.find(p => p.key.range.start > ctx.offset) !== undefined
	if (expectation.fields) {
		return expectation.fields!
			.filter(f => !node.properties.find(p => f.key === p.key.value))
			.map(f => fieldCompletion(f, comma, quoted))
	} else if (expectation.keys) {
		return stringCompletion(expectation.keys, ctx, quoted)
	}
	return []
}

function fieldCompletion(field: Exclude<JsonObjectExpectation['fields'], undefined>[number], comma: boolean, quoted: boolean) {
	const value = field.value ? SIMPLE_SNIPPETS[field.value.type] : ''
	const text = `"${field.key}": ${value}${comma ? ',' : ''}`
	return CompletionItem.create(field.key, text, {
		kind: CompletionKind.Property,
		detail: field.value?.typedoc,
		sortText: `${field.deprecated ? 2 : field.opt ? 1 : 0}${field.key}`,
		deprecated: field.deprecated,
		...quoted ? { filterText: `"${field.key}"` } : {},
	})
}

function valueCompletion(expectation: JsonExpectation, ctx: CompleterContext, comma: boolean): CompletionItem[] {
	switch(expectation.type) {
		case 'json:object':
		case 'json:array':
		case 'json:string':
			return [simpleCompletion(SIMPLE_SNIPPETS[expectation.type], comma)]
		case 'json:boolean':
			return ['false', 'true'].map(v => simpleCompletion(v, comma))
		case 'json:number':
			return [simpleCompletion('0', comma)]
		case 'json:union':
			return expectation.options.reduce((a, o) => [
				...a,
				...valueCompletion(o, ctx, comma).filter(c => !a.find(t => t.label === c.label)),
			], [] as CompletionItem[])
	}
}

function simpleCompletion(value: string, comma: boolean) {
	return CompletionItem.create(value.replace('$1', ''), `${value}${comma ? ',' : ''}`, {
		kind: CompletionKind.Value,
	})
}

function stringCompletion(expectation: JsonStringExpectation, ctx: CompleterContext, quoted: boolean) {
	if (Array.isArray(expectation.pool)) {
		return expectation.pool.map(v => CompletionItem.create(v, `"${v}"`, {
			kind: CompletionKind.Value,
			...quoted ? { filterText: `"${v}"` } : {},
		}))
	} else if (typeof expectation.pool === 'string') {
		const symbols = Object.values(ctx.symbols.getVisibleSymbols(ctx.doc.uri, expectation.pool))
			.filter(s => s)
		if (symbols.length > 0) {
			return symbols.map(s => CompletionItem.create(s!.identifier, `"${s!.identifier}"`, {
				kind: CompletionKind.Method,
				...quoted ? { filterText: `"${s!.identifier}"` } : {},
			}))
		}
	}
	return [simpleCompletion(SIMPLE_SNIPPETS[expectation.type], false)]
}
