import type { AstNode, CompleterContext, RangeLike } from '@spyglassmc/core'
import { CompletionItem, CompletionKind, selectedLeaf } from '@spyglassmc/core'
import type { JsonArrayExpectation, JsonExpectation, JsonNode, JsonObjectExpectation, JsonStringExpectation } from '../node'
import { JsonArrayNode, JsonObjectNode, JsonPairNode, JsonStringNode } from '../node'

export const JsonTriggerCharacters = ['\n', ':', '"']

const SIMPLE_SNIPPETS = {
	'json:object': '{$1}',
	'json:array': '[$1]',
	'json:string': '"$1"',
	'json:boolean': '${1|false,true|}',
	'json:number': '${1:0}',
}

export function entry(root: JsonNode, ctx: CompleterContext): CompletionItem[] {
	const result = selectedLeaf(root, ctx.offset)
	if (result) {
		const [n0, n1, n2] = [result.leaf, ...result.parents] as AstNode[]

		// Object properties
		// { "foo": 1, | }
		if (JsonObjectNode.is(n0) && n0.expectation) {
			return unique(n0.expectation.filter(e => e.type === 'json:object')
				.flatMap(e => objectCompletion(ctx.offset, n0, e as JsonObjectExpectation, ctx, true)))
		}
		// { "foo": 1, "|" }
		if (n0.type === 'json:string' && n1.type === 'pair' && (n1 as JsonPairNode).key === n0 && JsonObjectNode.is(n2) && n2.expectation) {
			return unique(n2.expectation.filter(e => e.type === 'json:object')
				.flatMap(e => objectCompletion(n0, n2, e as JsonObjectExpectation, ctx, (n1 as JsonPairNode).value === undefined)))
		}

		// Inside a string
		// { "foo": "|" }
		if (JsonStringNode.is(n0) && n0.expectation) {
			return unique(n0.expectation.filter(e => e.type === 'json:string')
				.flatMap(e => stringCompletion(n0, e as JsonStringExpectation, ctx)))
		}

		// Values after an object property
		// { "foo": | }
		if (JsonPairNode.is(n0) && n0.value === undefined && n0.key && ctx.offset >= n0.key.range.end && JsonObjectNode.is(n1) && n1.expectation) {
			return unique(n1.expectation.filter(e => e.type === 'json:object' && e.fields)
				.map(e => (e as JsonObjectExpectation).fields!.find(f => f.key === n0.key?.value)!)
				.flatMap(f => valueCompletion(ctx.offset, f.value!, ctx)))
		}

		// Values in an array
		// { "foo": [|] }
		if (JsonArrayNode.is(n0) && n0.expectation) {
			return unique(n0.expectation.filter(e => e.type === 'json:array' && e.items)
				.flatMap(e => valueCompletion(ctx.offset, (e as JsonArrayExpectation).items!, ctx)))
		}
	}
	return []
}

function objectCompletion(range: RangeLike, node: JsonObjectNode, expectation: JsonObjectExpectation, ctx: CompleterContext, insertValue: boolean): CompletionItem[] {
	if (expectation.fields) {
		return expectation.fields!
			.filter(f => !node.children.find(p => f.key === p.key?.value))
			.map(f => fieldCompletion(range, f, insertValue))
	} else if (expectation.keys) {
		return expectation.keys.flatMap(e => stringCompletion(range, e, ctx)
			.map(c => ({
				...c,
				...insertValue ? { insertText: `${c.insertText}: ` } : {},
			})))
	}
	return []
}

function fieldCompletion(range: RangeLike, field: Exclude<JsonObjectExpectation['fields'], undefined>[number], insertValue: boolean): CompletionItem {
	const value = field.value?.[0] ? SIMPLE_SNIPPETS[field.value[0].type] : ''
	const text = `"${field.key}"${insertValue ? `: ${value}` : ''}`
	return CompletionItem.create(field.key, range, text, {
		kind: CompletionKind.Property,
		detail: field.value?.map(e => e.typedoc).join(' | '),
		sortText: `${field.deprecated ? 2 : field.opt ? 1 : 0}${field.key}`,
		deprecated: field.deprecated,
		filterText: `"${field.key}"`,
	})
}

function valueCompletion(range: RangeLike, expectation: JsonExpectation[], ctx: CompleterContext): CompletionItem[] {
	return unique(expectation.flatMap(e => {
		switch (e.type) {
			case 'json:object':
			case 'json:array':
				return [simpleCompletion(range, SIMPLE_SNIPPETS[e.type])]
			case 'json:string':
				return stringCompletion(ctx.offset, e, ctx)
			case 'json:boolean':
				return ['false', 'true'].map(v => simpleCompletion(range, v))
			case 'json:number':
				return [simpleCompletion(range, '0')]
		}
	}))
}

function stringCompletion(range: RangeLike, expectation: JsonStringExpectation, ctx: CompleterContext): CompletionItem[] {
	if (Array.isArray(expectation.pool)) {
		return expectation.pool.map(v => CompletionItem.create(v, range, `"${v}"`, {
			kind: CompletionKind.Value,
			filterText: `"${v}"`,
		}))
	} else if (typeof expectation.pool === 'string') {
		const symbols = Object.values(ctx.symbols.getVisibleSymbols(ctx.doc.uri, expectation.pool))
			.filter(s => s)
		if (symbols.length > 0) {
			return symbols.map(s => CompletionItem.create(s!.identifier, range, `"${s!.identifier}"`, {
				kind: CompletionKind.Method,
				filterText: `"${s!.identifier}"`,
			}))
		}
	}
	return [simpleCompletion(range, SIMPLE_SNIPPETS[expectation.type])]
}

function simpleCompletion(range: RangeLike, value: string): CompletionItem {
	return CompletionItem.create(value.replace('$1', ''), range, `${value}`, {
		kind: CompletionKind.Value,
	})
}

function unique(completions: CompletionItem[]) {
	const ans: CompletionItem[] = []
	const labels = new Set<string>()
	completions.forEach(c => {
		if (!labels.has(c.label)) {
			labels.add(c.label)
			ans.push(c)
		}
	})
	return ans
}
