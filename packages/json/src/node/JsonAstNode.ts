import type { DeepReadonly, ItemNode, PairNode } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { JsonStringOptions } from '../parser/index.js'

export type JsonNode =
	| JsonObjectNode
	| JsonArrayNode
	| JsonStringNode
	| JsonNumberNode
	| JsonBooleanNode
	| JsonNullNode
export type JsonRelatedNode = JsonNode | JsonPairNode | JsonItemNode
export namespace JsonNode {
	export function is(node: core.AstNode): node is JsonNode {
		return (
			JsonObjectNode.is(node) ||
			JsonArrayNode.is(node) ||
			JsonStringNode.is(node) ||
			JsonNumberNode.is(node) ||
			JsonBooleanNode.is(node) ||
			JsonNullNode.is(node)
		)
	}

	export function isRelated(node: core.AstNode): node is JsonRelatedNode {
		return JsonNode.is(node) || JsonPairNode.is(node) || JsonItemNode.is(node)
	}
}

interface JsonBaseAstNode {
	expectation?: JsonExpectation[]
}

export type JsonExpectation =
	| JsonObjectExpectation
	| JsonArrayExpectation
	| JsonStringExpectation
	| JsonNumberExpectation
	| JsonBooleanExpectation
export namespace JsonExpectation {
	export function isArray(
		e: DeepReadonly<JsonExpectation>,
	): e is DeepReadonly<JsonArrayExpectation> {
		return (e as JsonArrayExpectation).type === 'json:array'
	}
	export function isObject(
		e: DeepReadonly<JsonExpectation>,
	): e is DeepReadonly<JsonObjectExpectation> {
		return (e as JsonObjectExpectation).type === 'json:object'
	}
	export function isString(
		e: DeepReadonly<JsonExpectation>,
	): e is DeepReadonly<JsonStringExpectation> {
		return (e as JsonStringExpectation).type === 'json:string'
	}
}

interface JsonBaseExpectation {
	typedoc: string
}

export interface JsonObjectExpectation extends JsonBaseExpectation {
	readonly type: 'json:object'
	fields?: {
		key: string
		value?: JsonExpectation[]
		opt?: boolean
		deprecated?: boolean
	}[]
	keys?: JsonStringExpectation[]
}
export interface JsonObjectNode
	extends core.RecordBaseNode<JsonStringNode, JsonNode>, JsonBaseAstNode
{
	readonly type: 'json:object'
}
export namespace JsonObjectNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is JsonObjectNode {
		return (obj as JsonObjectNode | undefined)?.type === 'json:object'
	}

	export function mock(range: core.RangeLike): JsonObjectNode {
		return {
			type: 'json:object',
			range: core.Range.get(range),
			children: [],
		}
	}
}
export type JsonPairNode = PairNode<JsonStringNode, JsonNode>
export namespace JsonPairNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonPairNode {
		return (obj as JsonPairNode).type === 'pair'
	}
}

export interface JsonArrayExpectation extends JsonBaseExpectation {
	readonly type: 'json:array'
	items?: JsonExpectation[]
}
export interface JsonArrayNode
	extends core.ListNode<JsonNode>, JsonBaseAstNode
{
	readonly type: 'json:array'
}
export namespace JsonArrayNode {
	export function is(obj: object | undefined): obj is JsonArrayNode {
		return (obj as JsonArrayNode | undefined)?.type === 'json:array'
	}

	export function mock(range: core.RangeLike): JsonArrayNode {
		return {
			type: 'json:array',
			range: core.Range.get(range),
			children: [],
		}
	}
}
export type JsonItemNode = ItemNode<JsonNode>
export namespace JsonItemNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonItemNode {
		return (obj as JsonItemNode).type === 'item'
	}
}

export interface JsonStringExpectation extends JsonBaseExpectation {
	readonly type: 'json:string'
	pool?: string[]
}
export namespace JsonStringExpectation {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonStringExpectation {
		return (obj as JsonStringExpectation).type === 'json:string'
	}
}
export interface JsonStringNode extends core.StringBaseNode, JsonBaseAstNode {
	readonly type: 'json:string'
}
export namespace JsonStringNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is JsonStringNode {
		return (obj as JsonStringNode | undefined)?.type === 'json:string'
	}

	export function mock(range: core.RangeLike): JsonStringNode {
		return {
			...core.StringNode.mock(range, JsonStringOptions),
			type: 'json:string',
		}
	}
}

export interface JsonNumberExpectation extends JsonBaseExpectation {
	readonly type: 'json:number'
}
export interface JsonNumberNode extends JsonBaseAstNode, core.AstNode {
	readonly type: 'json:number'
	readonly children: [core.LongNode | core.FloatNode],
	readonly value: core.LongNode | core.FloatNode
}
export namespace JsonNumberNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonNumberNode {
		return (obj as JsonNumberNode).type === 'json:number'
	}
}

export interface JsonBooleanExpectation extends JsonBaseExpectation {
	readonly type: 'json:boolean'
}
export interface JsonBooleanNode extends core.BooleanBaseNode, JsonBaseAstNode {
	readonly type: 'json:boolean'
}
export namespace JsonBooleanNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonBooleanNode {
		return (obj as JsonBooleanNode).type === 'json:boolean'
	}
}

export interface JsonNullNode extends core.AstNode, JsonBaseAstNode {
	readonly type: 'json:null'
}
export namespace JsonNullNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonNullNode {
		return (obj as JsonNullNode).type === 'json:null'
	}
}
