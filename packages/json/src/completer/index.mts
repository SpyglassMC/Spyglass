import type { Completer, CompleterContext, MetaRegistry, RangeLike } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { CompletionItem, CompletionKind, Range } from '@spyglassmc/core'
import type { JsonArrayNode, JsonBooleanNode, JsonNode, JsonObjectExpectation, JsonObjectNode, JsonStringExpectation, JsonStringNode } from '../node/index.mjs'
import { JsonExpectation } from '../node/index.mjs'

export const JsonTriggerCharacters = ['\n', ':', '"']

const SIMPLE_SNIPPETS = {
	'json:object': '{$1}',
	'json:array': '[$1]',
	'json:string': '"$1"',
	'json:boolean': '${1|false,true|}',
	'json:number': '${1:0}',
}

export const entry: Completer<JsonNode> = (node, ctx) => {
	return core.completer.dispatch(node, ctx)
}

export const object: Completer<JsonObjectNode> = core.completer.record<JsonStringNode, JsonNode, JsonObjectNode>({
	key: (record, pair, ctx, range, insertValue, insertComma) => {
		if (record.expectation) {
			return unique(record.expectation.filter(JsonExpectation.isObject)
				.flatMap(e => objectCompletion(range, record, e, ctx, insertValue, insertComma, pair?.key?.value)))
		}
		return []
	},
	value: (record, pair, ctx) => {
		if (pair.value && !Range.isEmpty(pair.value)) {
			return core.completer.dispatch(pair.value, ctx)
		}
		if (record.expectation) {
			return unique(record.expectation.filter(JsonExpectation.isObject)
				.filter(e => e.fields)
				.map(e => e.fields!.find(f => f.key === pair.key?.value)!)
				.flatMap(f => valueCompletion(ctx.offset, f.value!, ctx)))
		}
		return []
	},
})

export const array: Completer<JsonArrayNode> = (node, ctx) => {
	const index = core.binarySearch(node.children, ctx.offset, (n, o) => n.sep
		? Range.compareOffset(Range.translate(n, 0, -1), o, true)
		: Range.compareOffset(n.range, o, true)
	)
	const item = index >= 0 ? node.children[index] : undefined
	if (item?.value) {
		return core.completer.dispatch(item.value, ctx)
	}

	if (node.expectation && Range.contains(Range.translate(node, 1, -1), ctx.offset, true)) {
		return unique(node.expectation.filter(JsonExpectation.isArray)
			.filter(e => e.items)
			.flatMap(e => valueCompletion(ctx.offset, e.items!, ctx)))
	}
	return []
}

export const boolean: Completer<JsonBooleanNode> = (node) => {
	return ['false', 'true'].map(v => simpleCompletion(node, v))
}

const string: Completer<JsonStringNode> = (node, ctx) => {
	if (node.children?.length) {
		return core.completer.string(node, ctx)
	}
	if (node.expectation) {
		return unique(node.expectation.filter(JsonExpectation.isString)
			.flatMap(e => stringCompletion(node, e, ctx)))
	}
	return []
}

function objectCompletion(range: RangeLike, node: JsonObjectNode, expectation: JsonObjectExpectation, ctx: CompleterContext, insertValue: boolean, insertComma: boolean, selectedKey: string | undefined): CompletionItem[] {
	if (expectation.fields) {
		return expectation.fields!
			.filter(f => f.key === selectedKey || !node.children.find(p => f.key === p.key?.value))
			.map(f => fieldCompletion(range, f, insertValue, insertComma))
	} else if (expectation.keys) {
		return expectation.keys.flatMap(e => stringCompletion(range, e, ctx)
			.map(c => ({
				...c,
				...insertValue ? { insertText: `${c.insertText}: ${insertComma ? ',' : ''}` } : {},
			})))
	}
	return []
}

function fieldCompletion(range: RangeLike, field: Exclude<JsonObjectExpectation['fields'], undefined>[number], insertValue: boolean, insertComma: boolean): CompletionItem {
	const value = field.value?.[0] ? SIMPLE_SNIPPETS[field.value[0].type] : ''
	return CompletionItem.create(field.key, range, {
		kind: CompletionKind.Property,
		detail: field.value?.map(e => e.typedoc).join(' | '),
		sortText: `${field.deprecated ? 2 : field.opt ? 1 : 0}${field.key}`,
		deprecated: field.deprecated,
		filterText: `"${field.key}"`,
		insertText: `"${field.key}"${insertValue ? `: ${value}` : ''}${insertComma ? ',' : ''}`,
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
		return expectation.pool.map(v => CompletionItem.create(v, range, {
			kind: CompletionKind.Value,
			filterText: `"${v}"`,
			insertText: `"${v}"`,
		}))
	}
	return [simpleCompletion(range, SIMPLE_SNIPPETS[expectation.type])]
}

function simpleCompletion(range: RangeLike, value: string): CompletionItem {
	return CompletionItem.create(value.replace('$1', ''), range, {
		kind: CompletionKind.Value,
		insertText: value,
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

export function register(meta: MetaRegistry): void {
	meta.registerCompleter('json:entry', entry)
	meta.registerCompleter<JsonArrayNode>('json:array', array)
	meta.registerCompleter<JsonBooleanNode>('json:boolean', boolean)
	meta.registerCompleter<JsonObjectNode>('json:object', object)
	meta.registerCompleter<JsonStringNode>('json:string', string)
}
